const express = require("express");
const axios = require("axios");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { CustomError } = require("../../utility");
const logger = require("../../logger");
const PurchaseRequest = require("../../models/purchaseRequests");
const emailNotifications = require("../../emailing/emailNotifications");

require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

const services = {
  "Safaricom Airtime": {
    serviceID: 101,
    serviceCode: "SAFCOM",
  },
  "Airtel Airtime": {
    serviceID: 102,
    serviceCode: "AIRTEL",
  },
  "Telkom Airtime": {
    serviceID: 103,
    serviceCode: "TELKOM",
  },
  "KPLC Postpaid": {
    serviceID: 104,
    serviceCode: "KPLCPOSTPAID",
  },
  "KPLC Prepaid": {
    serviceID: 105,
    serviceCode: " KPLCPREPAID",
  },
};

const formatAccNumber = (_accNumber) => {
  if (_accNumber[0] === "0") {
    let _temp = _accNumber.split("");
    _temp.splice(0, 1, "254");
    return _temp.join("");
  }
  return _accNumber;
};

const getProvider = (_accNo) => {
  _accNo = formatAccNumber(_accNo);

  const serviceProviders = {
    safaricom: [
      "25470",
      "25471",
      "25472",
      "25474",
      "254757",
      "254758",
      "254759",
      "254768",
      "254769",
      "25479",
      "25411",
      "25411",
    ],
    airtel: [
      "25473",
      "254750",
      "254751",
      "254752",
      "254753",
      "254754",
      "254755",
      "254756",
      "254762",
      "25478",
      "25410",
    ],
    telkom: ["25477"],
    "kplc-prepaid": [],
    "kplc-postpaid": [],
    homelands: ["254744"],
    faiba: ["254747"],
    equitel: [""],
  };

  const _prefix1 = _accNo.substring(0, 6);
  const _prefix2 = _accNo.substring(0, 5);

  logger.log("info", "Setting service provider for " + _accNo);
  logger.info("prefix1 " + _prefix1 + ", prefix2: " + _prefix2);

  if (
    serviceProviders.safaricom.includes(_prefix1) ||
    serviceProviders.safaricom.includes(_prefix2)
  ) {
    return "Safaricom Airtime";
  } else if (
    serviceProviders.airtel.includes(_prefix1) ||
    serviceProviders.airtel.includes(_prefix2)
  ) {
    return "Airtel Airtime";
  } else if (
    serviceProviders.telkom.includes(_prefix1) ||
    serviceProviders.telkom.includes(_prefix2)
  ) {
    return "Telkom Airtime";
  } else {
    return;
  }
};
// helper functions
const purchaseTransaction = (_payload) => {
  const reqObject = JSON.stringify({
    Credentials: {
      merchantCode: process.env.MERCHANT_CODE,
      username: process.env.MERCHANT_USERNAME,
      password: process.env.MERCHANT_PASS,
    },
    Request: {
      transactionRef: uuidv4(),
      serviceID: _payload.serviceID,
      serviceCode: _payload.serviceCode,
      msisdn: _payload.accountNumber,
      accountNumber: _payload.accountNumber,
      amountPaid: _payload.amountPaid,
    },
  });

  logger.info(`Making Purchase for: ${reqObject}`);

  try {
    return axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": reqObject.length,
      },
      url: process.env.PAYMENT_API,
      data: reqObject,
    }).then(async (_response) => {
      // store response and request body
      const _newPurchase = new PurchaseRequest({
        purchaseBody: JSON.parse(reqObject),
        response: _response.data,
      });

      return await _newPurchase.save().then((_res) => {
        console.log("succesfully saved purchase");
        logger.info("succesfully saved purchase");

        const _data = _response.data;
        if (_data.status === "200") {
          logger.info("Succesfully purchased from favoured");
          return _data;
        }
        console.log(_data);
        return { error: _data };
      });
    });
  } catch (error) {
    logger.error("failed to make: " + error.message);
    console.log(error);
    return {
      error: new CustomError(
        "Problem connecting to Payment System.",
        "paymentError"
      ),
      _error: error,
    };
  }
};

const getToken = () => {
  let unirest = require("unirest");

  let req = unirest(
    "GET",
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
  )
    .headers({
      Authorization:
        "Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==",
    })
    .send()
    .end((res) => {
      if (res.error) throw new Error(res.error);
      console.log(res.raw_body);
    });
};

const transactionRoutes = (Transaction, Confirmation) => {
  const transactionsRouter = express.Router();

  transactionsRouter.route("/purchase").post(async (req, res) => {
    try {
      if (!req.body.accountNumber || !req.body.amountPaid) {
        logger.info("Purchase request failed, Missing info: " + req.body);
        res.status(400).json({
          errorMessage:
            "Missing info from purchase request. Amount and account number are required.",
        });
      }
      const _transaction = {
        date: new Date(),
        accountNumber: req.body.accountNumber,
        amount: req.body.amountPaid,
        statusCompleted: false,
      };

      const _accountProvider = getProvider(req.body.accountNumber);

      if (_accountProvider) {
        logger.info("Provider Set: " + _accountProvider);
        logger.info("Service Provider details: " + services[_accountProvider]);

        const _purchaseBody = {
          serviceID: services[_accountProvider].serviceID,
          serviceCode: services[_accountProvider].serviceCode,
          msisdn: formatAccNumber(req.body.accountNumber),
          accountNumber: formatAccNumber(req.body.accountNumber),
          amountPaid: `${parseInt(req.body.amountPaid)}`,
        };

        logger.info("Initiating purchase for: " + _purchaseBody);

        const _response = await purchaseTransaction(_purchaseBody);

        if (_response.error) {
          console.log("problem: ", _response._error);
          logger.info("Failed " + _response._error);
          throw _response.error;
        }
        _transaction.statusCompleted = true;
        _transaction.response = _response;

        const _newTransaction = new Transaction({
          ..._transaction,
          response: _response,
        });

        _newTransaction.save().then((_data) => {
          console.log("some: ", _data);
          logger.info("Succesful transaction " + _data);
          res.status(200).json(_response);
        });
      } else {
        logger.info("Confirmation failed: provider details false.");
        res.status(500).json({
          errorMessage: "Confirmation failed: provider details false.",
          details: req.body,
        });
      }
    } catch (_err) {
      // TODO: log error
      logger.error(_err);
      console.log(_err);
      res.status(500).json({
        errorMessage: "Sorry an error occured. Please try again.",
      });
    }
  });

  transactionsRouter.route("/validation").post(async (req, res) => {
    try {
      try {
        logger.info("validating ,mpesa payment: " + req.body);
        console.log("validating ,mpesa payment: " + req.body);
        const _serviceProvider = getProvider(req.body.BillRefNumber);

        logger.info("Provider Set: " + _serviceProvider);
        console.log("Provider Set: " + _serviceProvider);
        if (_serviceProvider) {
          if (parseInt(req.body.TransAmount) >= 5) {
            const _transaction = {
              dateInit: new Date(),
              details: req.body,
              ref: req.body.TransID,
              statusCompleted: false,
            };

            const _newTransaction = new Transaction({
              ..._transaction,
            });

            _newTransaction.save().then((_data) => {
              logger.info("Transaction succesfully saved " + _data._id);
              console.log("Transaction succesfully saved " + _data._id);
              res.status(200).json({
                ResultCode: 0,
                ResultDesc: "Accepted",
              });
            });
          } else {
            logger.info("Transaction failed: Value too low.");
            console.log("Transaction failed: Value too low.");
            res.status(400).json({
              resultCode: "C2B00013",
              resultDesc: "Rejected",
            });
          }
        } else {
          logger.info("Transaction failed! Invalid provider.");
          console.log("Transaction failed! Invalid provider.");
          res.status(400).json({
            resultCode: "C2B00012",
            resultDesc: "Rejected",
          });
        }
      } catch (_err) {
        // TODO: log error
        logger.error("Validation failed: " + _err.message);
        console.log("Validation failed: " + _err);
        res.status(500).json({
          resultCode: 1,
          resultDesc: "Rejected",
        });
      }
    } catch (_err) {
      console.log("ss: ", _err);
      logger.error(_err);
      res.status(500).json({
        resultCode: "C2B00016",
        resultDesc: "Rejected",
      });
    }
  });

  transactionsRouter.route("/confirmation").post(async (req, res) => {
    const _host = req.protocol + "://" + req.get("host") + "/";
    logger.info("confirmation request, mpesa payment: " + req.body);
    try {
      if (req.body) {
        const _accountProvider = getProvider(req.body.BillRefNumber);

        if (_accountProvider) {
          logger.info("Provider Set: " + _accountProvider);
          logger.info(
            "Service Provider details: " + services[_accountProvider]
          );

          console.log("account Prov: ", _accountProvider);
          console.log("account Prov: ", services[_accountProvider]);

          const _purchaseBody = {
            serviceID: services[_accountProvider].serviceID,
            serviceCode: services[_accountProvider].serviceCode,
            msisdn: formatAccNumber(req.body.BillRefNumber),
            accountNumber: formatAccNumber(req.body.BillRefNumber),
            amountPaid: `${parseInt(req.body.TransAmount)}`,
          };

          const _newTransaction = new Confirmation({
            confirmationDetails: req.body,
            purchaseBody: _purchaseBody,
          });

          _newTransaction.save().then((_data) => {
            logger.info("Transaction succesfully saved " + _data._id);
            console.log("Transaction succesfully saved " + _data._id);
          });

          const _response = await purchaseTransaction(_purchaseBody);
          if (_response.error) {
            console.log("error: ", _response.error);
            logger.info("Error completing purchase " + _response.error);
            // TODO: record send email for transaction to be manually done
            emailNotifications("failedTransaction", {
              redirectUrl: _host + "",
              transactionNumber: req.body.TransID,
              transactionDate: new Date(),
              amount: req.body.TransAmount,
            });
            console.log("do manual transaction");
            return res.json({
              ResponseCode: "1",
              ResultDesc: "",
            });
          }

          logger.info("Succesfully purchased");
          console.log("successfully purchased");

          let _transaction = await Transaction.findOneAndUpdate(
            { "details.TransID": req.body.TransID },
            { $set: { response: _response, statusCompleted: true } },
            { new: true, runValidators: true }
          ).then((_res) => {
            logger.info("succesfully saved to DB: " + _res);
            console.log("succesfully saved to DB: " + _res);
            return res.json({
              ResponseCode: 0,
              ResultDesc: "",
            });
          });

          // console.log(_transaction.json());
          // _transaction.statusCompleted = true;
          // _transaction.response = _response;
          // {
          //   "TransAmount": "5",
          //   "MSISDN": "254714744393",
          //   "BillRefNumber": "254714744393",
          //   "TransID": "string",
          //   "FirstName": "Oliver",
          //   "LastName": "Mirimu",
          //   "TransTime": "",
          //   "TransactionType": "Pay Bill",
          //   "BusinessShortCode": "929295",
          //   "InvoiceNumber": "",
          //   "MiddleName": "",
          //   "OrgAccountBalance": "",
          //   "ThirdPartyTransID": ""
          // }
        } else {
          logger.info("Confirmation failed: provider details false.");
          res.status(500).json({
            errorMessage: "Confirmation failed: provider details false.",
            details: req.body,
          });
        }
      }
    } catch (_err) {
      console.log(_err);
      logger.error("Failed to fetch history: " + _err);
      res.status(500).json({
        errorMessage: "Sorry an error occured. Please try again.",
      });
    }
  });
  transactionsRouter.route("/history").get((req, res) => {
    Transaction.find({})
      .then((_res) => {
        let _transactionsList = [];
        if (_res) {
          _transactionsList = _res.map((_item) => {
            const _newItem = _item.toJSON();

            delete _newItem.__v;
            return _newItem;
          });
        }
        return res.status(200).json(_transactionsList);
      })
      .catch((_err) => {
        console.log(_err);
        logger.error("Failed to fetch history: " + _err);
        res.status(500).json({
          errorMessage: "Sorry an error occured. Please try again.",
        });
      });
  });

  transactionsRouter.route("/float").get((req, res) => {
    Transaction.findOne({})
      .sort({
        time: -1,
      })
      .then((_res) => {
        const [toDiscard, ..._float] = _res.response.message.split(".");
        logger.info("Float balance fetched: ", _float.join("."));
        res.status(200).json({
          message: _float.join("."),
        });
      })
      .catch((_err) => {
        logger.error("Failed to fetch float: " + _err);
        res.status(500).json({
          errorMessage: "Sorry an error occured. Please try again.",
        });
      });
  });

  return transactionsRouter;
};

module.exports = transactionRoutes;

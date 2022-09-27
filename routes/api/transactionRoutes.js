const express = require("express");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { CustomError } = require("../../utility");
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

const services = {
  "Safaricom Airtime": {
    serviceID: 101,
    serviceCode: "SAFCOM",
  },
  "Airtel Airtime ": {
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

const getProvider = (_accNo) => {
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
      "254785",
      "254786",
      "254787",
      "254788",
      "254789",
      "25410",
      "25410",
      "25410",
    ],
    telkom: ["25477"],
    "kplc-prepaid": [],
    "kplc-postpaid": [],
  };

  if (_accNo[0] == 0) {
    let _updatedAcc = _accNo.split("");
    _updatedAcc.splice(0, 1, "254");
    _accNo = _updatedAcc.join("");
  }

  const _prefix1 = _accNo.substring(0, 5);
  const _prefix2 = _accNo.substring(0, 3);

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

const testTransaction = (_payload) => {
  const reqObject = JSON.stringify(_payload);

  console.log("request: ", reqObject);
  try {
    return axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": reqObject.length,
      },
      url: "https://5435-105-160-115-74.in.ngrok.io/test",
      data: reqObject,
    }).then((_response) => {
      const _data = _response.data;
      if (_data.status === "200") return _data;
      console.log(_data.message);
    });
  } catch (error) {
    return {
      error: new CustomError(
        "Problem connecting to Payment System.",
        "paymentError"
      ),
      _error: error,
    };
  }
};
// helper functions
const purchaseTransaction = (_payload) => {
  console.log(_payload);
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

  console.log("request: ", reqObject);
  try {
    return axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": reqObject.length,
      },
      url: process.env.PAYMENT_API,
      data: reqObject,
    }).then((_response) => {
      const _data = _response.data;
      if (_data.status === "200") return _data;
      console.log(_data.message);
      return { errorMessage: _data.message, error: "paymentError" };
    });
  } catch (error) {
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

const transactionRoutes = (Transaction) => {
  const transactionsRouter = express.Router();

  transactionsRouter.route("/purchase").post(async (req, res) => {
    try {
      const _transaction = {
        accountNumber: req.body.accountNumber,
        amount: req.body.amountPaid,
        statusComplete: false,
      };

      const _response = await purchaseTransaction(req.body);
      if (_response.error) {
        console.log("problem: ", _response._error);
        throw _response.error;
      }
      _transaction.statusComplete = true;
      _transaction.response = _response;

      Transaction.create({
        ..._transaction,
        response: JSON.stringify(_response),
        accountNumber: req.body.accountNumber,
        amount: req.body.amountPaid,
      }).then((_data) => {
        // console.log("some: ", _data.toJSON());
        res.status(200).json(_response);
      });
    } catch (_err) {
      // TODO: log error
      res.status(500).json({
        errorMessage: "Sorry an error occured. Please try again.",
      });
    }
  });

  transactionsRouter.route("/validation").post(async (req, res) => {
    try {
      // testTransaction(req.body);
      try {
        console.log("some: ", req.body);
        fs.writeFileSync(
          __dirname + "/validation.txt",
          JSON.stringify(req.body)
        );
        if (getProvider(req.body.MSISDN || req.body.msisdn)) {
          if (parseInt(req.body.TransAmount || req.body.transAmount) >= 5) {
            const _transaction = {
              details: JSON.stringify(req.body),
              ref: req.body.billRefNumber,
              statusComplete: false,
              amount: req.body.TransAmount || req.body.transAmount,
            };

            Transaction.create({
              ..._transaction,
            }).then((_data) => {
              console.log("some: ", _data.toJSON());
              res.status(200).json({
                ResultCode: 0,
                ResultDesc: "Accepted",
              });
            });
          } else {
            res.status(400).json({
              resultCode: "C2B00013",
              resultDesc: "Rejected",
            });
          }
        } else {
          res.status(400).json({
            ...req.body,
            resultCode: "C2B00012",
            resultDesc: "Rejected",
          });
        }
      } catch (_err) {
        // TODO: log error
        console.log("error: ", _err);
        res.status(500).json({
          resultCode: 1,
          resultDesc: "Rejected",
        });
      }
    } catch (_err) {
      fs.writeFileSync(
        __dirname + "/validation-error.txt",
        JSON.stringify(req.body)
      );
      console.log("ss: ", _err);
      res.status(500).json({
        resultCode: "C2B00016",
        resultDesc: "Rejected",
      });
    }
  });

  transactionsRouter.route("/confirmation").post(async (req, res) => {
    console.log("confirmation: ", req.body);
    testTransaction(req.body);
    if (req.body) {
      const _accountProvider = getProvider(req.body.MSISDN || req.body.msisdn);

      const _purchaseBody = {
        serviceID: services[_accountProvider].serviceID,
        serviceCode: services[_accountProvider].serviceCode,
        msisdn: req.body.MSISDN || req.body.msisdn,
        accountNumber: req.body.MSISDN || req.body.msisdn,
        amountPaid: parseInt(req.body.TransAmount || req.body.transAmount),
      };

      console.log("purchase: ", _purchaseBody);
      const _response = await purchaseTransaction(_purchaseBody);
      if (_response.error) {
        console.log("error: ", _response.error);
        // TODO: record send email for transaction to be manually done
        console.log("do manual transaction");
        return res.json({
          ResponseCode: "1",
          ResultDesc: "",
        });
      }

      Transaction.update(
        {
          statusComplete: true,
          response: JSON.stringify(_response),
        },
        { where: { ref: req.body.billRefNumber } }
      )
        .then((_res) => {
          console.log("done: ", _res);
        })
        .catch((_err) => {
          fs.writeFileSync(
            __dirname + "/confirmation-save-error.txt",
            JSON.stringify(_err)
          );
          console.log("error: ", _err);
        });

      console.log("successfully purchased");
      return res.json({
        ResponseCode: 0,
        ResultDesc: "",
      });
      // let _transaction = await Transaction.findOneAndUpdate({}, {});
      // console.log(_transaction)
      // _transaction.statusComplete = true;
      // _transaction.response = _response;
      //       {
      //   "transAmount": "string",
      //   "msisdn": "string",
      //   "billRefNumber": "string",
      //   "transID": "string",
      //   "firstName": "string",
      //   "lastName": "string",
      //   "transTime": "string",
      //   "transactionType": "string",
      //   "businessShortCode": "string",
      //   "invoiceNumber": "string",
      //   "middleName": "string",
      //   "orgAccountBalance": "string",
      //   "thirdPartyTransID": "string"
      // }
    }
  });

  transactionsRouter.route("/history").get((req, res) => {
    Transaction.findAll()
      .then((_res) => {
        let _transactionsList = [];
        if (_res) {
          _transactionsList = _res.map((_item) => {
            const _newItem = _item.toJSON();
            console.log("ss: ", _newItem);
            return _newItem;
          });
        }
        return res.status(200).json(_transactionsList);
      })
      .catch((_err) => {
        console.log(_err);
        res.status(500).json({
          errorMessage: "Sorry an error occured. Please try again.",
        });
      });
  });

  transactionsRouter.route("/float").get((req, res) => {
    Transaction.findOne({ order: [["updatedAt", "DESC"]] })
      .then((_res) => {
        const [toDiscard, ..._float] = _res.response.message.split(".");
        res.status(200).json({
          message: _float.join("."),
        });
      })
      .catch((_err) => {
        res.status(500).json({
          errorMessage: "Sorry an error occured. Please try again.",
        });
      });
  });

  transactionsRouter.route("/float").get((req, res) => {});

  return transactionsRouter;
};

module.exports = transactionRoutes;

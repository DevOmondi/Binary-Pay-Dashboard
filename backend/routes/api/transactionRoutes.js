const express = require("express");
const axios = require("axios");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { CustomError } = require("../../utility");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const services = {
  "Safaricom Airtime": { serviceID: 101, serviceCode: "SAFCOM" },
  "Airtel Airtime ": { serviceID: 102, serviceCode: "AIRTEL" },
  "Telkom Airtime": { serviceID: 103, serviceCode: "TELKOM" },
  "KPLC Postpaid": { serviceID: 104, serviceCode: "KPLCPOSTPAID" },
  "KPLC Prepaid": { serviceID: 105, serviceCode: " KPLCPREPAID" },
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
 console.log(reqObject)

  return axios({
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": reqObject.length,
    },
    url: process.env.PAYMENT_API,
    data: reqObject,
  })
    .then((_response) => {
      const _data = _response.data;
      if (_data.status === "200") return _data;
      throw new CustomError(_data.message, "paymentError");
    })
    .catch((_err) => {
      console.log(_err)
     /* throw new CustomError(
        "Problem connecting to Payment System.",
        "paymentError"
      );*/
    });
};

const transactionRoutes = (Transaction) => {
  const transactionsRouter = express.Router();

  transactionsRouter.route("/purchase").post(async (req, res) => {
    try {
      const _response = await purchaseTransaction(req.body);
      const _newTransaction = new Transaction({
        date: new Date(),
        response: _response,
        accountNumber: req.body.accountNumber,
        amount: req.body.amountPaid,
      });

      _newTransaction.save().then((_data) => {
        console.log("some: ", _data);
        res.status(200).json(_response);
      });
    } catch (_err) {
      console.log("ss: ", _err);
      res
        .status(500)
        .json({ errorMessage: "Sorry an error occured. Please try again." });
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
        res
          .status(500)
          .json({ errorMessage: "Sorry an error occured. Please try again." });
      });
  });

  transactionsRouter.route("/float").get((req, res) => {
    Transaction.findOne({})
      .sort({ time: -1 })
      .then((_res) => {
        const [toDiscard, ..._float] = _res.response.message.split(".");
        res.status(200).json({ message: _float.join(".") });
        console.log(_float)
      })
      .catch((_err) => {
        console.log(_err);
        res
          .status(500)
          .json({ errorMessage: "Sorry an error occured. Please try again." });
      });
  });

  
  return transactionsRouter;
};

module.exports = transactionRoutes;

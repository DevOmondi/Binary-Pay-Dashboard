const express = require("express");
const axios = require("axios");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
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
      username: process.env.USERNAME,
      password: process.env.MERCHANT_PASS,
    },
    Request: {
      transactionRef: uuidv4(),
      serviceID: _payload.serviceID,
      serviceCode: _payload.serviceCode,
      msisdn: _payload.msisdn,
      accountNumber: _payload.accountNumber,
      amountPaid: _payload.ammountPaid,
    },
  });

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
      if (_data.status === 200) return _data;
      throw new CustomError(_data.message, "paymentError");
    })
    .catch((_err) => {
      throw new CustomError(
        "Problem connecting to Payment System.",
        "paymentError"
      );
    });
};

const transactionRoutes = () => {
  const transactionsRouter = express.Router();

  transactionRoutes.post("/purchase", (req, res) => {
    try {
      console.log(req.body);
      //   const _response = purchaseTransaction(req.body);
      //   res.status(200).json(_response);
    } catch (_err) {
      console.log(_err);
      res
        .status(500)
        .json({ errorMessage: "Sorry an error occured. Please try again." });
    }
  });

  return transactionsRouter;
};

module.exports = transactionRoutes;

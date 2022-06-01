const express = require("express");

const transactionsRoutes = (Transaction) => {
  const transactionsRouter = express.Router();

  transactionsRouter.route("/revenue").post((req, res) => {
    const constraints = { ...req.body };
    console.log("contraints: ", constraints);
    // fetch from api
  });

    transactionsRouter.route("/revenue").post((req, res) => {
      const constraints = { ...req.body };
      console.log("contraints: ", constraints);
      // fetch from api
    });

  return transactionsRouter;
};

module.exports = transactionsRoutes;

const transactionSchema = (sequelize, Sequelize) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      amount: { type: Sequelize.STRING },
      accountNumber: { type: Sequelize.STRING },
      response: { type: Sequelize.STRING(1000) },
      details: { type: Sequelize.STRING(1000) },
      statusComplete: { type: Sequelize.BOOLEAN },
      ref: { type: Sequelize.STRING },
    },
    { timestamps: true }
  );

  return Transaction;
};

module.exports = transactionSchema;

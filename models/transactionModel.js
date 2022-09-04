const transactionSchema = (sequelize, Sequelize) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      amount: { type: Sequelize.STRING },
      accountNumber: { type: Sequelize.STRING },
      response: { type: Sequelize.JSONB },
      statusComplete: { type: Sequelize.BOOLEAN },
    },
    { timestamps: true }
  );

  return Transaction;
};
module.exports = transactionSchema;

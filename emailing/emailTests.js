const emailNotifications = require("./emailNotifications");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

await emailNotifications(
  "newOrder",
  {
    redirectUrl: process.env.ADMIN_APP + "/order-manager",
    order,
  },
  process.env.ADMIN_EMAIL
);
// console.log("working");

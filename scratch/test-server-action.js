require("dotenv").config({ path: ".env" });
const { getDashboardDataAction } = require("./app/action/dashboard-actions");

async function test() {
  try {
    const data = await getDashboardDataAction();
    console.log("Success! Data:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}
test();

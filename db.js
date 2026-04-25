const oracledb = require("oracledb");
    
async function getConnection() {
  return await oracledb.getConnection({
    user: "your_user",
      password: "your_password",

  connectString: "localhost/XE"
  });
}

module.exports = { getConnection };

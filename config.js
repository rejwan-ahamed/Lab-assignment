var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "lab2023",
});

con.connect((err) => {
  if (err) {
    console.log("database not connected");
  } else {
    console.log("database is connected");
  }
});

// con.query("select * from `admin-login` where email='test'", (error, result, field) => {
//   if (error) {
//     console.log("error in query");
//   }
//   console.log(result.length);
// });

module.exports = con;

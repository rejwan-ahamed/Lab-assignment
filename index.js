const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const con = require("./config.js");
const cors = require("cors");
const nodemailer = require("nodemailer");

// middle wars
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

/////////////////////////// main api part start from here /////////////////////////////

app.get("/", (req, res) => {
  res.send("LAB assignment api v-1.1(alpha)");
});

// admin login api start here
app.get("/admin_login", (req, res) => {
  const data = [req.query.email, req.query.password];
  con.query(
    "select * from `admin-login` where email=? and password=?",
    data,
    (error, result, field) => {
      res.send({ length: result.length, adminData: result });
    }
  );
});

// create group api
app.post("/create_group", (req, res) => {
  const data = req.body;
  con.query("insert into `group` set ?", data, (error, result, field) => {
    if (error) {
      res.send("error in create group api");
    }
    res.send(result);
  });
});

// getting all the group data
app.get("/all_groups", (req, res) => {
  con.query(
    "select * from `group` order by id desc",
    (error, result, field) => {
      res.send(result);
    }
  );
});

// search group already exist api
app.get("/single_group", (req, res) => {
  const data = req.query.group;
  console.log(data);
  con.query(
    "select * from `group` where groupName=?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in student single data query");
      }
      const groupLength = result;
      res.send({ length: groupLength.length });
    }
  );
});

// update or assign group leader
app.put("/assign_leader", (req, res) => {
  const data = [req.body.Leader, req.body.groupName];
  con.query(
    "update `group` set Leader =? where groupName =?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in assign group leader api");
      }
      res.send(result);
    }
  );
});

// register student
app.post("/register", (req, res) => {
  const data = req.body;
  con.query("insert into `register` set ?", data, (error, result, field) => {
    if (error) {
      res.send("error in register api");
    }
    res.send(result);
  });
});

// add question
app.post("/add_question", (req, res) => {
  const data = req.body;
  con.query("insert into `questions` set ?", data, (error, result, field) => {
    if (error) {
      res.send("error in add question api");
    }
    res.send(result);
  });
});

// answer question
app.post("/answer", (req, res) => {
  const data = req.body;
  con.query(" insert into `answers` set ?", data, (error, result, field) => {
    if (error) {
      res.send("error in answer api");
    }
    res.send(result);
  });
});

// search single student data
app.get("/single_student_data", (req, res) => {
  const data = req.query.roll;
  console.log(data);
  con.query(
    "select * from `register` where roll=?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in student single data query");
      }
      res.send(result);
    }
  );
});

// update student status
app.put("/Update_student_status", (req, res) => {
  const data = [req.body.groupName, req.body.status, req.body.roll];
  con.query(
    "update `register` set groupName=? , status =? where roll =?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in assign group leader api");
      }
      res.send(result);
    }
  );
});

// roll exist api
app.get("/single_roll", (req, res) => {
  const data = req.query.roll;
  console.log(data);
  con.query(
    "select * from `register` where roll=?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in student single data query");
      }
      const groupLength = result;
      res.send({ length: groupLength.length });
    }
  );
});

// student login
app.get("/student_login", (req, res) => {
  const data = [req.query.roll, req.query.password];
  con.query(
    "select * from `register` where roll=? and password=?",
    data,
    (error, result, field) => {
      res.send({ length: result.length, userData: result });
    }
  );
});

// get question by group name and leader roll
app.get("/get_group_question", (req, res) => {
  const data = [req.query.roll, req.query.groupName];
  con.query(
    "select * from `questions` where leader=? and groupName=? order by id desc",
    data,
    (error, result, field) => {
      res.send({ length: result.length, questions: result });
    }
  );
});

// get question by group name
app.get("/get_group_question_name", (req, res) => {
  const data = [req.query.groupName];
  con.query(
    "select * from `questions` where groupName=? order by id desc",
    data,
    (error, result, field) => {
      res.send({ length: result.length, questions: result });
    }
  );
});
// get single question by question id
app.get("/get_single_question", (req, res) => {
  const data = [req.query.id];
  con.query(
    "select * from `questions` where id=?",
    data,
    (error, result, field) => {
      res.send(result);
    }
  );
});

// get single user answer list by roll
app.get("/get_single_user_answer_list", (req, res) => {
  const data = [req.query.roll];
  con.query(
    "select * from `answers` where answer_by_roll=? order by id desc",
    data,
    (error, result, field) => {
      res.send(result);
    }
  );
});

// get single user answer count
app.get("/get_single_user_answer_count", (req, res) => {
  const data = [req.query.roll];
  con.query(
    "select * from `answers` where answer_by_roll=? order by id desc",
    data,
    (error, result, field) => {
      res.send({ length: result.length });
    }
  );
});

// get single answer by id
app.get("/get_single_answer", (req, res) => {
  const data = [req.query.id];
  con.query(
    "select * from `answers` where id=?",
    data,
    (error, result, field) => {
      res.send(result);
    }
  );
});

// get all value from register by group
app.get("/get_all_register", (req, res) => {
  const data = [req.query.group];
  con.query(
    "select * from `register` where groupName=?",
    data,
    (error, result, field) => {
      res.send(result);
    }
  );
});

// set user question answer count

app.put("/user_ans_update_count", (req, res) => {
  const data = [req.body.submition, req.body.roll];
  con.query(
    "update `register` set submition =? where roll =?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in assign group leader api");
      }
      res.send(result);
    }
  );
});

// answer exist api
app.get("/answer_exist", (req, res) => {
  const data = [req.query.id, req.query.roll];
  console.log(data);
  con.query(
    "select * from `answers` where questionID=? and answer_by_roll=?",
    data,
    (error, result, field) => {
      res.send({ length: result.length });
    }
  );
});

// delete question
app.delete("/delete_question", (req, res) => {
  const data = [req.query.id];
  console.log(data);
  con.query(
    "delete from `questions` where id=?",
    data,
    (error, result, field) => {
      res.send(result);
    }
  );
});

// update question
app.put("/update_question", (req, res) => {
  const data = [req.body.question, req.body.id];
  console.log(data);
  con.query(
    "update `questions` set question=? where id =?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in assign group leader api");
      }
      res.send(result);
    }
  );
});

// otp section start here
app.get("/otp_data", (req, res) => {
  const data = req.query.roll;
  console.log(data);
  con.query(
    "select * from `register` where roll=?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in student single data query");
      }
      res.send(result);
    }
  );
});

// otp update

app.put("/update_otp", (req, res) => {
  const data = [req.body.otp, req.body.email];
  const otpMain = req.body.otp;
  console.log(data);
  con.query(
    "update `register` set otp =? where email =?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in assign group leader api");
      }
      res.send(result);

      async function main() {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "mail.api2023.xyz",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "noreply@api2023.xyz", // your cPanel email address
            pass: "#Deadpoolback292#", // your cPanel email password
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"OTP for password recovery" <noreply@api2023.xyz>', // sender address
          to: "rejwanahamed85@gmail.com", // list of receivers
          subject: "Password recovery otp", // Subject line
          text: "Coding Day?", // plain text body
          html: `<p>Your password recovery OTP is <b>${otpMain}<b/></p>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
      }

      main().catch(console.error);
    }
  );
});

app.listen(port, () => {
  console.log(`api listening port is ${port}`);
});

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
  // console.log(data);
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
  console.log(data);
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
  // console.log(data);
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
  // console.log(data);
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
  const data = [req.query.roll, req.query.group];
  con.query(
    "select * from `answers` where answer_by_roll=? and groupName=? order by id desc",
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
  // console.log(data);
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
  // console.log(data);
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
  // console.log(data);
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
  // console.log(data);
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
  const email = req.body.email;
  // console.log(data);
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
            user: "test@api2023.xyz", // your cPanel email address
            pass: "rW.tMnD~ug2#", // your cPanel email password
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"OTP for password recovery" <test@api2023.xyz>', // sender address
          to: `${email}`, // list of receivers
          subject: "Password recovery otp", // Subject line
          text: "Coding Day?", // plain text body
          html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
          <!--[if gte mso 9]>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
            <title></title>
            
              <style type="text/css">
                @media only screen and (min-width: 520px) {
            .u-row {
              width: 500px !important;
            }
            .u-row .u-col {
              vertical-align: top;
            }
          
            .u-row .u-col-100 {
              width: 500px !important;
            }
          
          }
          
          @media (max-width: 520px) {
            .u-row-container {
              max-width: 100% !important;
              padding-left: 0px !important;
              padding-right: 0px !important;
            }
            .u-row .u-col {
              min-width: 320px !important;
              max-width: 100% !important;
              display: block !important;
            }
            .u-row {
              width: 100% !important;
            }
            .u-col {
              width: 100% !important;
            }
            .u-col > div {
              margin: 0 auto;
            }
          }
          body {
            margin: 0;
            padding: 0;
          }
          
          table,
          tr,
          td {
            vertical-align: top;
            border-collapse: collapse;
          }
          
          p {
            margin: 0;
          }
          
          .ie-container table,
          .mso-container table {
            table-layout: fixed;
          }
          
          * {
            line-height: inherit;
          }
          
          a[x-apple-data-detectors='true'] {
            color: inherit !important;
            text-decoration: none !important;
          }
          
          table, td { color: #f1f1f1; } @media (max-width: 480px) { #u_content_image_1 .v-container-padding-padding { padding: 30px 10px 11px !important; } #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 80% !important; } }
              </style>
            
            
          
          </head>
          
          <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #000000;color: #f1f1f1">
            <!--[if IE]><div class="ie-container"><![endif]-->
            <!--[if mso]><div class="mso-container"><![endif]-->
            <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #000000;width:100%" cellpadding="0" cellspacing="0">
            <tbody>
            <tr style="vertical-align: top">
              <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #000000;"><![endif]-->
              
          
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                
          <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
            <div style="height: 100%;width: 100% !important;">
            <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
            
          <table id="u_content_image_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                  
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right: 0px;padding-left: 0px;" align="center">
                
                <img align="center" border="0" src="https://firebasestorage.googleapis.com/v0/b/database-b8ba9.appspot.com/o/open%20source%20logo.svg?alt=media&token=5dcb90c5-3de0-4e63-b307-377615661849" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 50%;max-width: 150px;" width="150" class="v-src-width v-src-max-width"/>
                
              </td>
            </tr>
          </table>
          
                </td>
              </tr>
            </tbody>
          </table>
          
          <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                  
            <div style="line-height: 140%; text-align: center; word-wrap: break-word;">
              <p style="line-height: 140%;">Your password recovery OTP is <strong>${otpMain}</strong></p>
            </div>
          
                </td>
              </tr>
            </tbody>
          </table>
          
            <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          
          
              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
              </td>
            </tr>
            </tbody>
            </table>
            <!--[if mso]></div><![endif]-->
            <!--[if IE]></div><![endif]-->
          </body>
          
          </html>
          `, // html body
        });

        console.log("Message sent: %s", info.messageId);
      }

      main().catch(console.error);
    }
  );
});

// otp match
app.get("/otp_match", (req, res) => {
  const data = [req.query.email, req.query.otp];
  // console.log(data);
  con.query(
    "select * from `register` where email=? and otp=?",
    data,
    (error, result, field) => {
      res.send({ length: result.length, adminData: result });
    }
  );
});

// update password
app.put("/update_password", (req, res) => {
  const data = [req.body.password, req.body.email];
  con.query(
    "update `register` set password =? where email =?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in assign group leader api");
      }
      res.send(result);
    }
  );
});

// user question ans list
app.get("/single_user_ans_list", (req, res) => {
  const data = [req.query.roll];
  // console.log(data);
  con.query(
    "select * from `answers` where answer_by_roll=?",
    data,
    (error, result, field) => {
      res.send(result);
    }
  );
});

// comment ans
app.post("/comment_ans", (req, res) => {
  const data = req.body;
  con.query("insert into `comments` set ?", data, (error, result, field) => {
    if (error) {
      res.send("error in create group api");
    }
    res.send(result);
  });
});

// comment ans
app.get("/single_ans_comments", (req, res) => {
  const data = [req.query.id];
  con.query(
    "select * from `comments` where ansID=?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in create group api");
      }
      res.send(result);
    }
  );
});

// update ans

// update ans
app.put("/update_answer", (req, res) => {
  const data = [req.body.ans, req.body.id];
  // console.log(data);
  con.query(
    "update `answers` set ans=? where id =?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in assign group leader api");
      }
      res.send(result);
    }
  );
});

app.get("/search", (req, res) => {
  const array = req.query.a;
  const num = array.toString();
  let data = num;
  // console.log(data);
  con.query(
    "select * from  `questions` where id NOT IN" + `(${data})`,
    data,
    (error, result, field) => {
      res.send(result);
    }
  );
});

app.get("/search_condition", (req, res) => {
  const data = [req.query.roll, req.query.question];
  con.query(
    "select * from `answers` where answer_by_roll=? and question=?",
    data,
    (error, result, field) => {
      if (error) {
        res.send("error in create group api");
      }
      res.send({ length: result.length });
    }
  );
});

// delete all table data
app.delete("/delete_all_data", (req, res) => {
  // console.log(data);
  con.query("DELETE FROM `answers`", (error, result, field) => {
    if (error) {
      res.send("error in create group api");
    }
    res.send(result);
  });
  con.query("DELETE FROM `comments`", (error, result, field) => {
    if (error) {
      res.send("error in create group api");
    }
    res.send(result);
  });
  con.query("DELETE FROM `group`", (error, result, field) => {
    if (error) {
      res.send("error in create group api");
    }
    res.send(result);
  });
  con.query("DELETE FROM `questions`", (error, result, field) => {
    if (error) {
      res.send("error in create group api");
    }
    res.send(result);
  });
  con.query("DELETE FROM `register`", (error, result, field) => {
    if (error) {
      res.send("error in create group api");
    }
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`api listening port is ${port}`);
});

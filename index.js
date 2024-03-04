const { faker } = require('@faker-js/faker');
const { query } = require('express');
const mysql = require("mysql2");
const express=require('express');
const app= express();
const methodOverride=require("method-override");
app.set("view-engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/views"));
const connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  database:'ldce',
  password:'Dbms#amazon122',
});
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
// const twilio=require('twilio');
//  function sendSMS(){
// const client=new twilio("AC6d4838bcaab09eecf057245e115d2a33","");
//   return client.messages
//   .create({body:"Respected Faculty this is your OTP", from:'+12055480343', to:'+917069312448'})
//   .then(message=> {console.log(message)})
//   .catch(err=>{console.log(err)});
// }
// sendSMS();
// app.patch("/user/:name",(req,res)=>{
//   let q=`select * from attene where name='dhruvi'`;
//   let {password:pass,name:newname}=req.body;
//   try{
//     connection.query(q,(error,result)=>{
//      if(error) throw error;
//     // console.log(result);
//     let ans = result[0].name;
//     if(pass!=result[0].password)
//     console.log(result[0].password, pass);
//     //res.send("wrong pass");
//     else{
//       let q2=`update attene set name='${newname}' where result[0].password='${pass}'`;
//       connection.query(q2,(err,result)=>{
//       if(err) {throw err;}
//       res.redirect("home.ejs");

//       });
//     }
       
//     });
//   }
//     catch(error){
//      console.log(error);
//     }
// });
// app.get("/user/:name/edit",(req,res)=>{
//   let {name}=req.params;
//   let q=`select * from attene where name='${name}'`;
//   try{
//     connection.query(q,(error,result)=>{
//      if(error) throw error;
//     // console.log(result);
//     let ans = result;
//     res.render("edit.ejs",{ans});

//     });
//     }
//     catch(error){
//      console.log(error);
//     }

// });
// app.get("/",(req,res)=>{
//   let q=`select * from attene`;
//   try{
//     connection.query(q,(error,result)=>{
//      if(error) throw error;
//     // console.log(result);
//     let ans = result;
//     res.render("home.ejs",{ans});

//     });
//     }
//     catch(error){
//      console.log(error);
//     }
// });
// app.get("/",(req,res)=>{
//   res.render("login.ejs");
// });
// const expressAsyncHandler = require("express-async-handler");
// //const dotenv = require("dotenv");
// const nodemailer = require("nodemailer");
// //dotenv.config();

// let transporter =  nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: 'dhruvishah116122@gmail.com', // generated ethereal user
//     pass: 'kgbx pjyt drup dzyg', // generated ethereal password
//   },
// });

// const sendEmail = expressAsyncHandler( async() => {
//   const email='patvaupasana@gmail.com';
// const message='3307 is your otp';
// const subject='hi';
//   console.log(email,subject, message);

//   var mailOptions = {
//     from: 'dhruvishah116122@gmail.com',
//     to: email,
//     subject: subject,
//     text: message,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent successfully!");
//     }
//   });
// });

// module.exports = { sendEmail };

const nodemailer = require("nodemailer");
// Import NodeMailer (after npm install)
const otp=Math.floor(1000 + Math.random() * 9000);
async function main() {
// Async function enables allows handling of promises with await

  // First, define send settings by creating a new transporter: 
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
    port: 465, // Port for SMTP (usually 465)
    secure: true, // Usually true if connecting to port 465
    auth: {
      user: "dhruvishah116122@gmail.com", // Your email address
      pass: "kgbx pjyt drup dzyg", // Password (for gmail, your app password)
      // ⚠ For better security, use environment variables set on the server for these values when deploying
    },
  });
  
  // Define and send message inside transporter.sendEmail() and await info about send from promise:

  let info = await transporter.sendMail({
    from: 'dhruvishah116122@gmail.com',
    to: "piyushpatwa1977@gmail.com",
    subject: "LDCE class attendance system",
    html: `
    <h1>Hello Respected Faculty, </h1>
    <p> your class Attendance otp is : ${otp}</p>
    `,
    

  });


  console.log(info.messageId); // Random ID generated after successful send (optional)
}
const q1 = 'INSERT INTO otp_table (email, otp, time_stamp) VALUES (?, ?, NOW())';
    connection.query(q1, ['patvaupasana@gmail.com', otp], (err, results) => {
        if (err) {
            console.error('Error inserting OTP into MySQL:', err);
           // return res.status(500).json({ error: 'Failed to generate OTP' });
        }
        console.log('OTP generated and stored:', otp);
       // return res.json({ otp: otp });
    });
    function cleanupExpiredOTP() {
      const oneMinuteAgo = new Date(Date.now() - 60000); // 1 minute ago
      const q = 'DELETE FROM otp_table WHERE time_stamp < ?';
      connection.query(q, [oneMinuteAgo], (err, results) => {
          if (err) {
              console.error('Error cleaning up expired OTPs:', err);
          ///    return;
          }
          console.log('Expired OTPs cleaned up');
      });
  }
  
  // Schedule cleanup of expired OTPs every minute
  setInterval(cleanupExpiredOTP, 60000);
main()
.catch(err => console.log(err));
app.listen('8080',()=>{
  console.log('hello');
  
});
// let getData=()=>{
//   return [
//     // faker.datatype.uuid(),
//     faker.internet.userName(),
//     faker.internet.password(),
//   ];
//   };

// let q = "insert into attene (name,password) values ?";
// // let user = [[123,"Krisha","128"],[143,"maahi","111"],];
// let data=[];
// for(let i=1;i<10;i++){
// data.push(getData());
// }
// try{
// connection.query(q,[data],(error,result)=>{
//  if(error) throw error;
// console.log(result);
// });
// }
// catch(error){
//  console.log(error);
// }
// connection.end();

  // console.log(createRandomUser()); 
   
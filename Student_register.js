const { query } = require('express');
const port=8080;
const nodemailer = require("nodemailer");
const notifier = require('node-notifier');
const bodyParser=require('body-parser');
const mysql = require("mysql2");
const express=require('express');
const app= express();
const alert =require('alert');
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
const methodOverride=require("method-override");
app.set("view-engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/views"));

const http = require('http');
const Nexmo = require('nexmo');

//Nexmo Config
const nexmo = new Nexmo({
    apiKey:'',
    apiSecret: ''
},{debug:true});

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'ldce',
    password:'Dbms#amazon122',
});
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));


app.post("/authenticate", (req, res) => {
    let enroll = req.body.Enrollment_no;
    let password = req.body.password;

    let q = `SELECT * FROM student_details WHERE Enrollment_no = ? AND pass = ?`; // Changes made here
    connection.query(q, [enroll, password], (error, result) => { // Changes made here
        if (error) {
            throw (error);
        }
        console.log(result);
        if (result.length == 0)
            res.redirect('/user');
        else {
            res.render('Student_option.ejs');
            // res.send("Successfully logged!!");
        }
    });
});


app.get("/user",(req,res)=>{
    res.render("Student_register.ejs");
});
app.get("/prof_user",(req,res)=>{
    res.render("professor_register.ejs");
});
app.get("/login",(req,res)=>{
    res.render('Student_login.ejs');
});
app.get("/professor_login",(req,res)=>{
    res.render('professor_login.ejs');
});
app.post("/register",(req,res)=>{
   
    
    let q= `insert into student_details(Full_Name,Enrollment_no, Email ,Phone_Number ,pass ,Semester ,Division) values (?, ?, ?, ?, ?, ?, ?)`;
    let{Full_Name,Enrollment_no, Email ,Phone_Number ,pass  ,Semester ,Division}=req.body;
    let sem=req.body.Semester;

    let student_details = [Full_Name, Enrollment_no, Email, Phone_Number, pass, Semester, Division];
    
    connection.query(q,student_details,(error,result)=>{
        if (error) {
            throw (error);
          
          } 
          if(sem=='4'){
           
            let q1 = `INSERT INTO sem_4 (Enrollment_no, \`3140702\`, \`3140705\`, \`3140707\`, \`3140708\`, \`3140709\`) VALUES (?, ?, ?, ?, ?, ?)`;
    
            let sem_4=[Enrollment_no,'0','0','0','0','0'];//'0','0','0','0','0'];
            connection.query(q1,sem_4,(err,res)=>{
                if (err) {
                    throw (err);
                  
                  } 
                  console.log("successfully entered data in subject table", res, req.body.Enrollment_no);
            });
          }
         else if(sem=='6'){
           
            let q1 = `INSERT INTO sem_6 (Enrollment_no, \`3160003\` ,\`3160704\` ,\`3160707\` ,\`3160712\`  ,\`3160713\`,\`3160714\`,\`3160715\`,\`3160716\` ,\`3160717\`) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?)`;
    
            let sem_6=[Enrollment_no,'0','0','0','0','0','0','0','0','0'];
          
            connection.query(q1,sem_6,(err,res)=>{
                if (err) {
                    throw (err);
                  
                  } 
                  console.log("successfully entered data in subject table", res, req.body.Enrollment_no);
            });
          }
         else if(sem=='1'){
           
            let q1 = `INSERT INTO year_1 (Enrollment_no,\`3110001\` ,\`3110002\` ,\`3110003\` ,\`3110004\` ,\`3110005\` ,\`3110006\`,\`3110007\`,\`3110013\` ,\`3110014\`,\`3110015\` ,\`3110016\` ,\`3110011\`,\`3110018\`) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)`;
    
            let year_1=[Enrollment_no,'0','0','0','0','0','0','0','0','0','0','0','0','0'];//'0','0','0','0','0'];
            connection.query(q1,year_1,(err,res)=>{
                if (err) {
                    throw (err);
                  
                  } 
                  console.log("successfully entered data in subject table", res, req.body.Enrollment_no);
            });
          }
       console.log("Successfully registered student!", result);

            res.send("Sucessfully registered!!", res.redirect("/login"));
          
        //  }
    });
});


// Endpoint to send OTP
app.post("/prof_register",(req,res)=>{
   
    
    let q= `insert into faculty(Full_name ,phone ,email,pass) values (?, ?, ?, ?)`;
    let{Full_name ,phone ,email,pass}=req.body;
    
    let faculty = [Full_name ,phone ,email,pass];
    
    connection.query(q,faculty,(error,result)=>{
        if (error) {
            throw (error);
         
          } 
         
       console.log("Successfully registered student!", result);

            res.send("Sucessfully registered!!", res.redirect("/professor_login"));
          
        //  }
    });
});
app.post("/prof_authenticate", (req, res) => {
    let phone = req.body.phone;
    let pass = req.body.pass;

    let q = `SELECT * FROM faculty WHERE phone = ? AND pass = ?`; // Changes made here
    connection.query(q, [phone, pass], (error, result) => { // Changes made here
        if (error) {
            throw (error);
        }
        console.log(result);
        if (result.length == 0)
            res.redirect('/prof_user');
        else {
            //res.render('Student_option.ejs');
            res.redirect('/opt');
        }
    });
});
app.get("/opt",(req,res)=>{
res.render("professor_option.ejs");
});
app.get("/mark_attendance",(req,res)=>{
    res.render("attendance_form.ejs");
});

app.post("/mark",(req,res)=>{
    let emai=req.body.email;
    let ot=req.body.otp;
    let sem=req.body.sem;
let q=`select * from otp_table where  otp=? and email=? `;
connection.query(q,[ot,emai],(err,result)=>{
if(err) throw err;
if(result.length==0)
res.send("Authentication failed or timeout");
else
{   console.log(result);
    let id=req.body.id;
    let enroll = req.body.enroll;
    if(sem=='4'){
    let q1=`update sem_4 set \`${id}\` = \`${id}\` + 1 where Enrollment_no=${req.body.enroll}`;
    connection.query(q1,(error,results)=>{
    if(error) throw error;//res.send("WRONG DETAILS");
    console.log(results);
    res.send("Attendance marked successfully");
    });
}
else if(sem=='1'){
    let q1=`update year_1 set \`${id}\` = \`${id}\` + 1 where Enrollment_no=${req.body.enroll}`;
    connection.query(q1,(error,results)=>{
    if(error) throw error;//res.send("WRONG DETAILS");
    console.log(results);
    res.send("Attendance marked successfully");
    });
}
else if(sem=='6'){
    let q1=`update sem_6 set \`${id}\` = \`${id}\` + 1 where Enrollment_no=${req.body.enroll}`;
    connection.query(q1,(error,results)=>{
    if(error) throw error;//res.send("WRONG DETAILS");
    console.log(results);
    res.send("Attendance marked successfully");
    });
}
}
});
//connection.end();
});
app.post("/take_attendance",(req,res)=>{
  //console.log(req.body.email);
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
    to: req.body.email,
    subject: "LDCE class attendance system",
    html: `
    <h1>Hello Respected Faculty, </h1>
    <p> your class Attendance otp is : ${otp}</p>
    `,
    

  });


  console.log(info.messageId);
 //alert("Email sent successfully!!");
  res.send("Email sent sucessfully"); // Random ID generated after successful send (optional)
}
const q1 = 'INSERT INTO otp_table (email, otp, time_stamp) VALUES (?, ?, NOW())';
    connection.query(q1, [req.body.email, otp], (err, results) => {
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
   
});
app.get("/take",(req,res)=>{
    res.render("generate_otp.ejs");
    });
app.get("/show_attendance",(req,res)=>{
   res.render("show.ejs");
});
    app.post("/show",(req,res)=>{
    let sem=req.body.sem;
    let enroll=req.body.enroll;
    if(sem==4){
        let q=`select * from sem_4 natural join student_details where  Enrollment_no=? and sem_4.Enrollment_no=student_details.Enrollment_no`;
        connection.query(q,[enroll],(err,result)=>{
        if(err) throw err;
        const columnNames = Object.keys(result[0]);
        res.render("view.ejs",{data:result,columns:columnNames});
        });
    }
    });

app.get("/faculty_access",(req,res)=>{
res.render("faculty_access.ejs");
});
app.post("/edit_attendance_access",(req,res)=>{
    let sem=req.body.sem;
  if(sem==4){
    let q=`select * from sem_4 inner join student_details on sem_4.Enrollment_no=student_details.Enrollment_no`;
    connection.query(q,(error,result)=>{
        if(error) throw error;
        const columnNames = Object.keys(result[0]);
        res.render("view.ejs",{data:result,columns:columnNames});
    });
  }
  if(sem==1){
    let q=`select * from year_1 inner join student_details on year_1.Enrollment_no=student_details.Enrollment_no`;
    connection.query(q,(error,result)=>{
        if(error) throw error;
        const columnNames = Object.keys(result[0]);
        res.render("view.ejs",{data:result,columns:columnNames});
    });
  }
  if(sem==6){
    let q=`select * from sem_6 inner join student_details on sem_6.Enrollment_no=student_details.Enrollment_no`;
    connection.query(q,(error,result)=>{
        if(error) throw error;
        const columnNames = Object.keys(result[0]);
        res.render("view.ejs",{data:result,columns:columnNames});
    });
  }
});


    // Assume you have your database query and result here

app.listen(port,()=>{
    console.log("app is listening");
});

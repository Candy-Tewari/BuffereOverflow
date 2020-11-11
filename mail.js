require('dotenv').config();
const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
});

var options = {
    from: "noreply@bufferoverflow.com",
    to: '',
    subject: "Testing purposes",
    text: "Testing purposes",
};

module.exports = {
    welome: (to) =>{
        options.to = to;
        options.subject = "Welcome to BufferOverflow!";
        options.text = "We are very happy to receive you. Let's see your passion of understanding insteading of knowing and learning.\n And again as always, thanks for taking this leap for your self improvement.";
        transport.sendMail(options, (err, info)=>{
            if(err) console.log("Cannot send welcome email. Error: "+err);
        });
    },
    forgotPassword: (to, link) =>{
        options.to = to;
        options.subject = "Password reset request."
        options.text = `This email is send to reset your password. If you have not requested this email, someone 
        is trying to hack into your account.\nThat's OK. They never can or can they? :)\nAnyway if you have requested the password-reset, 
        here is your password reset link:\n` + 'http://bufferoverflow.com/roasting/' + link;
        transport.sendMail(options, (err, info)=>{
            if(err) console.log("Error sending forgot-password email. Error: "+err);
            else console.log("Mail send successfully. Mail:\n"+info);
        });
    },
    resetPassword: (to) =>{
    },
    testMail: (to) =>{
        options.to = to;
        options.subject = "Welcome to BufferOverflow!";
        options.text = "This email for send to you for testing purposes and has no reflection of any changes."
        transport.sendMail(options, (err, info)=>{
            if(err) console.log("Error sending mail: "+err);
            else console.log("Mail send successfully. Mail:\n"+info); 
        });
    }
};
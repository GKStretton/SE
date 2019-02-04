const nodemailer = require('nodemailer');
const emailCredentials = require('./tokens/emailCredentials.json');
let mailOptions = {
    service : 'gmail',
    secure:true,
    auth:{
        user: emailCredentials.username,
        pass: emailCredentials.password
    }
}
let mailDefaults = {
    from: 'group6.se.durham@gmail.com'
}
let mailTransporter = nodemailer.createTransport(mailOptions, mailDefaults);

function repLineBreaks(text){
  return text.replace(/\r\n/g, '<br>')
}

function sendConfirmationMail(adminMail,userEmail,facility,name,date,time,info){
    let messageToAdmin = {
        to: adminMail,
        subject:'Booking Confirmation',
        html:'<p>Booking recieved: <br>'
        + 'Facility: ' + facility + '<br>'
        + 'Email: ' + userEmail + '<br>'
        + 'Name: ' + name + '<br>'
        + 'At '+ time +' on ' + date + '<br>'
        + 'Additional info: ' + repLineBreaks(info) + '<p>'
    }

    let messageToUser = {
        to: userEmail,
        subject: 'Booking Confirmation',
        html:'<p> Booking confirmation for your booking: <br>'
        + 'Facility: ' + facility + '<br>'
        + 'Email: ' + userEmail + '<br>'
        + 'Name: ' + name + '<br>'
        + 'At '+ time +' on ' + date + '</p>'
    }
    //in the below sendMail functions an option callback to catch errors could be added
    mailTransporter.sendMail(messageToAdmin);
    mailTransporter.sendMail(messageToUser);
}

function sendEnquiryMail(adminMail,facility,name,email,phone,message){
    let messageToAdmin = {
        to: adminMail,
        subject:'Booking Enquiry',
        html:'<p> Booking enquiry from ' + name + ': </br>'
        + 'Facility: ' + facility + '<br>'
        + 'Message: ' + repLineBreaks(message) + '<br>'
        + 'Email: ' + email + '<br>'
        + 'Phone: ' + phone + '<br> </p>'
    }
    mailTransporter.sendMail(messageToAdmin);
}

function sendContactMail(adminMail, name, email, phone, message) {
    let messageToAdmin = {
        to: adminMail,
        subject: 'General Enquiry',
        html: '<p> General enquiry from ' + name + ': <br />'
            + 'Message: ' + message + '<br />'
            + 'Email: ' + email + '<br />'
            + 'Phone: ' + phone + '<br /> </p>'
    }
    mailTransporter.sendMail(messageToAdmin);
}

module.exports.sendContactMail = sendContactMail;
module.exports.sendEnquiryMail = sendEnquiryMail;
module.exports.sendConfirmationMail = sendConfirmationMail;

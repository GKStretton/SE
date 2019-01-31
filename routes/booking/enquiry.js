mailer = require("../../mailer.js")
//manual booking enquiry
module.exports = (req, res) => {
    mailer.sendEnquiryMail('group6.se.durham@gmail.com',
        req.body.facility,
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.enquiry
    )
    res.sendStatus(200);
}

const User = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS
    }
});

exports.requestLinkPage = (req, res) => {
    res.render('request-reset-link');
}

// exports.linkMessagePage = (req, res) => {
//     res.render('link-message');
// }

exports.passwordResetPage = async (req, res) => {
    try {

        const decoded = jwt.verify(req.params.token, process.env.SESSION_SECRET);
        console.log(decoded);
        const foundUser = await User.findOne({ _id: decoded._id, resetPasswordToken: req.params.token})

        if(!foundUser || Date.now() > decoded.date){
            console.log(foundUser, Date.now() > decoded.date)
            return res.status(401).send({message: "Password token is invalid or expired!"});
        }

        // res.render('reset-password');
        res.status(200).send({message: 'Password reset token verified!'});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

// exports.passwordResetSuccessPage = (req, res) => {
//     res.render('reset-password-successful');
// }

exports.requestLink = async (req, res) => {
    try {
        const {email} = req.body;
        const foundUser = await User.findOne({email});

        const foundUserId = mongoose.Types.ObjectId(foundUser._id);

        if(!foundUser){
            return res.status(401).json({message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
        }

        foundUser.resetPasswordToken = jwt.sign({_id: foundUserId.toString(), date: Date.now() + 3600000}, process.env.SESSION_SECRET)
        foundUser.resetPasswordExpires = Date.now() + 3600000;

        await foundUser.save()

        let link = "http://" + req.headers.host + "/reset/" + foundUser.resetPasswordToken;

        const mailOptions = {
            to: foundUser.email,
            from: process.env.SENDER_EMAIL,
            subject: "Password change request on thepc login",
            text: `Hi ${foundUser.name} \n 
            Please click on the following link ${link} to reset your password. \n\n 
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        }

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                res.status(500).json({message: error});
            }else{
                console.log("Email sent: " + info.response);

                res.status(200).send({message: 'Password resetlink sent!'});
            }
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.resetPassword = async (req, res) => {
    // try {
        const decoded = jwt.verify(req.params.token, process.env.SESSION_SECRET);
        const foundUser = await User.findOne({ _id: decoded._id, resetPasswordToken: req.params.token})
        if(!foundUser){
            return res.status(401).send({message: "The password reset token has expired!"});
        }

        foundUser.password = req.body.password;
        foundUser.resetPasswordToken = null;
        foundUser.resetPasswordExpires = null;

        await foundUser.save();

        const mailOptions = {
            to: foundUser.email,
            from: process.env.FROM_EMAIL,
            subject: "Your password has been changed",
            text: `Hi ${foundUser.name} \n 
            This is a confirmation that the password for your account with email ${foundUser.email} has just been changed on ${req.headers.host}.\n`
        };

        transporter.sendMail(mailOptions, (error, result) => {
            
            res.status(200).send({message: 'Password reset successfully!'});
        });
    // } catch (error) {
    //     res.status(500).send({message: error.message});
    // }
}


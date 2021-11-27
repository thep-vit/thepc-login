const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async function(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, process.env.SESSION_SECRET)

        const foundUser = await User.findOne({_id: decoded._id});

        if(!foundUser){
            throw new Error();
        }else{
            req.token = token;
            req.user = foundUser;
            next();
        }
    } catch (error) {
        res.status(401).send("Please authenticate!");
    }
}

const adminAuth = async function(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, process.env.SESSION_SECRET)

        const foundUser = await User.findOne({_id: decoded._id});

        if(!foundUser || !foundUser.isAdmin){
            throw new Error();
        }else{
            req.token = token;
            req.user = foundUser;
            next();
        }
    } catch (error) {
        res.status(401).send("Please authenticate!");
    }
}

module.exports = {
    auth, adminAuth
}
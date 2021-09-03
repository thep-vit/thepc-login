const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.loginPage = (req, res) => {
    res.status(200).render('index.ejs');
}

exports.signUpPage = (req, res) => {
    res.status(200).render('signUp.ejs');
}

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({email});

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if(!isMatch){
            console.log(foundUser.password, password);
            let lp = await bcrypt.hash(password, 8);
            console.log(lp);
            res.status(500).send({"msg": "Unable to login!"});
        }else{
            const token = await jwt.sign({ _id:foundUser._id.toString(), isAdmin:foundUser.isAdmin.toString() }, process.env.SESSION_SECRET);

            res.status(200).send({ foundUser, token });        
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

exports.userSignUp = async (req, res) => {
    const { name, email, password, department } = req.body;
    const newUser = new User({
        name, email, password, department
    })

    try {
        await newUser.save();
        const token = await newUser.generateToken();
        
        res.status(200).send({ newUser, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}
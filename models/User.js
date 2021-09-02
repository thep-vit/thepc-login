const mongoose = require('mongoose');
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config();

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profile: {
        avatar: {
            type: String
        },
        bio: {
            type: String
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if (!validator.isEmail(value)){
            throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim:true,
        minlength: 7
    },

    department: {
        type: String,
        trim:true,
        lowercase:true
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    isAdmin:{
        type: Boolean,
        required:true,
        default: false
    },
    securityQuestion: {
        type: String
    },
    securityAnswer: {
        type: String
    }
},{
    timestamps: true
});

userSchema.statics.findByCredentials = async (email, password) => {
    const findUser = await User.findOne({ email })
    if(!findUser) {
        throw new Error ("Unable to Login!")
    }
    const isMatch = await bcrypt.compare(password, findUser.password)

    if(!isMatch) {
        throw new Error("Unable to Login!")
    }
    return findUser

}

//hash plain text password before save
userSchema.pre("save", async function(next) {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()

})

// return public profile whenever user info is returned ( hide password and token history)

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//Token generation and appending in model
userSchema.methods.generateToken = async function () {
    const findUser = this
    const token = jwt.sign({ _id:findUser._id.toString(), isAdmin:findUser.isAdmin.toString() }, process.env.JWT_SECRET)
    
    findUser.tokens = findUser.tokens.concat({ token })
    // console.log("TOKEN ADDED:",findUser)
    await findUser.save()
    return token

}

//Password reset token generation
userSchema.methods.generatePasswordReset =  function(){
    this.resetPasswordToken = jwt.sign({ _id:this._id.toString() }, process.env.JWT_SECRET)
    this.resetPasswordExpires = Date.now() + 3600000;
  };



const User = mongoose.model('User', userSchema);

module.exports = User;
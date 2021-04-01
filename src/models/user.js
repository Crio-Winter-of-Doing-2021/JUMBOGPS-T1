const environmentPath = require('path').join(__dirname+'/config/dev.env')
require('dotenv').config({ path: environmentPath })

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        validate(email){
            if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))){
                throw new Error('Invalid Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(password){
            if(password.length < 5){
                throw new Error('Password length too small')
            }
        }
    },
    tokens: [{
        token: {
            type : String,
            required : true
        }
    }]
})

userSchema.methods.generateAuthToken = async function() {

    const user = this 

    const token = jwt.sign({ _id : user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token

}

// determine what user properties need to be sent
userSchema.methods.toJSON = function() {

    const user = this 
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject

}

// setting a user defined function on the schema to be accessed as a native fn. like
userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })

    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user

}

// encrypt password before saving
userSchema.pre('save', async function(next) {
    const user = this 

    // if a patch api is there it makes sure that password is not rehashed
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    // necessary next call
    next()
})



// this line initialises the Model for the given Schema 
const User = mongoose.model('User', userSchema)

module.exports = User
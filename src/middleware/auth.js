const environmentPath = require('path').join(__dirname+'/config/dev.env')
require('dotenv').config({ path: environmentPath })

const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    
    try{
        
        const token = req.cookies['jumboGPSToken']

        if(!token || token.length === 0){
            return res.redirect('/login')
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            return res.redirect('/login')
        }

        req.token = token
        req.user = user
        next()

    }catch (e){
        console.log(e)
        return res.redirect('/login')
    }

}

module.exports = auth
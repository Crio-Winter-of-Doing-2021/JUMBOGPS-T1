const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/users/login', async (req, res) => {

    const {email, password} = req.body

    try{

    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()

    res.cookie('jumboGPSToken', token, {maxAge:  7 * 24 * 60 * 60 * 1000, httpOnly: true}) // 7 day cookie 

    res.send({ user , token })

    }catch (e){

        res.status(400).send({ message: 'Bad Credentials'})

    }
    

})

router.post('/users/signup', async (req, res) => {

    const user = new User(req.body)

    try{

        await user.save()
        const token = await user.generateAuthToken()

        res.cookie('jumboGPSToken', token, {maxAge:  7 * 24 * 60 * 60 * 1000, httpOnly: true})

        res.status(201).send({ user, token})

    }catch (e){

        res.status(400).send(e)

    }


})

router.post('/users/logout', auth, async (req, res) => {

    try{

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
    
        await req.user.save()
    
        res.clearCookie('jumboGPSToken')

        res.send()
    
        } catch (e){
    
            res.status(500).send()
    
        }
    

})

module.exports = router
const express = require('express')
const router = express.Router()
const path = require("path")
const auth = require('../middleware/auth')

router.get('/', auth, (req, res) => {
    
    res.render('home');

})

router.get('/geofence', auth, (req, res) => {

    res.render('geofence');

})

router.get('/georoute', auth, (req, res) => {

    res.render('georoute')

})

router.get('/login', (req, res) => {

    res.render('login')

})

module.exports = router
const express = require('express')
const router = express.Router()

const path = require("path")

const publicDirPath = path.join(__dirname, '../../public/')

const auth = require('../middleware/auth')

router.get('/', auth, (req, res) => {
    
    res.sendFile(publicDirPath+'/home.html');

})

router.get('/geofence', auth, (req, res) => {

    res.sendFile(publicDirPath+'/geofence.html');

})

router.get('/georoute', auth, (req, res) => {

    res.sendFile(publicDirPath+'/georoute.html');

})

router.get('/login', (req, res) => {

    res.sendFile(publicDirPath+'/login.html');

})

module.exports = router
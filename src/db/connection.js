const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/JUMBOGPS-api', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})
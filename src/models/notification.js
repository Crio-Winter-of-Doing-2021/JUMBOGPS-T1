const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true,
        validate(latitude){
            if(!(isFinite(latitude) && Math.abs(latitude) <= 90)){
                throw new Error('Latitude should be a number between -90 and 90')
            }
        }
    },
    longitude: {
        type: Number,
        required: true,
        validate(longitude){
            if(!(isFinite(longitude) && Math.abs(longitude) <= 180)){
                throw new Error('Longitude should be a number between -180 and 180')
            }
        }
    },
    timestamp: {
        type: Number,
        required: true
    }
})

// setting up the collection schema (equivalent to SQL DB Schema)
const notificationSchema = new mongoose.Schema({
    // 0 -> geofence deviation , 1 -> georoute deviation
    type : {
        type: Number,
        required: true
    },
    asset_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    last_location : {
        type: locationSchema,
        required: true
    }
},
{
    timestamps: true
})

// this line initialises the Model for the given Schema 
const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification
const mongoose = require('mongoose')
// time based filter
const {justGreaterEqual, justLesserEqual} = require('../utils/utils')

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

const LatLongSchema = new mongoose.Schema({
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
    }
})

// setting up the collection schema (equivalent to SQL DB Schema)
const assetSchema = new mongoose.Schema({
    location:[locationSchema],
    geofence:[LatLongSchema],
    presetroute:[LatLongSchema],
    assetType: {
        type: String
    }
})


assetSchema.methods.getBetween = function(startTime, endTime) {

    const locations = this.location

    if(startTime && !endTime){

        const low = justGreaterEqual(locations, startTime);

        if(low<0){
            return []
        }

        return locations.slice(low, locations.length)

    }else if(endTime && !startTime){

        const high = justLesserEqual(locations, endTime);

        if(high < 0){
            return []
        }

        return locations.slice(0,high+1)

    }else if(startTime && endTime){

        if(endTime<startTime){
            throw new Error("Invalid Time Range")
        }

        const low = justGreaterEqual(locations, startTime);
        const high = justLesserEqual(locations, endTime);

        if(low>high || low<0 || high < 0){
            return []
        }

        return locations.slice(low, high+1)

    }

    return []

}

// this line initialises the Model for the given Schema 
const Asset = mongoose.model('Asset', assetSchema)

module.exports = Asset
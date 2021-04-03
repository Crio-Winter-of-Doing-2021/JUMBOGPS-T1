const express = require('express')
const router = express.Router()
const Asset = require('../models/asset')
const Notification = require('../models/notification')
const geolib = require('geolib')
const mongoose = require('mongoose')
const apiAuth = require('../middleware/apiAuth')

// google map's algorithm based anomaly detection 
const {isLocationOnPath} = require('../utils/routeTracking')

// location data comes here
router.post('/assets/:id/location',  apiAuth, async (req, res) => {

try{
    const locationData = req.body.data

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send({
            message: "Invalid Asset ID"
        })
    }
 
    const asset = await Asset.findById(req.params.id);

    if(!asset){
        return res.status(404).send({
            message: "Asset with given ID not found"
        })
    }

    locationData.sort((o1, o2) => o1.timestamp - o2.timestamp);

    if(asset.geofence.length !== 0){
        // if a geofence is there 
        const lastLocation = locationData[locationData.length - 1]
        const lastLatitude = lastLocation.latitude
        const lastLongitude = lastLocation.longitude
        const lastLocationTimeStamp = lastLocation.timestamp
        
        const formattedGeoFence = [] 
        asset.geofence.forEach(coordinate => formattedGeoFence.push({latitude: coordinate.latitude,
        longitude: coordinate.longitude}))

        // check if given location inside geofence or not 
        const isInsideFence = geolib.isPointInPolygon(
            {latitude: lastLatitude, 
            longitude: lastLongitude},
            formattedGeoFence)

            if(!isInsideFence){

                // trigger Notification 
                const notification = new Notification()

                notification.type = 0
                notification.asset_id = asset._id
                notification.last_location = { 
                    latitude: lastLatitude,
                    longitude: lastLongitude,
                    timestamp: lastLocationTimeStamp
                }

                await notification.save()

            }

    }

    if(asset.presetroute.length !== 0){
        // presetroute is defined
        locationData.every(async (location) => {
            const point = {latitude: location.latitude, longitude: location.longitude}
            const isOnPresetRoute = isLocationOnPath(point, asset.presetroute, geodesic=false, tolerance=30)
            if(!isOnPresetRoute){
                // trigger notification , 
                
                const notification = new Notification()

                notification.type = 1
                notification.asset_id = asset._id
                notification.last_location = { 
                    latitude: location.latitude,
                    longitude: location.longitude,
                    timestamp: location.timestamp
                }

                await notification.save()

                // notify only on first deviation for a given batch of coordinates
                return false
            }

            return true
        })

    }
 
    locationData.forEach(location => {
     
         asset.location.push({
             latitude: location.latitude,
             longitude: location.longitude,
             timestamp: location.timestamp
         })
 
    });
 
    await asset.save()
    res.send()
 
    }catch (e){
        res.status(500).send(e)
    }
 
 })
 
 // filter: startTime and endTime
 router.get('/assets/:id/timeline', apiAuth, async (req, res) => {
  
     try{

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).send({
                message: "Invalid Asset ID"
            })
        }
 
         const asset = await Asset.findById(req.params.id)

         if(!asset){
            return res.status(404).send({
                message: "Asset with given ID not found"
            })
        }

         const {startTime,endTime} = req.query

         let locations ;
         if(startTime || endTime){

             
             if(startTime && endTime){
                locations = asset.getBetween(parseInt(startTime), parseInt(endTime)) 
             }else if(startTime){
                locations = asset.getBetween(parseInt(startTime), undefined) 
             }else{
                locations = asset.getBetween(undefined, parseInt(endTime)) 
             }

             if(locations.length == 0){
                return res.status(400).send({
                    message: "No asset movement between given time range"
                })
            }

         }else{
             // default 
            
            const lastLocationTimeStamp = asset.location[asset.location.length - 1].timestamp

            // location of last 24 hrs. from last location
            locations = asset.getBetween(lastLocationTimeStamp-86400,lastLocationTimeStamp)

         }
 
         const coords = [] 
         locations.forEach(location => {
             coords.push({
                 latitude: location.latitude,
                 longitude: location.longitude
             })
         })

         asset.location = locations
 
         const center = geolib.getCenter(coords)
 
         res.status(200).send({ data: asset, center})
 
     }catch (e){
 
         res.send(e)
 
     }
  
  })
 
 
  // gets last location
  router.get('/assets/:id/last-location', apiAuth, async (req, res) => {
  
     try{
 
         const asset = await Asset.findById(req.params.id)
 
         const {latitude, longitude, timestamp} = asset.location[asset.location.length - 1]
 
         res.send({
             latitude,
             longitude,
             timestamp
         })
 
     }catch (e){
 
         res.send(e)
 
     }
  
  })
 
 
  // filter: assetType , limit: default=100 
  // /locations

  router.get('/assets/list/location', apiAuth, async (req, res) => {
 
     const numMarkers = req.query.markers ? parseInt(req.query.markers) : 100 ;
 
     try{

        const queryString = {}

        if(req.query.id){
            queryString._id = req.query.id

            if(!mongoose.Types.ObjectId.isValid(req.query.id)){
                return res.status(400).send({
                    message: "Invalid Asset ID"
                })
            }

        }

        if(req.query.type){
            queryString.assetType = req.query.type
        }
     
       const assets = await Asset.find(queryString).limit(numMarkers)
     
       let response = []
       const coords = []
 
       assets.forEach(asset => {
        
        if(asset.location.length !== 0){
            
         const lastLocation = asset.location[asset.location.length - 1]
         coords.push({
             latitude: lastLocation.latitude,
             longitude: lastLocation.longitude
         })
 
             response.push({
                 _id : asset._id,
                 type: asset.assetType,
                 latitude: lastLocation.latitude,
                 longitude: lastLocation.longitude,
                 time: lastLocation.timestamp
             })
            
            }
 
       })
 
       const center = geolib.getCenter(coords)
 
       res.status(200).send({data: response, center})
 
     }catch (e){
 
         res.send(e)
 
     }
 
  })

  router.post('/assets/:id/geofence', apiAuth, async (req, res) => {

        try{

            if(!mongoose.Types.ObjectId.isValid(req.params.id)){
                return res.status(400).send({
                    message: "Invalid Asset ID"
                })
            }

            const asset = await Asset.findById(req.params.id)

            if(!asset){
                return res.status(404).send({
                    message: "Asset with given ID not found"
                })
            }

            const geoFence = req.body.data

            // remove any previous geofence
            let message = ''

            if(asset.geofence.length === 0){
                message = 'Geofence Added Successfully'
            }else{
                message = 'Geofence Updated Successfully'
            }

            if(!Array.isArray(geoFence) || geoFence.length === 0){
                return res.status(400).send({
                    message: "Geofence was empty or of invalid format"
                })
            }
            
            asset.geofence = geoFence

            await asset.save()

            res.send({ message })


        }catch (e){
            res.send(e)
        }

  })

  router.post('/assets/:id/georoute', apiAuth,async (req, res) => {

    try{

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).send({
                message: "Invalid Asset ID"
            })
        }

        const asset = await Asset.findById(req.params.id)

        if(!asset){
            return res.status(404).send({
                message: "Asset with given ID not found"
            })
        }

        const geoRoute = req.body.data

        // remove any previous geofence
        let message = ''

        if(asset.presetroute.length === 0){
            message = 'GeoRoute Added Successfully'
        }else{
            message = 'GeoRoute Updated Successfully'
        }

        if(!Array.isArray(geoRoute) || geoRoute.length === 0){
            return res.status(400).send({
                message: "GeoRoute was empty or of invalid format"
            })
        }
        
        asset.presetroute = geoRoute

        await asset.save()

        res.send({ message })


    }catch (e){
        res.send(e)
    }

})

module.exports = router
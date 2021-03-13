const express = require('express')
const router = express.Router()
const Asset = require('../models/asset')
const geolib = require('geolib')
const mongoose = require('mongoose')

router.post('/assets/:id/location',  async (req, res) => {

    const locationData = req.body.data
 
    const asset = new Asset();
 
    locationData.sort((o1, o2) => o1.timestamp - o2.timestamp);
 
    locationData.forEach(location => {
     
         asset.location.push({
             latitude: location.latitude,
             longitude: location.longitude,
             timestamp: location.timestamp
         })
 
    });
 
    try{
 
    await asset.save()
    res.send()
 
    }catch (e){
        res.status(500).send(e)
    }
 
 })
 
 // filter: startTime and endTime
 router.get('/assets/:id/timeline', async (req, res) => {
  
     try{

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).send({
                message: "Invalid Asset ID"
            })
        }
 
         const asset = await Asset.findById(req.params.id)
         const {startTime,endTime} = req.query

         if(startTime || endTime){

             let locations ;
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

            asset.location = locations

         }
 
         const coords = [] 
         asset.location.forEach(location => {
             coords.push({
                 latitude: location.latitude,
                 longitude: location.longitude
             })
         })
 
         const center = geolib.getCenter(coords)
 
         res.status(200).send({ data: asset, center})
 
     }catch (e){
 
         res.send(e)
 
     }
  
  })
 
 
  // gets last location
  router.get('/assets/:id/last-location', async (req, res) => {
  
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

  router.get('/assets/list/location', async (req, res) => {
 
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
 
       })
 
       const center = geolib.getCenter(coords)
 
       res.status(200).send({data: response, center})
 
     }catch (e){
 
         res.send(e)
 
     }
 
  })

  module.exports = router


const environmentPath = require('path').join(__dirname+'/config/dev.env')
require('dotenv').config({ path: environmentPath })

const express = require('express')
const hbs = require('hbs')
const http = require('http')
const socketio = require('socket.io')
const cookieParser = require('cookie-parser')
const path = require("path")
const publicDirPath = path.join(__dirname, '../public/')
const viewsPath = path.join(__dirname, '../public/templates/views')
const partialsPath = path.join(__dirname, '../public/templates/partials')
const assetRouter = require('./routers/assets')
const userRouter = require('./routers/users')
const uiRouter = require('./routers/ui')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on("connection", (socket) => {

    console.log("socket.io: User connected: ", socket.id);
  
    socket.on("disconnect", () => {
      console.log("socket.io: User disconnected: ", socket.id);
    });

  });

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirPath))
app.use(express.json())

app.use(cookieParser())

app.use(uiRouter)
app.use(userRouter)
app.use(assetRouter)

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Started Server on port ${port}`)
})

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})

const connection = mongoose.connection

connection.once('open', () => {

    console.log('Connected to MongoDB.. setting up change stream')

    const notificationStream = connection.collection('notifications').watch()

    const locationStream = connection.collection('assets').watch()

    notificationStream.on('change', change => {
        if(change.operationType === 'insert'){
            const notification = change.fullDocument
            if(notification.type === 0){
                // fenceDeviation
                io.sockets.emit("geoFenceBreach", notification);
            }else if(notification.type === 1){
                // routeDeviation
                io.sockets.emit("geoRouteBreach", notification);
            }
            
        }
    })

    locationStream.on('change', change => {

        if(change.operationType === 'update'){

            const keys = Object.keys(change.updateDescription.updatedFields)
            
            /* mongo db oplog has some inconsistency while returning updatedFields
               so a direct pipeline can not be defined hence taking this approach 
            */ 
            
            for(key in keys){

                const rawUpdatedField = keys[key].split('.')
                const updatedField = rawUpdatedField[0]

                if(updatedField === 'location'){
                    const updatedAssetID = change.documentKey._id
                    io.sockets.emit('assetMovement', updatedAssetID)
                    console.log('Location Update Message Sent')
                    break;
                }

         }

            

        }

    })

})



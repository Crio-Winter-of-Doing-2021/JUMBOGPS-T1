const environmentPath = require('path').join(__dirname+'/config/dev.env')
require('dotenv').config({ path: environmentPath })

const express = require('express')

const http = require('http')
const socketio = require('socket.io')
const cookieParser = require('cookie-parser')
const path = require("path")
const publicDirPath = path.join(__dirname, '../public/')
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

app.use(express.static(publicDirPath))
app.use(express.json())

app.use(cookieParser())

app.use(uiRouter)
app.use(userRouter)
app.use(assetRouter)

const port = process.env.port || 3000

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

})



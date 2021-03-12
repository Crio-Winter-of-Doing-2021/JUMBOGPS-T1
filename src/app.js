require('./db/connection')
const express = require('express')

const path = require("path")
const publicDirPath = path.join(__dirname, '../public/')

const assetRouter = require('./routers/assets')
const app = express()


app.use(express.static(publicDirPath))
app.use(express.json())

const port = process.env.port || 3000

app.listen(port, () => {
    console.log(`Started Server on port ${port}`)
})

app.use(assetRouter)
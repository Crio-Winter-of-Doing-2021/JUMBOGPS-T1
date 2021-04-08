# Realtime GPS based Asset Tracking Application 

This project focuses on realtime asset tracking based on live stream GPS data being sent to the API servers by assets. An asset can be typically be a vehicle, salesperson etc.

Some of the application features include the following,

 - Asset View to have a glance of assets last location
 
 
 ![Asset_View_Readme](https://user-images.githubusercontent.com/38208071/114018904-64908100-988b-11eb-932a-0b64d1fa3b0c.png)
 
 
 - Timeline View to track asset's location in the last 24 hrs.


 ![Timeline_View_Readme](https://user-images.githubusercontent.com/38208071/114019175-b507de80-988b-11eb-832d-694f06711204.png)
 
 
 - Time, type, id etc. based filters across views


 ![View_Filters_Readme](https://user-images.githubusercontent.com/38208071/114018111-850c0b80-988a-11eb-86b8-510e893db059.png)
 
 
 - Geofence an asset


 ![Geofence_View_Readme](https://user-images.githubusercontent.com/38208071/114018255-a8cf5180-988a-11eb-9d30-e2809cd092f5.png)
 
 
 - Define a preset route for an asset


![Georoute_View_Readme](https://user-images.githubusercontent.com/38208071/114018261-aa991500-988a-11eb-95a4-6309cb0d9702.png)


 - Realtime notifications on geofence and preset route violations


![Realtime_Notification_Readme](https://user-images.githubusercontent.com/38208071/114019742-660e7900-988c-11eb-876f-cad29fb55a46.png)


 - State of the art Anomaly Detection Algorithm. See [here]


 - Realtime view to track live changes


 ![Realtime_View_Readme](https://user-images.githubusercontent.com/38208071/114025047-542fd480-9892-11eb-8e11-aab57592ab51.gif)
 
 
 - Responsiveness across various viewports

<p align="center">
  <img src="https://user-images.githubusercontent.com/38208071/114028767-775c8300-9896-11eb-823e-f8e02118db36.jpg">
</p>

 - API to collect and analyse GPS Data from Assets

 # Tech

 Application was made with ❤️ using the following technologies:

 * [Bootstrap 5] - A lightweight mobile first front-end open source toolkit
 * [Handlebars] - An awesome templating engine
 * [Node.js] - Evented I/O for backend
 * [Express] - Fast Node.js network app framework
 * [Socket IO] - JavaScript library for realtime web applications
 * [MongoDB] - General purpose, document based NoSQL Database

 # Tools and Libraries
 * [Mapbox] - Vector Tiles based Map rendering service 
 * [geolib] - Library for geospatial operations
 * [MongoDB Atlas] - MongoDB Cluster deployment in cloud
 * [Postman] - Industry standard for everything to do with APIs
 * [Robo 3T] - GUI to connect to MongoDB database, formerly Robomongo

# Running the app as a Docker 🐳  Container

- You can simply spin up the application using Docker locally by issuing this command from root of repo, 

```sh
$ docker-compose up 
```
**Note:** Set the environment variable in docker-compose.yml file so that
the app does not crash.

**Note:** Please make sure you have docker and docker-compose installed on your system.

- New to Docker? See [Docker_Install](https://k21academy.com/docker-kubernetes/docker-installation-overview/),  [Docker_Compose_Install](https://docs.docker.com/compose/install/), 
[Docker_Compose](https://docs.docker.com/compose/gettingstarted/)

 
 [Bootstrap 5]: <https://getbootstrap.com/>
 [handlebars]: <https://www.npmjs.com/package/hbs>
 [Node.js]: <https://nodejs.org/en/>
 [Express]: <https://expressjs.com/>
 [Socket IO]: <https://socket.io/>
 [MongoDB]: <https://www.mongodb.com/>
 [MongoDB Atlas]: <https://www.mongodb.com/cloud/atlas>
 [Mapbox]: <https://www.mapbox.com/>
 [geolib]: <https://www.npmjs.com/package/geolib>
 [Postman]: <https://www.postman.com/>
 [Robo 3T]: <https://robomongo.org/>
 [here]: <https://github.com/Crio-Winter-of-Doing-2021/JUMBOGPS-T1/blob/main/src/utils/routeTracking.js>

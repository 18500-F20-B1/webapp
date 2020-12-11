// borrowed from https://github.com/lenmorld/devto_posts/tree/master/quick_node_express_mongodb
// https://dev.to/lennythedev/rest-api-with-mongodb-atlas-cloud-node-and-express-in-10-minutes-2ii1

const express = require("express");
const server = express();

var cors = require('cors');
server.use(cors());

const path = require("path");
// Serve static files
server.use(express.static(path.join(__dirname, "../frontend/build")));

var router = express.Router();
server.use('/api', router);

const body_parser = require("body-parser");
server.use(body_parser.json()); // parse JSON (application/json content-type)

const port = 4000;

// << db setup >>
const db = require("./db");
const dbName = "capstone";
const ringtoneCollectionName = "ringtones";
const alarmCollectionName = "alarms";

const { scheduleAlarms, cancelAlarm } = require("./schedule-alarms");

db.initialize(dbName, ringtoneCollectionName, alarmCollectionName, function (ringtoneCollection, alarmCollection) { // successCallback

  router.post("/ringtones/create", (request, response) => {
    console.log("POST /ringtones/create");
    let item = request.body;
    ringtoneCollection.insertOne(item, (error, result) => { // callback of insertOne
      if (error) throw error;
      else response.send(result);
    });
  });

  router.post("/alarms/create", (request, response) => {
    console.log("POST /alarms/create");
    let items = request.body;
    alarmCollection.insertMany(items, (error, result) => { // callback of insertOne
      if (error) throw error;
      else {
        scheduleAlarms(items);
        response.send(result);
      }
    });
  });

  router.get("/alarms", (request, response) => {
    let user = request.query.user;
    if (user) {
      console.log(`GET /alarms?user=${user}`);
      alarmCollection.find({ user : user }).toArray((error, result) => {
        if (error) throw error;
        response.json(result);
      });
    }
  });

  router.get("/ringtones", (request, response) => {
    let user = request.query.user;
    if (user) {
      console.log(`GET /ringtones?user=${user}`);
      ringtoneCollection.find({ user : user }).toArray((error, result) => {
        if (error) throw error;
        response.json(result);
      });
    } else {
      console.log("GET /ringtones");
      ringtoneCollection.find({ user : null }).toArray((error, result) => {
        if (error) throw error;
        response.json(result);
      });
    }
  });

  router.delete("/alarms", (request, response) => {
    const alarm = request.body;
    console.log("DELETE /alarms");
    alarmCollection.deleteOne({ 
        user : alarm.user,
        time : alarm.time,
        day : alarm.day
      }, function (error, result) {
       if (error) throw error;
       // send back entire updated list after successful request
       cancelAlarm(alarm);
       response.json(null);
    });
 });

  router.delete("/ringtones/:name", (request, response) => {
    const name = request.params.name;
    console.log(`DELETE /ringtones/:${name}`);
    ringtoneCollection.deleteOne({ name }, function (error, result) {
      if (error) throw error;
      // send back entire updated list after successful request
      response.json(null);
    });
 });

}, function (err) { // failureCallback
  throw (err);
});

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
// borrowed from https://github.com/lenmorld/devto_posts/tree/master/quick_node_express_mongodb
// https://dev.to/lennythedev/rest-api-with-mongodb-atlas-cloud-node-and-express-in-10-minutes-2ii1

const express = require("express");
const server = express();

const path = require("path");
// Serve static files
server.use(express.static(path.join(__dirname, "../frontend/build")));

const cors = require("cors");
server.use(cors());

const body_parser = require("body-parser");
server.use(body_parser.json()); // parse JSON (application/json content-type)

const port = 4000;

// << db setup >>
const db = require("./db");
const dbName = "capstone";
const ringtoneCollectionName = "ringtones";
const alarmCollectionName = "alarms";

const { scheduleAlarms } = require("./schedule-alarms");

db.initialize(dbName, ringtoneCollectionName, alarmCollectionName, function (ringtoneCollection, alarmCollection) { // successCallback
  //  // get all items (use for debugging)
  //   ringtoneCollection.find().toArray(function (err, result) {
  //     if (err) throw err;
  //     console.log(result);

  //     // << return response to client >>
  //   });

   // << db CRUD routes >>
  server.post("/ringtones/create", (request, response) => {
    console.log("POST /ringtones/create");
    let item = request.body;
    ringtoneCollection.insertOne(item, (error, result) => { // callback of insertOne
      if (error) throw error;
      else response.send(result);
    });
  });

  server.post("/alarms/create", (request, response) => {
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

  server.get("/alarms", (request, response) => {
    let user = request.query.user;
    if (user) {
      console.log(`GET /alarms?user=${user}`);
      alarmCollection.find({ user : user }).toArray((error, result) => {
        if (error) throw error;
        response.json(result);
      });
    }
  });

  server.get("/ringtones", (request, response) => {
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

  server.delete("/ringtones/:name", (request, response) => {
    const name = request.params.name;
    console.log(`DELETE /ringtones/:${name}`);

    ringtoneCollection.deleteOne({ name }, function (error, result) {
       if (error) throw error;
       // send back entire updated list after successful request
       ringtoneCollection.find().toArray(function (_error, _result) {
          if (_error) throw _error;
          response.json(_result);
       });
    });
 });

  //  server.get("/items/:id", (request, response) => {
  //     const itemId = request.params.id;

  //     ringtoneCollection.findOne({ id: itemId }, (error, result) => {
  //        if (error) throw error;
  //        // return item
  //        response.json(result);
  //     });
  //  });

  //  server.put("/items/:id", (request, response) => {
  //     const itemId = request.params.id;
  //     const item = request.body;
  //     console.log("Editing item: ", itemId, " to be ", item);

  //     ringtoneCollection.updateOne({ id: itemId }, { $set: item }, (error, result) => {
  //        if (error) throw error;
  //        // send back entire updated list, to make sure frontend data is up-to-date
  //        ringtoneCollection.find().toArray(function (_error, _result) {
  //           if (_error) throw _error;
  //           response.json(_result);
  //        });
  //     });
  //  });

}, function (err) { // failureCallback
  throw (err);
});

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
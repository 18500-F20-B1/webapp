// import and use mongodb.MongoClient
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const user = "18500b1";
const password = "18500b1";
const dbConnectionUrl = `mongodb+srv://${user}:${password}@cluster0.qiv5v.mongodb.net/cluster0?retryWrites=true&w=majority`;

function initialize(dbName, ringtoneCollectionName, alarmCollectionName, successCallback, failureCallback) {
	MongoClient.connect(dbConnectionUrl, function (err, dbInstance) {
		if (err) {
			console.log(`[MongoDB connection] ERROR: ${err}`);
			failureCallback(err); // this should be "caught" by the calling function
		} else {
			const dbObject = dbInstance.db(dbName);
			const ringtoneCollection = dbObject.collection(ringtoneCollectionName);
			const alarmCollection = dbObject.collection(alarmCollectionName);

			console.log("[MongoDB connection] SUCCESS");
			successCallback(ringtoneCollection, alarmCollection);
		}
	});
}

module.exports = { initialize };
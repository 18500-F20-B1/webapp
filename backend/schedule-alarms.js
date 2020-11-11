const cron = require("node-cron"); 
const moment = require("moment");

const aws = require('aws-sdk');
const queueUrl = "https://sqs.us-east-2.amazonaws.com/248059054815/MyFirstQueue";
aws.config.loadFromPath(__dirname + '/config.json');
const sqs = new aws.SQS();

const scheduleAlarms = (alarms) => {
  alarms.forEach((alarm) => {
    let minHr = moment(alarm.time).format("mm HH");
    let day = getDay(alarm.day.toLowerCase());
    let schedule = `${minHr} * * ${day}`;

    console.log(`Message scheduled to send at ${alarm.day} ${moment(alarm.time).format("HH mm")}`)

    cron.schedule(schedule, () => {
      send(alarm);
    }, {
      timezone: "America/Los_Angeles"
    }
    );
  })
}

const send = (alarm) => {
  var params = {
    MessageBody: JSON.stringify(alarm),
    QueueUrl: queueUrl,
    DelaySeconds: 0
  };

  console.log("Message sent to SQS");

  sqs.sendMessage(params, function(err, data) {
    if(err) console.log(err);
    else console.log(data);
  });
}

const getDay = (str) => {
  if (str.startsWith("mon")) return 1
  else if (str.startsWith("tue")) return 2
  else if (str.startsWith("wed")) return 3
  else if (str.startsWith("thu")) return 4
  else if (str.startsWith("fri")) return 5
  else if (str.startsWith("sat")) return 6
  else return 0
}

module.exports = { scheduleAlarms }
var CronJob = require('cron').CronJob;
const moment = require('moment-timezone');
const fs = require('fs');

const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/config.json');

const queueUrl = "https://sqs.us-east-2.amazonaws.com/248059054815/MyFirstQueue";
const sqs = new aws.SQS();

const jobMap = {};

const scheduleAlarms = (alarms) => {
  alarms.forEach((alarm) => {
    let minHr = moment(alarm.time).format("mm HH");
    let day = getDay(alarm.day.toLowerCase());
    let schedule = `${minHr} * * ${day}`;
    
    var job = new CronJob(
      schedule,
      () => { send(alarm); },
      null,
      true,
      moment.tz.guess() // schedule jobs on server in whatever timezone server is in
    );
    let jobId = getJobId(alarm);
    jobMap[jobId] = job;

    let utcTime = moment(alarm.time).utc().format('HH:mm');
    let pdtTime = moment(alarm.time).tz('America/Los_Angeles').format('HH:mm');
    writeToLog(`Message scheduled to send at ${alarm.day}, UTC time ${utcTime} or PDT time ${pdtTime} by uid ${alarm.user}`);
    writeToLog(`Total number of current jobs: ${Object.keys(jobMap).length}`);
    writeToLog(`${JSON.stringify(alarm)}`);
  })
}

const cancelAlarm = (alarm) => {
  let jobId = getJobId(alarm);
  let job = jobMap[jobId];
  delete jobMap[jobId];
  job.stop();

  let utcTime = moment(alarm.time).utc().format('HH:mm');
  let pdtTime = moment(alarm.time).tz('America/Los_Angeles').format('HH:mm');
  writeToLog(`Message delivery canceled, previously scheduled to send at ${alarm.day}, UTC time ${utcTime} or PDT time ${pdtTime} by uid ${alarm.user}`);
  writeToLog(`Total number of current jobs: ${Object.keys(jobMap).length}`);
}

const send = (alarm) => {
  var params = {
    MessageBody: JSON.stringify(alarm),
    QueueUrl: queueUrl,
    DelaySeconds: 0
  };

  sqs.sendMessage(params, function(err, data) {
    if(err) console.log(err);
    else {
      console.log(data);
      writeToLog("Message sent to SQS");
      writeToLog(`${JSON.stringify(alarm)}`);
    }
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

const writeToLog = (txt) => {
  let currTime = new Date();
  let toBeAppended = `${currTime.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} (PDT) ${txt}\n`;
  fs.appendFile('log.txt', toBeAppended, (err) => {
    if (err) throw err;
  });
}

const getJobId = (alarm) => {
  return `${alarm.day}-${alarm.time}-${alarm.user}`;
}

module.exports = { scheduleAlarms, cancelAlarm }

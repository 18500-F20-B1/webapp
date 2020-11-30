## How I made full stack app continuously in background on EC2

I use pm2.
I can't use commands that start with "serve" or "pm2" because of permission issues. I realize it can be worked around by calling npx to execute serve or pm2 commands instead.
In frontend/, I did npm run build and created a run.sh which pm2 uses to run the app (npx pm2 start run.sh --name frontend). The app now runs on port 5000 instead of 4000 in dev mode. 
In backend/, I used the entry file directly(npx pm2 start index.js). I think the backend app runs on port 4000 instead of 3000 in dev mode? I used "sudo kill -9 $(sudo lsof -t -i:4000)" to kill the process running on port 4000.

# Remeber the alarms are in PST!

# Don't forget to run the [Pi snippet](https://github.com/18500-F20-B1/RPi/tree/yh-sqs), before you set the alarm on web app.

## If you are testing with the web app hosted on ec2, just go to `http://3.129.61.132:3000`
If you set an alarm on every Wednesday at 09:10 on web app UI, then no more than a few seconds later at 9:10, you should be able to see somthing like, in the console running the Pi snippet:
```
Received and deleted message: {'ringtone': {'_id': '5fac0e727e697235ac6d17f6', 'notes': [67, 0.5, 60, 0.25, 55, 0.5, 67, 0.25, 62, 0.5], 'name': 'Windows'}, 'day': 'Wednesday', 'time': '2020-11-11T17:09:10.000Z', '_id': '5fac1a7b47f392773f8a90d0'}
```
Note the `time` field value seen here might be different from the one we set on web app UI, but it is okay because the time object is in UTC format.

## If you are testing with locally hosted web app:

If it is your first time cloning the repository, do this at root level, in `frontend/` and `backend/`:
```
npm i
```
And then, to run, do this at root level:
```
npm run dev 
```

If you want to test the alarm immediately, remember to set the right day & time before you created the alarm.

On the "Create an Alarm" Page, after you created the alarm, if you immediately see this logged in the console, that means the alarm is successfully scheduled(in this case on every Wednesday at 09:10):
```
[0] Message scheduled to send at Wednesday 09 10
```
Then later, at 09:10 Wednesday, you should see another line logged in the console:
```
[0] Message sent to SQS
[0] { ResponseMetadata: { RequestId: '685f25fc-db28-5cb6-bebf-7ddac7c4a315' },
[0]   MD5OfMessageBody: '0bca6e568e22bd5ce7fbb942ee554d23',
[0]   MessageId: 'd044e389-fc53-4239-9735-021c46261e7a' }
```
where the json data is associated with the message sent to SQS.

Then no more than a few seconds later, you should be able to see somthing like, in the console running the Pi snippet:
```
Received and deleted message: {'ringtone': {'_id': '5fac0e727e697235ac6d17f6', 'notes': [67, 0.5, 60, 0.25, 55, 0.5, 67, 0.25, 62, 0.5], 'name': 'Windows'}, 'day': 'Wednesday', 'time': '2020-11-11T17:09:10.000Z', '_id': '5fac1a7b47f392773f8a90d0'}
```
Note the `time` field value seen here might be different from the one we set on web app UI, but it is okay because the time object is in UTC format.


## Debug:
Make sure you have your aws credentials in your local machine running the Pi snippet, i.e. in `./aws/credentials`
My SQS access policy is set as follows, which allows any action taken by anybody on the queue in the Pi snippet:
```
{
  "Version": "2012-10-17",
  "Id": "arn:aws:sqs:us-east-2:248059054815:MyFirstQueue/SQSDefaultPolicy",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sqs:*",
      "Resource": "arn:aws:sqs:*:248059054815:MyFirstQueue"
    }
  ]
}
```

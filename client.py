sqs = boto3.client("sqs")

queue_url = "<your own queue URL>"

while True:
	# Receive message from SQS queue
	response = sqs.receive_message(
	    QueueUrl=queue_url,
	    MaxNumberOfMessages=1,
	    MessageAttributeNames=[
	        "All"
	    ],
	    VisibilityTimeout=0,
	    WaitTimeSeconds=0
	)

	try:
		message = response["Messages"][0]
		receipt_handle = message["ReceiptHandle"]
		messageBodyJson =  json.loads(message["Body"])

		# Delete received message from queue
		sqs.delete_message(
		    QueueUrl=queue_url,
		    ReceiptHandle=receipt_handle
		)
		print("Received and deleted message: %s" % messageBodyJson)
	except KeyError:
		pass

	time.sleep(1)

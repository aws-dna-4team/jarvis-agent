'use strict';

// cloudwatch example

var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'ap-southeast-1'});

// Create CloudWatch service object
var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});

module.exports.submit = (event, context, callback) => {


  console.log('lambda was triggered !');
  
  const requestBody = JSON.parse(event.body);

  getEC2_InstanceID(requestBody.alexaName, response => {
    if (response.status == "success") {
      var instanceId = response.data.Reservations[0].Instances[0].InstanceId;
      console.log("instanceID received: ", instanceId);
      getEC2_CPUUtilization(event, instanceId, requestBody.lastMinutes, callback);
    } else {
      console.log("error happened while getting InstanceID for alexaName: ", requestBody.alexaName);

      var errorMessage = "Error happened while getting InstanceID for alexaName, " + requestBody.alexaName;
      var responseMetric = {
        statusCode: 400,
        body: JSON.stringify({
          message: errorMessage
        }),
      };
      callback(null, responseMetric);
    }
  });
  
  
  
  const finalResponse = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Function executed successfully",
      input: requestBody.alexaName,
    }),

  };
  
  console.log("finalResponse: ", finalResponse);

  //callback(null, finalResponse);
};

var getEC2_InstanceID = (alexaName, callback) => {
  var params = {
    DryRun: false,
    Filters: [
          {
              Name: "tag:AlexaName",
              Values: [alexaName]
          }
        ]
  };

  const ec2 = new AWS.EC2();
  ec2.describeInstances(params, function(err, data) {
      var response = {
        status: "nothing",
        data: null
      }
      if (err) {
        console.log("ec2 describe error: ", err);
        response.status = "error";
        response.data = err
      } else {
        console.log("ec2 describe success, data: ", data);
        if (data.Reservations.length > 0) {
          console.log("ec2 describe success, instances[0]: ", data.Reservations[0].Instances[0]);
          response.status = "success";
          response.data = data;
        } else {
          response.status = "error";
          response.data = err
        }
        
      }
      callback(response);
  });

}

var getEC2_CPUUtilization = (event, instanceId, durationInMinutes = 5, callback) => {

  var MS_PER_MINUTE = 60000;

  var currentdate = new Date();
  var startTimeDate = new Date(currentdate - durationInMinutes * MS_PER_MINUTE);

  var startTimeISOString = startTimeDate.toISOString();
  var endTimeISOString = currentdate.toISOString();
  var period  = durationInMinutes * 60;

  console.log("startTimeISOString: ", startTimeISOString);
  console.log("endTimeISOString: ", endTimeISOString);
  
  var metricStatisticsParams = {
    Dimensions: [
      {
        Name: 'InstanceId', /* LogGroupName required */
        Value: instanceId,
      }
    ],
    MetricName: 'CPUUtilization',
    Namespace: 'AWS/EC2',
    StartTime: startTimeISOString,
    EndTime: endTimeISOString,
    Period: period,
    Statistics: ['Average']
  };

  cw.getMetricStatistics(metricStatisticsParams, function(err, data) {
    var responseMetric = "nothing";
    if (err) {
      responseMetric = {
        statusCode: 200,
        body: JSON.stringify({
          message: "Error happened getMetricStatistics",
          input: event,
        }),
      };

      console.log("Error", err);
    } else {
      var responseMetric = {
        statusCode: 200,
        body: JSON.stringify({
          message: data,
          input: event,
        }),
      };

      console.log("getMetricStatistics. data: ", JSON.stringify(data));
      callback(null, responseMetric);
    }
  });
}

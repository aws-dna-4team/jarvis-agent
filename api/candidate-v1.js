'use strict';

// cloudwatch example

var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'ap-southeast-1'});

// Create CloudWatch service object
var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});


module.exports.submit = (event, context, callback) => {

  // list metrics
  // var params = {
  //   Dimensions: [
  //     {
  //       Name: 'LogGroupName', /* LogGroupName required */
  //     },
  //   ],
  //   MetricName: 'IncomingLogEvents',
  //   Namespace: 'AWS/Logs'
  // };
  var params = {
    Dimensions: [
      {
        Name: 'InstanceId', /* LogGroupName required */
      }
    ],
    MetricName: 'CPUUtilization',
    Namespace: 'AWS/EC2'
  };



  // var cloudwatch = new AWS.CloudWatch();
  // cloudwatch.getMetricWidgetImage(params, function (err, data) {
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else     console.log(data);           // successful response
  // });
  
  var response = "initialized response!";
  cw.listMetrics(params, function(err, data) {
    if (err) {
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: "Error happened",
          input: event,
        }),
      };

      callback(null, response);
      console.log("Error", err);
    } else {

      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: "Metrics: " + JSON.stringify(data.Metrics),
          input: event,
        }),
      };

      

      
      console.log("Metrics", JSON.stringify(data.Metrics));
      // callback(null, response);
    }
  });


  var metricStatisticsParams = {
    Dimensions: [
      {
        Name: 'InstanceId', /* LogGroupName required */
        Value: 'i-0c7aad6ab4b3a6089',
      }
    ],
    MetricName: 'CPUUtilization',
    Namespace: 'AWS/EC2',
    StartTime: '2020-09-07T01:00:59.000Z',
    EndTime: '2020-09-07T02:06:59.000Z',
    Period: '3600',
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
          message: "getMetricStatistics: " + JSON.stringify(data.Metrics),
          input: event,
        }),
      };

      console.log("getMetricStatistics. data: ", JSON.stringify(data));
      // callback(null, response);
    }
  });

  const requestBody = JSON.parse(event.body);
  const finalResponse = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Function executed successfully",
      input: requestBody.instanceName,
    }),

  };
  
  console.log("finalResponse: ", finalResponse);

  callback(null, finalResponse);
};


//////////// dynamo-db write solution
// const uuid = require('uuid');
// const AWS = require('aws-sdk'); 

// AWS.config.setPromisesDependency(require('bluebird'));

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

// module.exports.submit = (event, context, callback) => {
//   const requestBody = JSON.parse(event.body);
//   const fullname = requestBody.fullname;
//   const email = requestBody.email;
//   const experience = requestBody.experience;

//   if (typeof fullname !== 'string' || typeof email !== 'string' || typeof experience !== 'number') {
//     console.error('Validation Failed');
//     callback(new Error('Couldn\'t submit candidate because of validation errors.'));
//     return;
//   }

//   submitCandidateP(candidateInfo(fullname, email, experience))
//     .then(res => {
//       callback(null, {
//         statusCode: 200,
//         body: JSON.stringify({
//           message: `Sucessfully submitted candidate with email ${email}`,
//           candidateId: res.id
//         })
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       callback(null, {
//         statusCode: 500,
//         body: JSON.stringify({
//           message: `Unable to submit candidate with email ${email}`
//         })
//       })
//     });
// };


// const submitCandidateP = candidate => {
//   console.log('Submitting candidate');
//   const candidateInfo = {
//     TableName: process.env.CANDIDATE_TABLE,
//     Item: candidate,
//   };
//   return dynamoDb.put(candidateInfo).promise()
//     .then(res => candidate);
// };

// const candidateInfo = (fullname, email, experience) => {
//   const timestamp = new Date().getTime();
//   return {
//     id: uuid.v1(),
//     fullname: fullname,
//     email: email,
//     experience: experience,
//     submittedAt: timestamp,
//     updatedAt: timestamp,
//   };
// };
////////////////////////////


// just hello world code
//
// module.exports.submit = (event, context, callback) => {
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: "Go Serverless v1.0! Your function executed successfully",
//       input: event,
//     }),

//   };

//   callback(null, response);
// };


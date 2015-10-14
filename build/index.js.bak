// loas module
var express = require('express')
var app = express()
// Needle
var needle = require('needle');

// get config objects
var config = require("./config/config");
var apiConfig = config.api;
var mediatorConfig = require("./config/mediator");

// include register script
var register = require("./register");
register.registerMediator( apiConfig, mediatorConfig)


/* ######################### */
/* ##### Server Setup  ##### */
/* ######################### */

/* ##### Default Endpoint  ##### */
// app.get('/collections/1660/fred_api/v1/facilities.json', function (req, res) { 
app.get('/facilities/', function (req, res) {

  needle.get('http://resourcemap.instedd.org/collections/1660/fred_api/v1/facilities.json', function (req, res) {
    if(err) {
      console.log(err);
      return;
    }
  });


  /* ######################################### */
  /* ##### Create Initial Orchestration  ##### */
  /* ######################################### */
   
  var response = 'Primary Route Reached';

  // context object to store json objects
  var ctxObject = {};
  ctxObject['primary'] = response;
   
  //Capture 'primary' orchestration data 
  orchestrationsResults = [];
  orchestrationsResults.push({
    name: 'Primary Route',
    request: {
      path : req.path,
      headers: req.headers,
      querystring: req.originalUrl.replace( req.path, "" ),
      body: req.body,
      method: req.method,
      timestamp: new Date().getTime()
    },
    response: {
      status: 200,
      body: response,
      timestamp: new Date().getTime()
    }
  });

  /* ###################################### */
  /* ##### Construct Response Object  ##### */
  /* ###################################### */
   
  var urn = mediatorConfig.urn;
  var status = 'Successful';
  var response = {
    status: resp.statusCode,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(resp.body, null, 4),
    timestamp: new Date().getTime()
  };
   
  // construct property data to be returned
  var properties = {};
  properties[ctxObject.encounter.observations[0].obsType] = ctxObject.encounter.observations[0].obsValue + ctxObject.encounter.observations[0].obsUnit;
  properties[ctxObject.encounter.observations[1].obsType] = ctxObject.encounter.observations[1].obsValue + ctxObject.encounter.observations[1].obsUnit;
  properties[ctxObject.encounter.observations[2].obsType] = ctxObject.encounter.observations[2].obsValue + ctxObject.encounter.observations[2].obsUnit;
  properties[ctxObject.encounter.observations[3].obsType] = ctxObject.encounter.observations[3].obsValue + ctxObject.encounter.observations[3].obsUnit;
  properties[ctxObject.encounter.observations[4].obsType] = ctxObject.encounter.observations[4].obsValue + ctxObject.encounter.observations[4].obsUnit;
  properties[ctxObject.encounter.observations[5].obsType] = ctxObject.encounter.observations[5].obsValue + ctxObject.encounter.observations[5].obsUnit;  
 
  // construct returnObject to be returned
  var returnObject = {
    "x-mediator-urn": urn,
    "status": status,
    "response": response,
    "orchestrations": orchestrationsResults,
    "properties": properties
  }

  // set content type header so that OpenHIM knows how to handle the response
  res.set('Content-Type', 'application/json+openhim');
  res.send(returnObject);
  
})

// export app for use in grunt-express module
module.exports = app;

/* ######################### */
/* ##### Server Setup  ##### */
/* ######################### */

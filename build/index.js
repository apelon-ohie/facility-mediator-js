// loas module
var express = require('express')
var app = express()
// Needles
var needleRm = require('needle');
var needleDts = require('needle');
var needleVerify = require('needle');

// get config objects
var config = require("./config/config");
var apiConfig = config.api;
var mediatorConfig = require("./config/mediator");

// include register script
var register = require("./register");
register.registerMediator( apiConfig, mediatorConfig)

app.get('/dts-facilities/', function (req, res) {

  needleDts.get('http://40.143.220.156:8081/dtsserverws/fhir/ValueSet/valueset-c80-facilitycodes/$expand',
   {username: 'dtsadminuser', password: 'dtsadmin'},
   function (err, resp){
    if (err){
      console.log(err)
      return;
    } else {
      //console.log(resp.body);
    }

    var responseBody = resp.body;

    res.set('content-type', 'text/xml');
    res.send(responseBody);
 
   });
})

app.get('/rm-facilities/', function (req, res) {
  
  needleRm.get(
   'http://resourcemap.instedd.org/api/collections/1660.json', 
   {username: 'vkaloidis@apelon.com', password: 'apelon123'}, 
   function(err, resp) {
   
    if (err){
      console.log(err)
      return;
    } else {
      //console.log(resp.body);
    }
    var responseBody = JSON.stringify(resp.body);

    res.set('content-type', 'text/html');
    res.send(responseBody);
  });

})

//Methods to Fetch data from asynchronus functions declared in needle.get() calls
//    The data is not easily accesible, and is causaing issues.
var data = "";
function addData(input) {
  data = data + input;
}

function getData() {
  var returnData = data;
  data = "";
  return returnData;
}

app.get('/facilities/', function (req, res) {
  console.log("Facilities Module Loaded");
  needleDts.get('http://localhost:4000/dts-facilities/', function (err, dtsNeedleResp){
    console.log("DTS Data Loaded");
    var dts = dtsNeedleResp.body;
    needleRm.get('http://localhost:4000/rm-facilities/', function (err, rmNeedleResp){
      console.log("ResourceMap Data Loaded");
      var rm = rmNeedleResp.body;
      var response = "<html><body>";
      var json = JSON.parse(rm);
      var facilities = json.sites;
      for(i = 0; i < json.count; i++) {
	var sct = facilities[i].properties.snomed_facility_type_code;

	response = response + "<ul>";
        response = response + "<li>" + json.name + " Facility: ";
	response = response + "<ul>"
		response = response + "<li>" + facilities[i].name + "</li>";
	response = response + " <li><b>Lat:</b> " + facilities[i].lat + "</li>";
	response = response + "<li><b>Long:</b> " + facilities[i].long + "</li>";
	response = response + "<li><b>SCT Code:</b> " + sct + "</li>";  
	response = response + "</ul></li>";
	
        var needleStream = needleVerify.get('http://40.143.220.156:8081/dtsserverws/fhir/ValueSet/valueset-c80-facilitycodes/$validate?system=http://snomed.info/sct&code=' + sct, {username: 'dtsadminuser', password:'dtsadmin'});

	needleStream.on('end', function(err, resp) {
	
	    if(err) {
	      console.log("Error: " + err);
	      return;
	    } else {
	      if((resp.body).indexOf("CODE IS NOT VALID") != -1) {
	  	  response = response + "<li>SCT CODE " + sct + " IS  NOT VALID</li>";
	      } else {
	         response = response + "<li>SCT CODE " + sct + " IS VALID</li>";
	      }
	    }
	  });
	response = response + "</ul>";
      }
      response = response + getData();
      response = response + "</body></html>";
      res.set('content-type', 'text/html');
      res.send(response);
    });
   });

})


// export app for use in grunt-express module
module.exports = app;

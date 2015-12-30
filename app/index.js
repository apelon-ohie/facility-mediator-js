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

  needleDts.get('http://FHIR-SERVER-URL/dtsserverws/fhir/ValueSet/FHIR-VALUESET-NAME/codes/$expand',
   {username: 'DTS-USER', password: 'DTS-PASSWORD'},
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
   'http://resourcemap.instedd.org/api/collections/123-collection-id.json', 
   {username: 'RESOURCEMAP-USERNAME', password: 'RESOURCEMAP-PASSWORD'}, 
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

	      response = response + "<ul>"
          + "<li>" + json.name + " Facility: ";
	        + "<ul>"
		        + "<li>" + facilities[i].name + "</li>";
	          + " <li><b>Lat:</b> " + facilities[i].lat + "</li>";
	          + "<li><b>Long:</b> " + facilities[i].long + "</li>";
	          + "<li><b>SCT Code:</b> " + sct + "</li>";  
	          + "</ul></li>";
	
        //Asynchronus Javascript Function does not get executed right-away... It takes some time
        needleVerify.get('http://FHIR-SERVER-URL:8081/dtsserverws/fhir/ValueSet/FHIR-VALUESET-NAME/$validate?system=http://snomed.info/sct&code=' + sct, 
            {username: 'FHIR-USERNAME', password:'FHIR-PASSWORD'}, 
            function(err, resp) {
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

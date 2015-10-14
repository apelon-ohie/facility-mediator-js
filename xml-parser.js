//These are the two ways we can parse XML. 
// These are to be used to parse the XML response of the SCT Check
// Neither have completely worked. They both convert the XML response to
// a native javascript object. But the data that validates the SCT Code
// is 3 levels deep and not easily accessible

        //  METHOD 1 - Require htmlparser
         var htmlparser = require("htmlparser");
	 var handler = new htmlparser.DefaultHandler(function (error, dom) {
           if(error) {
               console.log(err);a
             return;
             } else {
                return dom;
             }
           var parser = new htmlparser.Parser(handler);
           parser.parseComplete(JSON.stringify(resp.body));
           console.log(handler.dom.children);

        //METHOD 2 - Uncomment the libxml-to-js require on line 9
	var parser = require('libxml-to-js');
           var verifyResponse = JSON.parse(resp.body);
           parser(resp.body, function (error, parseResult) {
            //console.log(parseResult);
             for(var key in parseResult) {
               //console.log("Key - " + key);
             if (Object.prototype.hasOwnProperty.call(parseResult, key)) {
               //console.log("--------------------");
               if(key == 'parameter') {
                 if(parseResult[key].parameter) {
                   console.log(parseResult[key].parameter);
                 }
               }
               //console.log("Key - " + key + " - " + parseResult[key]);
               //console.log(parseResult[key]);
               //console.log("--------------------");
             }
           }


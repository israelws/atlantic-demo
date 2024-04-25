const express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();
var PublicGoogleSheetsParser = require('public-google-sheets-parser')
var createError = require('http-errors');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

router.get('/loads-data', async function(req, res){
  const load_id = req.query.load_id;
  const spreadsheetId = '1_A8uu2070OapLEBjwcs1ckJ2KbcDX1f0PjxHFVgqPsc'
  const parser = new PublicGoogleSheetsParser(spreadsheetId)
  var loads_data = await parser.parse();

  for (var i = 0; i < loads_data.length; i++) {
    //
    //console.log(loads_data[i]['Load ID']);
    if (loads_data[i]['Load ID'] == load_id) {
      res.send(loads_data[i]);
      return;
    }
  }
  res.send({});
});

router.get('/loads-query', async function(req, res){
  const origin = req.query.origin;
  const destination = req.query.destination;

  const spreadsheetId = '1_A8uu2070OapLEBjwcs1ckJ2KbcDX1f0PjxHFVgqPsc'
  const parser = new PublicGoogleSheetsParser(spreadsheetId)
  var loads_data = await parser.parse();

  var max = 3;
  var count = 0;
  var result = [];

  for (var i = 0; i < loads_data.length; i++) {
    // check for max
    if(count > max){
      break;
    }
    //check for origin only 
    if( origin && !destination || origin && destination==""){
      if (loads_data[i]['Origin State'] == origin) {
        result.push(loads_data[i]);
        count++;
      }
      continue;
    }

    //check for destination only
    if( !origin && destination || origin=="" && destination){
      if (loads_data[i]['Destination State'] == destination) {
        result.push(loads_data[i]);
        count++;
      }
      continue;
    }

    //check for both origin and destination
    if( origin && destination){
      if (loads_data[i]['Origin State'] == origin && loads_data[i]['Destination State'] == destination) {
        result.push(loads_data[i]);
        count++;

      }
    }

    
    
  }
  res.send(result);
});

app.use('/', router);

const port = process.env.PORT || 3001;

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

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

app.use('/', router);

const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.type('html').send(html));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

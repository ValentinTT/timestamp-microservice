// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//Main code goes here
app.get("/api/timestamp/:date_string?", (req, res) => {
  let validation = validateParam(req.params.date_string);
  if(validation.isOk) 
    res.json({
      "unix": validation.unix,
      "utc": validation.utc
    });
  else 
    res.json({"error":"Invalid Date"});
});

const validateParam = (param) => {
  if(param === undefined) {
    let date = new Date();
    return {isOk: true, utc: date.toUTCString(), unix: date.getTime()}
  }
  const invalidResponse = {isOk: false};
  const utcRegEx = /(\d{1,4})-(\d{1,2})-(\d{1,2})$/;  
  const unixRegEx = /^\d+$/;
  let paramIsDate = utcRegEx.exec(param);
  let paramIsUnix = unixRegEx.exec(param);
  if(paramIsDate) {
    const [year, month, day] = [parseInt(paramIsDate[1]), parseInt(paramIsDate[2])-1, parseInt(paramIsDate[3])];
    if(!checkDate(year, month, day)) 
      return invalidResponse;
    const date = new Date(year, month, day);
    return {isOk: true, utc: date.toUTCString(), unix: date.getTime()}
  } else if (paramIsUnix) {
    const date = new Date(parseInt(paramIsUnix[0]));
    return {isOk: true, utc: date.toUTCString(), unix: date.getTime()}
  }
  return invalidResponse;
}

const checkDate = (year, month, day) => {
  if(month < 1 || month > 12) return false;
  if(day < 1 || day > getDaysInMonth(year, month)) return false;
  return true;
}
     
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDays;

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
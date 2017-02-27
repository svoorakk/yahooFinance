"option strict" 

var http = require('http');
var fs = require('fs');
var path = require('path');
var csvToJson = require('simpleCsvToJson');
var yahooHost = 'download.finance.yahoo.com';
var yahooPath = '/d/quotes.csv?'
var limit = 100;

//read codes file
//break input into multiple arrays
//get codes
//get data
var codePath = path.join(__dirname, 'yfinance_codes.csv');
var codesData = fs.readFileSync(codePath).toString();
var codes = {}
csvToJson.getJson(codesData, function (err, data) {
	data.forEach(function(element,idx,array) {
		codes[element.short] = element;
	})
});

var yahooFinance = function () {

};

yahooFinance.prototype.getTickerData = function (tickers, dataPoints, callback) {
	var self = this;
	var tickerData = '';
	tickArr = splitTickers(tickers);
	makeRecursiveRequests(tickArr, dataPoints, tickerData, callback);
};

var makeRecursiveRequests = function (tickArr, dataPoints, tickerData, callback) {
	var qs = yahooPath + buildQs(tickArr.splice(0,1), dataPoints);
	makeYahooHttpRequest(qs, function(err, data) {
		tickerData = tickerData + data;
		if (tickArr.length == 0) {
			//console.log(dataPoints.toString());
			//console.log(tickArr.length);
			callback(null, tickerData);
			return;
		}
		makeRecursiveRequests(tickArr, dataPoints, tickerData, callback);
	});
}
 

var getCodeString = function(dataPoints) {
	var codeString = '';
	dataPoints.forEach(function(element,idx,array) {
		codeString = codeString + codes[element].code;
	})
	//console.log(codeString);
	return codeString;
}

var splitTickers = function (tickers) {
	var tickArr = [];
	while (tickers.length > limit) {
		tickArr.push(tickers.splice(0, limit));
	}
	if (tickers.length) 
		tickArr.push(tickers);
	console.log('No. of Ticker arrays: ', tickArr.length);
	return tickArr;
};

var buildQs = function (tickers, dataPoints) {
	var qs = 's=';
	tickers.forEach(function(ticker, i, array) {
		if (ticker.length > 0) {
			if (i > 0) 
				qs = qs + '+';
			qs = qs + ticker;
		}
	});
	qs = qs + '&f=' + getCodeString(dataPoints);
	return qs;
};

var makeYahooHttpRequest = function(qs, callback) {
	http.request(
			{
				host: yahooHost, 
				path : qs
			}, 
			function (response) {
				var str = '';
				response.on('error', function (error) {
					console.log(error.toString());
				});
				response.on('data', function (chunk) {
					str = str + chunk;
				});
				response.on('end', function () {
					callback(null, str);
				});
			}).end();
};

module.exports = function () {
	return new yahooFinance();
};
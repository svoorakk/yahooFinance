"option strict" 

var ys = require('./index');
var yf = new ys();

yf.getTickerData(['INTC','AAPL','^BSESN'], ['Symbol','Name','LastTradeTm','LastTradeDt','LastTrade','BV','EPSCY','Float','52WkL','MktCap','XDivDt','PENY','DivYield','DPS','EPS','EPSNY','52WkH','50Avg','PriceSales','PE','PEG','1YrTgt','Error','EPSNQ','EBITDA','DayHigh','DayLow','SE'], function (err, data) {
	console.log(err);
	console.log(data);
})
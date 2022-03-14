var express = require('express')
var router = express.Router()
var etherMainnetFuncs = require('../library/chartFuncs')

router.get('/token_info/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getTokenInfo(req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/token_price', function(req, res, next) {
  console.log(req.query)
  etherMainnetFuncs.getChartPriceData(req.query.symbol, req.query.symbol, req.query.interval, req.query.startTime, req.query.endTime, req.query.limit)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

module.exports = router;

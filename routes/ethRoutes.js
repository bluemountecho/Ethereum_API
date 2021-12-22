var express = require('express')
var router = express.Router()
var etherMainnetFuncs = require('../library/etherMainnetFuncs')

router.get('/usd_price/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getPriceOfToken(req.params.tokenAddr.toLowerCase())
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/pair_price/:pairAddr', function(req, res, next) {
  etherMainnetFuncs.getLastPriceFromPair(req.params.pairAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

module.exports = router;

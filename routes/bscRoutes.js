var express = require('express')
var router = express.Router()
var bscMainnetFuncs = require('../library/bscMainnetFuncs')

router.get('/usd_price/:tokenAddr', function(req, res, next) {
  bscMainnetFuncs.getPriceOfToken(req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/pair_price/:pairAddr', function(req, res, next) {
  bscMainnetFuncs.getLastPriceFromPair(req.params.pairAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

module.exports = router;

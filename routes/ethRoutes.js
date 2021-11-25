var express = require('express')
var router = express.Router()
var etherMainnetFuncs = require('../library/etherMainnetFuncs')

router.get('/usd_price/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getPriceOfToken(req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

module.exports = router;

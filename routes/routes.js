var express = require('express')
var router = express.Router()
var myFuncs = require('../library/myFuncs')

router.get('/usd_price/:tokenAddr', function(req, res, next) {
  myFuncs.getPriceOfToken(req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

module.exports = router;

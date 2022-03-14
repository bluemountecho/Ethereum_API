var express = require('express')
var router = express.Router()
var etherMainnetFuncs = require('../library/etherMainnetFuncs')

router.get('/token_info/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getTokenInfo(req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

module.exports = router;

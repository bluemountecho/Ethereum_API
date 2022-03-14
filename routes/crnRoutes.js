var express = require('express')
var router = express.Router()
var etherMainnetFuncs = require('../library/etherMainnetFuncs')

router.get('/all_tokens', function (req, res, next) {
  etherMainnetFuncs.getAllTokens1()
  .then(data => {
    res.send(JSON.stringify(data))
  })
})

module.exports = router;

var express = require('express')
var router = express.Router()
var etherMainnetFuncs = require('../library/etherMainnetFuncs')

router.get('/last_price/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getPriceOfToken(req.network, req.params.tokenAddr.toLowerCase())
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/last_pair_price/:pairAddr', function(req, res, next) {
  etherMainnetFuncs.getLastPriceFromPair(req.params.pairAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/all_tokens', function (req, res, next) {
  etherMainnetFuncs.getAllTokens(req.query.page ? req.query.page : 0)
  .then(data => {
    res.send(JSON.stringify(data))
  })
})

router.get('/tokens_from_name/:tokenName', function (req, res, next) {
  etherMainnetFuncs.getTokensFromName(req.params.tokenName)
  .then(data => {
    res.send(JSON.stringify(data))
  })
})

router.get('/token_info/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getTokenInfo(req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/pairs_from_name/:tokenName', function (req, res, next) {
  etherMainnetFuncs.getPairsFromName(req.params.tokenName)
  .then(data => {
    res.send(JSON.stringify(data))
  })
})

router.get('/pair_info/:pairAddr', function(req, res, next) {
  etherMainnetFuncs.getPairInfo(req.params.pairAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/daily_pair_price/:pairAddr', function(req, res, next) {
  etherMainnetFuncs.getDailyPairPrice(req.params.pairAddr, req.query.page ? req.query.page : 0)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/daily_token_price/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getDailyTokenPrice(req.params.tokenAddr, req.query.page ? req.query.page : 0)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/live_pair_price/:pairAddr', function(req, res, next) {
  etherMainnetFuncs.getLivePairPrice(req.params.pairAddr, req.query.page ? req.query.page : 0)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/live_token_price/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getLiveTokenPrice(req.params.tokenAddr, false, req.query.page ? req.query.page : 0)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/daily_market_cap/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getDailyMarketCap(req.params.tokenAddr, req.query.page ? req.query.page : 0)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/contavo_info', function(req, res, next) {
  etherMainnetFuncs.getContavoInfo()
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/token_statistics/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getTokenStatistics(req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

module.exports = router;

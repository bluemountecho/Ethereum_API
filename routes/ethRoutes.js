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
  etherMainnetFuncs.getLastPriceFromPair(req.network, req.params.pairAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/all_tokens', function (req, res, next) {
  etherMainnetFuncs.getAllTokens(req.network, req.query.page ? req.query.page : 0)
  .then(data => {
    res.send(JSON.stringify(data))
  })
})

router.get('/tokens_from_name/:tokenName', function (req, res, next) {
  etherMainnetFuncs.getTokensFromName(req.network, req.params.tokenName)
  .then(data => {
    res.send(JSON.stringify(data))
  })
})

router.get('/token_info/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getTokenInfo(req.network, req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/pairs_from_name/:tokenName', function (req, res, next) {
  etherMainnetFuncs.getPairsFromName(req.network, req.params.tokenName)
  .then(data => {
    res.send(JSON.stringify(data))
  })
})

router.get('/pair_info/:pairAddr', function(req, res, next) {
  etherMainnetFuncs.getPairInfo(req.network, req.params.pairAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/daily_pair_price/:pairAddr', function(req, res, next) {
  etherMainnetFuncs.getDailyPairPrice(req.network, req.params.pairAddr, req.query.page ? req.query.page : 0)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/daily_token_price/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getDailyTokenPrice(req.network, req.params.tokenAddr, req.query.page ? req.query.page : 0)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/live_pair_price/:pairAddr', function(req, res, next) {
  etherMainnetFuncs.getLivePairPrice(req.network, req.params.pairAddr, req.query.page ? req.query.page : 0)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/live_token_price/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getLiveTokenPrice(req.network, req.params.tokenAddr, false, req.query.page ? req.query.page : 0)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/daily_market_cap/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getDailyMarketCap(req.network, req.params.tokenAddr, req.query.page ? req.query.page : 0)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/contavo_info', function(req, res, next) {
  etherMainnetFuncs.getContavoInfo(req.network)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/token_statistics/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getTokenStatistics(req.network, req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/coins', function(req, res, next) {
  if (req.network != 'all') {
    res.send('')
    return
  }

  etherMainnetFuncs.getAllCoinsList(req.query.page ? req.query.page : 0, req.query.orderby ? req.query.orderby : 'volume')
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

module.exports = router;

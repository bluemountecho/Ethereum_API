var express = require('express')
var router = express.Router()
var etherMainnetFuncs = require('../library/etherMainnetFuncs')

// router.get('/usd_price/:tokenAddr', function(req, res, next) {
//   etherMainnetFuncs.getPriceOfToken(req.params.tokenAddr.toLowerCase())
//   .then((data) => {
//     res.send(JSON.stringify(data))
//   })
// });

// router.get('/pair_price/:pairAddr', function(req, res, next) {
//   etherMainnetFuncs.getLastPriceFromPair(req.params.pairAddr)
//   .then((data) => {
//     res.send(JSON.stringify(data))
//   })
// });

router.get('/all_tokens', function (req, res, next) {
  etherMainnetFuncs.getAllTokens()
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

router.get('/tokenInfo/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getTokenInfo(req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/daily_pair_price_history/:pairAddr', function(req, res, next) {
  etherMainnetFuncs.getDailyPairPrice(req.params.pairAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/live_pair_price/:pairAddr', function(req, res, next) {
  etherMainnetFuncs.getLivePairPrice(req.params.pairAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/daily_token_price_history/:tokenAddr', function(req, res, next) {
  etherMainnetFuncs.getDailyTokenPrice(req.params.tokenAddr)
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

router.get('/live_token_price/:tokenAddr', function(req, res, next) {
  // etherMainnetFuncs.getLiveTokenPrice(req.params.tokenAddr)
  // .then((data) => {
  //   res.send(JSON.stringify(data))
  // })
});

router.get('/pairInfo/:pairAddr', function(req, res, next) {
  // etherMainnetFuncs.getLiveTokenPrice(req.params.tokenAddr)
  // .then((data) => {
  //   res.send(JSON.stringify(data))
  // })
});

module.exports = router;

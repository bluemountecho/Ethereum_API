var express = require('express')
var router = express.Router()

Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/I8IUQHQ-q9Wb5nDDcco__u0bPhqYDUjr'))

async function test() {
    /*
    //==============================================================================
    const lastBlockNumber = await web3.eth.getBlockNumber();
    console.log('Last block number: ', lastBlockNumber);
    let block = await web3.eth.getBlock(lastBlockNumber);
    console.log('Last block hash: ', block.hash);
    console.log('Last block transactions: ', block.transactions);
    block = await web3.eth.getBlock(lastBlockNumber);
    const lastTransaction = block.transactions[block.transactions.length - 1];
    console.log('Last transaction hash: ', lastTransaction);
    const transaction = await web3.eth.getTransaction(lastTransaction);
    console.log('Last transaction: ', JSON.stringify(transaction));
    */
    //=================================================================================
    /*
    contractAddress = "0xb6916bc20cae34de64af39b8534d1459d8bb4128"
    web3.eth.filter({
    address: contractAddress,
    from: 1,
    to: 'latest'
    }).get(function (err, result) {
    console.log(result)
    })*/
}

router.get('/', function(req, res, next) {
  test()
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

module.exports = router;

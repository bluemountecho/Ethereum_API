var express = require('express')
var router = express.Router()

Web3 = require('web3')

//const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/I8IUQHQ-q9Wb5nDDcco__u0bPhqYDUjr'))
const JSBI = require('jsbi')
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/9ea3677d970d4dc99f3f559768b0176c'))
const minABI = require('@uniswap/v2-core/build/IERC20.json')
const uniswapV2PairABI = require('@uniswap/v2-core/build/IUniswapV2Pair.json')
const V3_POOL_ABI = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json')

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
  
  const toBlockNumber = await web3.eth.getBlockNumber();
  const fromBlockNumber = toBlockNumber - 10000
  var tokenContract = new web3.eth.Contract(V3_POOL_ABI.abi, "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8")
  
  let options = {
    fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
    toBlock: 'latest'
  };
  
  var results = await tokenContract.getPastEvents('Swap', options)
  var res = await web3.eth.getTransactionReceipt(results[results.length - 1].transactionHash)
  var balance0, balance1
  
  for (var i = 0; i < res.logs.length; i ++) {
    if (res.logs[i].topics[0] != "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") continue
    if (res.logs[i].topics[1].toLowerCase() != "0x0000000000000000000000008ad599c3A0ff1De082011EFDDc58f1908eb6e6D8".toLowerCase() && res.logs[i].topics[2].toLowerCase() != "0x0000000000000000000000008ad599c3A0ff1De082011EFDDc58f1908eb6e6D8".toLowerCase()) {
      continue
    }

    if (res.logs[i].address.toLowerCase() == "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48".toLowerCase()) {
      balance0 = JSBI.BigInt(res.logs[i].data)
    }

    if (res.logs[i].address.toLowerCase() == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2".toLowerCase()) {
      balance1 = JSBI.BigInt(res.logs[i].data)
    }
  }

  console.log(balance0 / balance1 * 10 ** 12)
}

router.get('/', function(req, res, next) {
  test()
  .then((data) => {
    res.send(JSON.stringify(data))
  })
});

module.exports = router;

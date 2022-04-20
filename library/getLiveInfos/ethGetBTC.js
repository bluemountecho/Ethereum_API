var fs = require('fs')
const config = require('../../config')
const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream("BTC.txt"),
  stderr: fs.createWriteStream("BTC.txt"),
});
const axios = require('axios');
const { param } = require('../../routes/ethRoutes');
const { kStringMaxLength } = require('buffer');
const axiosOption = {
    headers:{
        'x-api-key': 'b2e2c305-e03a-4c5f-ad28-589402e4990c',
        // 'x-api-key': 'c01ccead-491a-45ba-96a3-5b16ff5f458b',
        'Content-Type': 'application/json'
    }
}
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        port : 3306,
        user : 'admin_root',
        password : 'bOPTDZXP8Xvdf9I1',
        database : 'admin_ethereum_api'
        // user : 'root',
        // password : '',
        // database : 'ethereum_api'
    }
})
const baseURL = 'https://btc.getblock.io/mainnet/'
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var lastBlockNumber = 732509
var lastTransactionID = 0

function convertTimestampToString(timestamp, flag = false) {
    if (flag == false) {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
    } else {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

async function sendRequest(method, params) {
    myLogger.log(params)

    var res = await axios.post(baseURL, {
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: 'getblock.io'
    }, axiosOption)

    return res.data
}

async function getBlock() {
    try {
        var blockHash = (await sendRequest('getblockhash', [lastBlockNumber])).result

        await delay(1000)

        var block = (await sendRequest('getblock', [blockHash, 2])).result
        var time = convertTimestampToString(block.time * 1000, true)
        var rows = block.tx
        var price = (await knex('eth_tokens').where('tokenAddress', '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599').select('*'))[0].lastPrice
        // var price = 41344

        for (var i = 0; i < rows.length; i ++) {
            if (lastTransactionID > i) continue

            for (var j = 0; j < rows[i].vout.length; j ++) {
                if (rows[i].vout[j].value == 0) continue

                var tmpPrice = price * (0.9997 + Math.random() * 0.001)

                try {
                    await knex('main_live').insert({
                        coin_id: 31,
                        swapAt: time,
                        swapAmount: rows[i].vout[j].value,
                        swapAmountUSD: rows[i].vout[j].value * tmpPrice,
                        swapPrice: tmpPrice,
                        swapMaker: rows[i].vout[j].scriptPubKey.address,
                        swapTransactionHash: rows[i].hash
                    })
                } catch (err) {

                }
            }
        }

        lastTransactionID = i

        blockHash = (await sendRequest('getblockhash', [lastBlockNumber + 1])).result

        lastBlockNumber ++
        lastTransactionID = 0
    } catch (err) {

    }

    setTimeout(() => {
        getBlock()
    }, 60000)
}

getBlock()
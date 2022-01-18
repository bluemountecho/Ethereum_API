const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'admin_root',
      password : 'bOPTDZXP8Xvdf9I1',
      database : 'admin_ethereum_api'
    }
})

const baseTokens = require('./etherBaseTokens.json')
const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"

var fs = require('fs')
const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream("app_" + convertTimestampToString(new Date())  + ".txt"),
  stderr: fs.createWriteStream("app_" + convertTimestampToString(new Date())  + ".txt"),
});

function convertTimestampToString(timestamp, flag = false) {
    if (flag == false) {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
    } else {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

/*
var pairList = []
var tokenList = []

knex('eth_pairs').select('*').then(rows => {
    for (var i = 0; i < rows.length; i ++) {
        if (!pairList[rows[i].token0Address]) {
            pairList[rows[i].token0Address] = []
        }

        if (!pairList[rows[i].token0Address][rows[i].token1Address]) {
            pairList[rows[i].token0Address][rows[i].token1Address] = []
        }
    
        pairList[rows[i].token0Address][rows[i].token1Address].push({
            lastPrice: rows[i].lastPrice ? 1.0 / rows[i].lastPrice : 0,
            timestamp: rows[i].timestamp
        })

        if (!pairList[rows[i].token1Address]) {
            pairList[rows[i].token1Address] = []
        }

        if (!pairList[rows[i].token1Address][rows[i].token0Address]) {
            pairList[rows[i].token1Address][rows[i].token0Address] = []
        }
    
        pairList[rows[i].token1Address][rows[i].token0Address].push({
            lastPrice: rows[i].lastPrice,
            timestamp: rows[i].timestamp
        })

        //if (!pairList[rows[i].token0Address])
        //    pairList[rows[i].token0Address] = 0
        //if (!pairList[rows[i].token1Address])
        //    pairList[rows[i].token1Address] = 0

        //pairList[rows[i].token0Address] ++
        //pairList[rows[i].token1Address] ++
    }

    knex('eth_tokens').select('*').then(rows => {
        for (var i = 0; i < rows.length; i ++) {
            tokenList[rows[i].tokenAddress] = {
                tokenAddress: rows[i].tokenAddress,
                symbol: rows[i].tokenSymbol,
                name: rows[i].tokenName,
                decimal: rows[i].tokenDecimals
            }
        }
        
        myLogger.log('========= Ether Datas are ready! =========')

        var cnt = 0

        for (var key in pairList) {
            if (pairList[key] > 100) {
                myLogger.log(pairList[key])
                myLogger.log(tokenList[key])
                cnt ++
            }
        }

        myLogger.log('Finished with ' + cnt + ' rows!')
    })
}) */

module.exports.getPriceOfToken = async function getPriceOfToken(tokenAddress) {
    try {
        var tokenInfo = await knex('eth_tokens').where('tokenAddress', tokenAddress).select('*')
        var token0Address = tokenAddress > USDC_ADDRESS ? USDC_ADDRESS : tokenAddress
        var token1Address = tokenAddress < USDC_ADDRESS ? USDC_ADDRESS : tokenAddress

        var rows = await knex('eth_pairs')
            .select('*')
            .where('token0Address', token0Address)
            .where('token1Address', token1Address)
            .orderBy('blockNumber', 'desc')
            .orderBy('transactionID', 'desc')

        if (rows.length && rows[0].lastPrice > 0) {
            var price = token0Address == USDC_ADDRESS ? rows[0].lastPrice : (1.0 / rows[0].lastPrice)

            return {
                message: 'Success!',
                data: {
                    price: price.toFixed(20),
                    symbol: tokenInfo[0].tokenSymbol,
                    name: tokenInfo[0].tokenName
                }
            }
        }

        for (var i = 0; i < baseTokens.length; i ++) {
            var funcs = []

            token0Address = tokenAddress > baseTokens[i] ? baseTokens[i] : tokenAddress
            token1Address = tokenAddress < baseTokens[i] ? baseTokens[i] : tokenAddress

            funcs.push(
                knex('eth_pairs')
                    .select('*')
                    .where('token0Address', token0Address)
                    .where('token1Address', token1Address)
                    .orderBy('blockNumber', 'desc')
                    .orderBy('transactionID', 'desc')
            )

            token0Address = USDC_ADDRESS > baseTokens[i] ? baseTokens[i] : USDC_ADDRESS
            token1Address = USDC_ADDRESS < baseTokens[i] ? baseTokens[i] : USDC_ADDRESS

            funcs.push(
                knex('eth_pairs')
                    .select('*')
                    .where('token0Address', token0Address)
                    .where('token1Address', token1Address)
                    .orderBy('blockNumber', 'desc')
                    .orderBy('transactionID', 'desc')
            )

            var res = await Promise.all(funcs)
            var res1 = 0, res2 = 0

            if (res[0].length > 0 && res[0][0].lastPrice > 0) {
                res1 = res[0][0].token1Address == tokenAddress ? res[0][0].lastPrice : (1.0 / res[0][0].lastPrice)
            }

            if (res[1].length > 0 && res[1][0].lastPrice > 0) {
                res2 = res[1][0].token0Address == USDC_ADDRESS ? res[1][0].lastPrice : (1.0 / res[1][0].lastPrice)
            }

            if (res1 * res2 > 0) {
                return {
                    message: 'Success!',
                    data: {
                        price: (res1 * res2).toFixed(20),
                        symbol: tokenInfo[0].tokenSymbol,
                        name: tokenInfo[0].tokenName
                    }
                }
            }
        }
        
        return {
            message: "Can't find swap route!",
            data: {

            }
        }
    } catch (e) {
        myLogger.log(e)
        
        return {
            message: 'Error occured!',
            data: {
                
            }
        }
    }
}

module.exports.getLastPriceFromPair = async function getLastPriceFromPair(pairAddress) {
    try {
        var pairInfo = (await knex('eth_pairs').where('pairAddress', pairAddress).select('*'))[0]
        var token0Address = pairInfo.token0Address
        var token1Address = pairInfo.token1Address
        var price = pairInfo.lastPrice
        var price0 = await this.getPriceOfToken(token0Address)
        var price1 = await this.getPriceOfToken(token1Address)
        var token0Info = (await knex('eth_tokens').where('tokenAddress', token0Address).select('*'))[0]
        var token1Info = (await knex('eth_tokens').where('tokenAddress', token1Address).select('*'))[0]

        if (price == 0) {
            return {
                message: "Can't find swap route!",
                data: {

                }
            }
        } else {
            return {
                message: "Success!",
                data: {
                    token0: {
                        price: price1.data.price / price,
                        symbol: token0Info.tokenSymbol,
                        name: token0Info.tokenName
                    },
                    token1: {
                        price: price0.data.price * price,
                        symbol: token1Info.tokenSymbol,
                        name: token1Info.tokenName
                    }
                }
            }
        }
    } catch (e) {
        myLogger.log(e)
        return {
            'status': 'fail',
            'data': {

            }
        }
    }
}

module.exports.getAllTokens = async function getAllTokens() {
    try {
        var rows = await knex('eth_tokens').select('*')
        var datas = []

        for (var i = 0; i < rows.length; i ++) {
            datas.push({
                address: rows[i].tokenAddress,
                symbol: rows[i].tokenSymbol,
                name: rows[i].tokenName
            })
        }

        return datas
    } catch (err) {
        myLogger.log(err)
    }
}

module.exports.getPairPriceHistory = async function getPairPriceHistory(pairAddr) {
    try {
        var pair = pairAddr.toLowerCase()
        var content = fs.readFileSync('./database/ethereum/transactions/' + pair + '.txt', {encoding:'utf8', flag:'r'})
        var rows = content.split('\r\n')
        var datas = []

        for (var i = 0; i < rows.length - 1; i ++) {
            datas.push(JSON.parse(rows[i]))
        }

        datas.sort(function (a, b) {
            var ad = (new Date(a.SWAPAT)).getTime()
            var bd = (new Date(b.SWAPAT)).getTime()

            if (ad < bd) return -1
            if (ad > bd) return 1
            return 0
        })

        return datas
    } catch (err) {
        myLogger.log(err)
    }
}
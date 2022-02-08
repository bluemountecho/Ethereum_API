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
const utf8 = require('utf8')
const baseTokens = require('./etherBaseTokens.json')
const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"

var fs = require('fs')
function convertTimestampToString(timestamp, flag = false) {
    if (flag == false) {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
    } else {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

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
        console.log(e)
        
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
        console.log(e)
        return {
            'status': 'fail',
            'data': {

            }
        }
    }
}

module.exports.getAllTokens = async function getAllTokens() {
    try {
        var rows = await knex('eth_tokens').orderBy('createdAt', 'desc').select('*')
        var datas = []

        for (var i = 0; i < rows.length; i ++) {
            datas.push({
                address: rows[i].tokenAddress,
                symbol: rows[i].tokenSymbol,
                name: rows[i].tokenName
            })
        }

        return {
            status: 'Success',
            message: 'Getting all tokens completed successfully!',
            data: datas
        }
    } catch (err) {
        console.log(err)
        return {
            status: 'Fail(Server)',
            message: err,
            data: []
        }
    }
}

module.exports.getTokensFromName = async function getTokensFromName(tokenName) {
    try {
        var rows = await knex('eth_tokens')
            .orderBy('createdAt', 'desc')
            .where('tokenSymbol', 'like', '%' + tokenName + '%')
            .orWhere('tokenName', 'like', '%' + tokenName + '%')
            .orderByRaw('tokenSymbol="' + tokenName + '" desc')
            .orderByRaw('tokenName="' + tokenName + '" desc')
            .select('*')
        var datas = []

        for (var i = 0; i < rows.length; i ++) {
            datas.push({
                address: rows[i].tokenAddress,
                symbol: utf8.decode(rows[i].tokenSymbol),
                name: utf8.decode(rows[i].tokenName)
            })
        }

        return {
            status: 'Success',
            message: 'Getting tokens with name "' + tokenSymbol + '" is completed successfully!',
            data: datas
        }
    } catch (err) {
        console.log(err)
        return {
            status: 'Fail(Server)',
            message: err,
            data: []
        }
    }
}

function getDailyPairData(pairAddr) {
    try {
        var pair = pairAddr.toLowerCase()
        var content = fs.readFileSync('./database/ethereum/transactions/' + pair + '.txt', {encoding:'utf8', flag:'r'})
        var rows = content.split('\n')
        var datas = []

        for (var i = 0; i < rows.length - 1; i ++) {
            datas.push(JSON.parse(rows[i]))
        }

        for (var i = 0; i < datas.length; i ++) {
            datas[i].AVGPRICE = datas[i].TOTALVOLUME0 / datas[i].TOTALVOLUME1
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
        console.log(err)
        return []
    }
}

function mergeDailyPairData(rows) {
    var datas = []
    var res = []

    for (var i = 0; i < rows.length; i ++) {
        var oneData = getDailyPairData(rows[i].pairAddress)

        for (var j = 0; j < oneData.length; j ++) {
            if (!datas[oneData[j].SWAPAT]) {
                datas[oneData[j].SWAPAT] = []
            }

            datas[oneData[j].SWAPAT].push(oneData[j])
        }
    }

    for (var key in datas) {
        var swapAt = key
        var totalVolume0 = 0
        var totalVolume1 = 0
        var volume0 = 0
        var volume1 = 0
        var minPrice = 1000000000000000
        var maxPrice = 0

        for (var i = 0; i < datas[key].length; i ++) {
            totalVolume0 += datas[key][i].TOTALVOLUME0
            totalVolume1 += datas[key][i].TOTALVOLUME1
            volume0 += datas[key][i].VOLUME0
            volume1 += datas[key][i].VOLUME1

            if (minPrice > datas[key][i].MINPRICE && datas[key][i].MINPRICE) minPrice = datas[key][i].MINPRICE
            if (maxPrice < datas[key][i].MAXPRICE && datas[key][i].MAXPRICE) maxPrice = datas[key][i].MAXPRICE
        }

        res.push({
            SWAPAT: swapAt,
            TOTALVOLUME0: totalVolume0,
            TOTALVOLUME1: totalVolume1,
            VOLUME0: volume0,
            VOLUME1: volume1,
            LOWPRICE: minPrice,
            HIGHPRICE: maxPrice,
            AVGPRICE: totalVolume0 / totalVolume1
        })
    }

    res.sort(function (a, b) {
        var ad = (new Date(a.SWAPAT)).getTime()
        var bd = (new Date(b.SWAPAT)).getTime()

        if (ad < bd) return -1
        if (ad > bd) return 1
        return 0
    })

    return res
}

module.exports.getDailyTokenPrice = async function getDailyTokenPrice(tokenAddress) {
    var tokenInfo = await knex('eth_tokens').where('tokenAddress', tokenAddress).select('*')
    // var token0Address = tokenAddress > USDC_ADDRESS ? USDC_ADDRESS : tokenAddress
    // var token1Address = tokenAddress < USDC_ADDRESS ? USDC_ADDRESS : tokenAddress

    // var rows = await knex('eth_pairs')
    //     .where('token0Address', token0Address)
    //     .where('token1Address', token1Address)
    //     .select('*')

    // if (rows.length) {
    //     var res = mergeDailyPairData(rows)

    //     if (token0Address != USDC_ADDRESS) {
    //         for (var i = 0; i < res.length; i ++) {
    //             var tmp = 1.0 / res[i].LOWPRICE

    //             res[i].LOWPRICE = 1.0 / res[i].HIGHPRICE
    //             res[i].HIGHPRICE = tmp
    //             res[i].AVGPRICE = 1.0 / res[i].AVGPRICE
    //         }
    //     }

    //     return {
    //         message: 'Success!',
    //         symbol: tokenInfo[0].tokenSymbol,
    //         name: tokenInfo[0].tokenName,
    //         data: res
    //     }
    // }

    for (var i = 0; i < baseTokens.length; i ++) {
        var funcs = []

        token0Address = tokenAddress > baseTokens[i] ? baseTokens[i] : tokenAddress
        token1Address = tokenAddress < baseTokens[i] ? baseTokens[i] : tokenAddress

        funcs.push(
            knex('eth_pairs')
                .where('token0Address', token0Address)
                .where('token1Address', token1Address)
                .select('*')
        )

        token0Address = USDC_ADDRESS > baseTokens[i] ? baseTokens[i] : USDC_ADDRESS
        token1Address = USDC_ADDRESS < baseTokens[i] ? baseTokens[i] : USDC_ADDRESS

        funcs.push(
            knex('eth_pairs')
                .where('token0Address', token0Address)
                .where('token1Address', token1Address)
                .select('*')
        )

        var rows = await Promise.all(funcs)
        var res1 = mergeDailyPairData(rows[0])
        var res2 = mergeDailyPairData(rows[1])

        if (rows[0].length) {
            if (rows[0][0].token1Address != tokenAddress) {
                for (var j = 0; j < res1.length; j ++) {
                    var tmp = 1.0 / res1[j].LOWPRICE
    
                    res1[j].LOWPRICE = 1.0 / res1[j].HIGHPRICE
                    res1[j].HIGHPRICE = tmp
                    res1[j].AVGPRICE = 1.0 / res1[j].AVGPRICE
                }
            }
        }

        if (rows[1].length) {
            if (rows[1][0].token0Address != USDC_ADDRESS) {
                for (var j = 0; j < res2.length; j ++) {
                    var tmp = 1.0 / res2[j].LOWPRICE
    
                    res2[j].LOWPRICE = 1.0 / res2[j].HIGHPRICE
                    res2[j].HIGHPRICE = tmp
                    res2[j].AVGPRICE = 1.0 / res2[j].AVGPRICE
                }
            }
        }

        if (rows[0].length > 0 && rows[1].length > 0) {
            for (var j = 0; j < res1.length; j ++) {
                var jd = (new Date(res1[j].SWAPAT)).getTime()

                for (var k = res2.length - 1; k >= 0; k --) {
                    var kd = (new Date(res1[j].SWAPAT)).getTime()

                    if (kd <= jd) break
                }

                if (k < 0) break

                res1[j].AVGPRICE = res1[j].AVGPRICE * res2[k].AVGPRICE
                res1[j].HIGHPRICE = res1[j].HIGHPRICE * res2[k].HIGHPRICE
                res1[j].LOWPRICE = res1[j].LOWPRICE * res2[k].LOWPRICE
            }

            if (j == res1.length) {
                return {
                    message: 'Success!',
                    symbol: tokenInfo[0].tokenSymbol,
                    name: tokenInfo[0].tokenName,
                    data: res1
                }
            }
        }
    }
    
    return {
        message: "Can't find swap route!",
        data: {

        }
    }
}

module.exports.getDailyPairPrice = async function getDailyPairPrice(pairAddr) {
    try {
        var pair = pairAddr.toLowerCase()
        var content = fs.readFileSync('./database/ethereum/transactions/' + pair + '.txt', {encoding:'utf8', flag:'r'})
        var rows = content.split('\n')
        var datas = []

        for (var i = 0; i < rows.length - 1; i ++) {
            datas.push(JSON.parse(rows[i]))
        }

        for (var i = 0; i < datas.length; i ++) {
            datas[i].CLOSEPRICE = datas[i].TOTALVOLUME0 / datas[i].TOTALVOLUME1
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
        console.log(err)
    }
}

module.exports.getLivePairPrice = async function getLivePairPrice(pairAddr) {
    try {
        var pair = pairAddr.toLowerCase()
        var rows = await knex('eth_live').where('pairAddress', pair).orderBy('swapAt', 'desc').select('*')
        var datas = []

        for (var i = 0; i < rows.length; i ++) {
            datas.push({
                SWAPAT: rows[i].swapAt,
                PRICE: rows[i].swapPrice,
                SWAPAMOUNT0: rows[i].swapAmount0,
                SWAPAMOUNT1: rows[i].swapAmount1,
                SWAPMAKER: rows[i].swapMaker,
                SWAPTRANSACTION: rows[i].swapTransactionHash,
                BUYORSELL: rows[i].isBuy ? 'BUY' : 'SELL'
            })
        }

        return datas
    } catch (err) {
        console.log(err)
    }
}

module.exports.getTokenInfo = async function getTokenInfo(tokenAddr) {
    try {
        var tokenAddress = tokenAddr.toLowerCase()
        var rows = await knex('eth_tokens').where('tokenAddress', tokenAddress).select('*')

        if (rows.length == 0) {
            return {
                status: 'Fail',
                message: 'Token does not exist!',
                data: []
            }
        } else {
            var infos = {
                description: {
                    en: ''
                },
                links: '',
                image: '',
                market_data: {
                    total_supply: '',
                    circulating_supply: ''
                },
            }
            
            if (rows[0].otherInfos != '') {
                infos = JSON.parse(rows[0].otherInfos)
            }

            return {
                status: 'Success',
                message: 'Getting token info completed successfully!',
                data: [{
                    address: rows[0].tokenAddress,
                    symbol: rows[0].tokenSymbol,
                    address: rows[0].tokenName,
                    sourceCode: rows[0].sourceCode,
                    description: infos.description.en,
                    links: infos.links,
                    image: infos.image,
                    totalSupply: infos.market_data.total_supply,
                    circulatingSupply: infos.market_data.circulating_supply
                }]
            }
        }
    } catch (err) {
        console.log(err)

        return {
            status: 'Fail(Server error)',
            message: err,
            data: []
        }
    }
}
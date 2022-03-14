const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'admin_root',
      password : 'bOPTDZXP8Xvdf9I1',
      database : 'admin_ethereum_api'
    //   user : 'root',
    //   password : '',
    //   database : 'ethereum_api'
    }
})
const utf8 = require('utf8')
const baseTokens = require('./etherBaseTokens.json')
const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
const Web3 = require('web3')

const minERC20ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
]

const options = {
    // Enable auto reconnection
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    },
    keepAlive: true,
    timeout: 20000,
    headers: [{name: 'Access-Control-Allow-Origin', value: '*'}],
    withCredentials: false,
};

const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/KDRotLOmW8M21flLsKNaLN4IO5lB_6PN', options))

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
                    stats: 'Success!',
                    data: {
                        price: (res1 * res2).toFixed(30),
                        symbol: tokenInfo[0].tokenSymbol,
                        name: tokenInfo[0].tokenName
                    }
                }
            }
        }
        
        return {
            status: 'Fail',
            message: "Can't find swap route!",
            data: {

            }
        }
    } catch (e) {
        console.log(e)
        
        return {
            stats: 'Fail(Server error)',
            data: {
                
            }
        }
    }
}

module.exports.getTokenInfo = async function getTokenInfo(tokenAddr) {
    try {
        var tokenAddress = tokenAddr.toLowerCase()
        const contract = new web3.eth.Contract(minERC20ABI, tokenAddress)
        var rows = await knex('eth_tokens').where('tokenAddress', tokenAddress).select('*')
        var totalSupply = await contract.methods.totalSupply().call()
        var tokenPrice = await this.getPriceOfToken(tokenAddress)

        totalSupply = totalSupply / 10 ** rows[0].tokenDecimals

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
            
            if (rows[0].coingeckoInfos != '') {
                infos = JSON.parse(rows[0].coingeckoInfos)
            }

            return {
                status: 'Success',
                message: 'Getting token info completed successfully!',
                data: [{
                    address: rows[0].tokenAddress,
                    symbol: rows[0].tokenSymbol,
                    name: rows[0].tokenName,
                    decimals: rows[0].tokenDecimals,
                    marketCap: (totalSupply * tokenPrice.data.price).toFixed(30),
                    totalSupply: (totalSupply).toFixed(30),
                    totalHolders: rows[0].totalHolders,
                    holders: JSON.parse(rows[0].holders),
                    createdAt: rows[0].createdAt,
                    sourceCode: rows[0].sourceCode,
                    description: infos.description.en,
                    links: {
                        coingecko: infos.links,
                        etherscan: JSON.parse(rows[0].links)
                    },
                    image: {
                        coingecko: infos.image,
                        github: 'https://github.com/thefortube/trust-assets/blob/master/blockchains/ethereum/assets/' + Web3.utils.toChecksumAddress(tokenAddr) + '/logo.png?raw=true'
                    },
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

async function getDailyPairData(pairAddr) {
    try {
        var pair = pairAddr.toLowerCase()
        var datas = []
        var content = fs.readFileSync('./database/ethereum/transactions/' + pair + '.txt', {encoding:'utf8', flag:'r'})
        var rows = content.split('\n')

        for (var i = 0; i < rows.length - 1; i ++) {
            datas.push(JSON.parse(rows[i]))
        }

        for (var i = 0; i < datas.length; i ++) {
            datas[i].AVGPRICE = datas[i].TOTALVOLUME0 / datas[i].TOTALVOLUME1
        }

        return datas
    } catch (err) {
        console.log(err)
        return []
    }
}

async function mergeDailyPairData(rows, token0Address, token1Address, page = -1) {
    var datas = []
    var res = []
    var funcs = []

    for (var i = 0; i < rows.length; i ++) {
        funcs.push(getDailyPairData(rows[i].pairAddress))
    }

    funcs.push(knex.raw('\
    SELECT\
        eth_live.pairAddress AS PAIRADDRESS,\
        CONCAT(YEAR( eth_live.swapAt ), "-", MONTH( eth_live.swapAt ), "-", DAY( eth_live.swapAt )) AS SWAPAT,\
        avg( eth_live.swapPrice ) AS AVGPRICE,\
        max( eth_live.swapPrice ) AS MAXPRICE,\
        min( eth_live.swapPrice ) AS MINPRICE,\
        sum( eth_live.swapAmount0 * ( eth_pairs.baseToken * 2 - 1 ) * ( eth_live.isBuy * - 2 + 1 ) ) AS VOLUME0,\
        sum( eth_live.swapAmount1 * ( eth_pairs.baseToken * - 2 + 1 ) * ( eth_live.isBuy * - 2 + 1 ) ) AS VOLUME1,\
        sum( eth_live.swapAmount0 ) AS TOTALVOLUME0,\
        sum( eth_live.swapAmount1 ) AS TOTALVOLUME1,\
        count( eth_live.swapMaker ) AS SWAPCOUNT \
    FROM\
        eth_live\
        LEFT JOIN eth_pairs ON eth_pairs.pairAddress = eth_live.pairAddress \
    WHERE\
        eth_pairs.token0Address="' + token0Address + '" and eth_pairs.token1Address="' + token1Address + '" and DATE( eth_live.swapAt )="' + convertTimestampToString(new Date().getTime(), true).split(' ')[0] + '"\
    GROUP BY\
        DATE( eth_live.swapAt ) \
    ORDER BY\
        DATE( eth_live.swapAt)'))

    var oneDatas = await Promise.all(funcs)

    for (var i = 0; i < rows.length; i ++) {
        for (var j = 0; j < oneDatas[i].length; j ++) {
            if (!datas[oneDatas[i][j].SWAPAT]) {
                datas[oneDatas[i][j].SWAPAT] = []
            }

            datas[oneDatas[i][j].SWAPAT].push(oneDatas[i][j])
        }
    }
    
    var livePairs = oneDatas[rows.length][0]

    for (var i = 0; i < livePairs.length; i ++) {
        if (!datas[livePairs[i].SWAPAT]) {
            datas[livePairs[i].SWAPAT] = []
        }

        datas[livePairs[i].SWAPAT].push(livePairs[i])
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
            TOTALVOLUME0: totalVolume0.toFixed(30),
            TOTALVOLUME1: totalVolume1.toFixed(30),
            VOLUME0: volume0.toFixed(30),
            VOLUME1: volume1.toFixed(30),
            LOWPRICE: minPrice.toFixed(30),
            HIGHPRICE: maxPrice.toFixed(30),
            AVGPRICE: (totalVolume0 / totalVolume1).toFixed(30)
        })
    }

    res.sort(function (a, b) {
        var ad = (new Date(a.SWAPAT)).getTime()
        var bd = (new Date(b.SWAPAT)).getTime()

        if (ad > bd) return -1
        if (ad < bd) return 1
        return 0
    })

    if (page >= 0) {
        var pageData = []

        for (var i = page * 100; i < page * 100 + 100 && i < res.length; i ++) {
            pageData.push(res[i])
        }

        return pageData
    }

    return res
}

module.exports.getDailyTokenPrice = async function getDailyTokenPrice(tokenAddr, page = 0) {
    var tokenAddress = tokenAddr.toLowerCase()
    var tokenInfo = await knex('eth_tokens').where('tokenAddress', tokenAddress).select('*')

    for (var i = 0; i < baseTokens.length; i ++) {
        var funcs = []

        var token0Address = tokenAddress > baseTokens[i] ? baseTokens[i] : tokenAddress
        var token1Address = tokenAddress < baseTokens[i] ? baseTokens[i] : tokenAddress

        funcs.push(
            knex('eth_pairs')
                .where('token0Address', token0Address)
                .where('token1Address', token1Address)
                .select('*')
        )

        var token2Address = USDC_ADDRESS > baseTokens[i] ? baseTokens[i] : USDC_ADDRESS
        var token3Address = USDC_ADDRESS < baseTokens[i] ? baseTokens[i] : USDC_ADDRESS

        funcs.push(
            knex('eth_pairs')
                .where('token0Address', token2Address)
                .where('token1Address', token3Address)
                .select('*')
        )

        var rows = await Promise.all(funcs)
        var res1 = await mergeDailyPairData(rows[0], token0Address, token1Address, page)
        var res2 = await mergeDailyPairData(rows[1], token2Address, token3Address)

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
            var k = 0

            for (var j = res1.length - 1; j >= 0; j --) {
                var jd = (new Date(res1[j].SWAPAT)).getTime()

                while (true) {
                    var kd = (new Date(res2[k].SWAPAT)).getTime()

                    if (kd > jd) break

                    k ++

                    if (k >= res2.length) break
                }

                k --

                if (k < 0) k = 0

                res1[j].AVGPRICE = res1[j].AVGPRICE * res2[k].AVGPRICE
                res1[j].HIGHPRICE = res1[j].HIGHPRICE * res2[k].HIGHPRICE
                res1[j].LOWPRICE = res1[j].LOWPRICE * res2[k].LOWPRICE
            }
            
            return {
                status: 'Success!',
                symbol: tokenInfo[0].tokenSymbol,
                name: tokenInfo[0].tokenName,
                data: res1
            }
        }
    }
    
    return {
        status: 'Fail',
        message: "Can't find swap route!",
        data: []
    }
}

module.exports.getDailyPairPrice = async function getDailyPairPrice(pairAddr, page = 0) {
    try {
        pairAddr = pairAddr.toLowerCase()
        
        var datas = await getDailyPairData(pairAddr)

        var livePairs = (await knex.raw('\
        SELECT\
            eth_live.pairAddress AS PAIRADDRESS,\
            CONCAT(YEAR( eth_live.swapAt ), "-", MONTH( eth_live.swapAt ), "-", DAY( eth_live.swapAt )) AS SWAPAT,\
            avg( eth_live.swapPrice ) AS AVGPRICE,\
            max( eth_live.swapPrice ) AS MAXPRICE,\
            min( eth_live.swapPrice ) AS MINPRICE,\
            sum( eth_live.swapAmount0 * ( eth_pairs.baseToken * 2 - 1 ) * ( eth_live.isBuy * - 2 + 1 ) ) AS VOLUME0,\
            sum( eth_live.swapAmount1 * ( eth_pairs.baseToken * - 2 + 1 ) * ( eth_live.isBuy * - 2 + 1 ) ) AS VOLUME1,\
            sum( eth_live.swapAmount0 ) AS TOTALVOLUME0,\
            sum( eth_live.swapAmount1 ) AS TOTALVOLUME1,\
            count( eth_live.swapMaker ) AS SWAPCOUNT \
        FROM\
            eth_live\
            LEFT JOIN eth_pairs ON eth_pairs.pairAddress = eth_live.pairAddress \
        WHERE\
            eth_live.pairAddress="' + pairAddr + '" and DATE( eth_live.swapAt )="' + convertTimestampToString(new Date().getTime(), true).split(' ')[0] + '"\
        GROUP BY\
            DATE( eth_live.swapAt ) \
        ORDER BY\
            DATE( eth_live.swapAt)'))[0]

        for (var i = 0; i < livePairs.length; i ++) {
            datas.push(livePairs[i])
        }
        
        datas.sort(function (a, b) {
            var ad = (new Date(a.SWAPAT)).getTime()
            var bd = (new Date(b.SWAPAT)).getTime()

            if (ad > bd) return -1
            if (ad < bd) return 1
            return 0
        })

        if (page >= 0) {
            var pageData = []
    
            for (var i = page * 100; i < page * 100 + 100 && i < datas.length; i ++) {
                pageData.push(datas[i])
            }
    
            return pageData
        }

        return {
            status: 'Success!',
            data: datas
        }
    } catch (err) {
        return {
            status: 'Fail(Server error)',
            message: err,
            data: []
        }
    }
}

async function getLivePairData(token0Address, token1Address, startTime, endTime, limit) {
    var rows 
    var startDate = convertTimestampToString(startTime / 1, true)
    var endDate = convertTimestampToString(endTime / 1, true)

    rows = await knex('eth_live')
        .join('eth_pairs', 'eth_pairs.pairAddress', '=', 'eth_live.pairAddress')
        .where('eth_pairs.token0Address', token0Address)
        .where('eth_pairs.token1Address', token1Address)
        .where('eth_live.swapAt', '>=', startDate)
        .where('eth_live.swapAt', '<=', endDate)
        .limit(limit)
        .select('eth_live.*', knex.raw('CONCAT(YEAR( eth_live.swapAt ), "-", MONTH( eth_live.swapAt ), "-", DAY( eth_live.swapAt ), " ", HOUR(eth_live.swapAt), ":", MINUTE(eth_live.swapAt), ":", SECOND(eth_live.swapAt)) as SWAPAT'))

    return rows
}

module.exports.mergeLivePairData = async function mergeLivePairData(token0Address, token1Address, startTime, endTime, limit) {
    var datas = []
    var res = []

    var oneData = await getLivePairData(token0Address, token1Address, startTime, endTime, limit)

    for (var j = 0; j < oneData.length; j ++) {
        if (!datas[oneData[j].SWAPAT]) {
            datas[oneData[j].SWAPAT] = []
        }

        datas[oneData[j].SWAPAT].push(oneData[j])
    }

    for (var key in datas) {
        var SWAPAT = key
        var swapAmount0 = 0
        var swapAmount1 = 0

        for (var i = 0; i < datas[key].length; i ++) {
            swapAmount0 += datas[key][i].swapAmount0
            swapAmount1 += datas[key][i].swapAmount1
        }

        res.push({
            SWAPAT: SWAPAT,
            SWAPAMOUNT0: swapAmount0.toFixed(30),
            SWAPAMOUNT1: swapAmount1.toFixed(30),
            PRICE: (swapAmount0 / swapAmount1).toFixed(30)
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

module.exports.getLiveTokenPrice = async function getLiveTokenPrice(tokenAddr, startTime, endTime, limit) {
    var tokenAddress = tokenAddr.toLowerCase()

    for (var i = 0; i < baseTokens.length; i ++) {
        var token0Address = tokenAddress > baseTokens[i] ? baseTokens[i] : tokenAddress
        var token1Address = tokenAddress < baseTokens[i] ? baseTokens[i] : tokenAddress
        var token2Address = USDC_ADDRESS > baseTokens[i] ? baseTokens[i] : USDC_ADDRESS
        var token3Address = USDC_ADDRESS < baseTokens[i] ? baseTokens[i] : USDC_ADDRESS

        var res = await Promise.all([this.mergeLivePairData(token0Address, token1Address, startTime, endTime, limit), this.mergeLivePairData(token2Address, token3Address, startTime, endTime, 100000)])
        var res1 = res[0]
        var res2 = res[1]

        if (res1.length) {
            if (token1Address != tokenAddress) {
                for (var j = 0; j < res1.length; j ++) {
                    res1[j].PRICE = (1.0 / res1[j].PRICE).toFixed(30)
                }
            }
        }

        if (res2.length) {
            if (token2Address != USDC_ADDRESS) {
                for (var j = 0; j < res2.length; j ++) {
                    res2[j].PRICE = 1.0 / res2[j].PRICE
                }
            }
        }

        if (res1.length > 0 && res2.length > 0) {
            var k = 0

            for (var j = res1.length - 1; j >= 0; j --) {
                var jd = (new Date(res1[j].SWAPAT)).getTime()
                
                while (true) {
                    var kd = (new Date(res2[k].SWAPAT)).getTime()

                    if (kd > jd) break

                    k ++

                    if (k >= res2.length) break
                }

                k --

                if (k < 0) k = 0
                
                res1[j].PRICE = (res1[j].PRICE * res2[k].PRICE).toFixed(30)
                res1[j].SWAPAMOUNTINUSD = ((token0Address == baseTokens[i] ? res1[j].SWAPAMOUNT0 : res1[j].SWAPAMOUNT1) * res2[k].PRICE).toFixed(30)
            }
            
            return res1
        }
    }
    
    return []
}

module.exports.getChartPriceData = async function getChartPriceData(tokenAddr, interval, startTime, endTime, limit) {
    if (interval == '1m') {
        return await this.getLiveTokenPrice(tokenAddr, startTime, endTime, limit)
    }
}
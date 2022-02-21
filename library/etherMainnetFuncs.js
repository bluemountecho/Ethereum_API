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
                stats: 'Success!',
                data: {
                    price: price.toFixed(30),
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
                status: 'Fail',
                message: "Can't find swap route!",
                data: {

                }
            }
        } else {
            return {
                stats: "Success!",
                data: {
                    token0: {
                        price: (price1.data.price / price).toFixed(30),
                        symbol: token0Info.tokenSymbol,
                        name: token0Info.tokenName
                    },
                    token1: {
                        price: (price0.data.price * price).toFixed(30),
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
            .where('tokenSymbol', 'like', '%' + tokenName + '%')
            .orWhere('tokenName', 'like', '%' + tokenName + '%')
            .orderByRaw('LOWER(tokenSymbol)="' + tokenName.toLowerCase() + '" desc')
            .orderByRaw('LOWER(tokenName)="' + tokenName.toLowerCase() + '" desc')
            .orderBy('createdAt', 'asc')
            .select('*')
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
            message: 'Getting tokens with name "' + tokenName + '" is completed successfully!',
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
                    sourceCode: rows[0].sourceCode,
                    description: infos.description.en,
                    links: {
                        coingecko: infos.links,
                        etherscan: rows[0].links
                    },
                    image: {
                        coingecko: infos.image,
                        github: 'https://github.com/thefortube/trust-assets/blob/master/blockchains/ethereum/assets/' + Web3.utils.toChecksumAddress(tokenAddr) + '/logo.png?raw=true'
                    },
                    marketCap: (totalSupply * tokenPrice.data.price).toFixed(30),
                    totalSupply: (totalSupply).toFixed(30),
                    totalHolders: rows[0].totalHolders,
                    holders: rows[0].holders,
                    createdAt: rows[0].createdAt
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

module.exports.getPairsFromName = async function getPairsFromName(tokenName) {
    try {
        var rows = await knex('eth_tokens')
            .where('tokenSymbol', 'like', '%' + tokenName + '%')
            .orWhere('tokenName', 'like', '%' + tokenName + '%')
            .orderByRaw('LOWER(tokenSymbol)="' + tokenName.toLowerCase() + '" desc')
            .orderBy('createdAt', 'asc')
            .select('*')
        var datas = []

        for (var i = 0; i < rows.length; i ++) {
            var pairs = await knex('eth_pairs')
                .where('token0Address', rows[i].tokenAddress)
                .orWhere('token1Address', rows[i].tokenAddress)
                .orderBy('blockNumber', 'desc')
                .orderBy('transactionID', 'desc')
                .select('*')
            
            for (var j = 0; j < pairs.length; j ++) {
                var token0Info = await knex('eth_tokens').where('tokenAddress', pairs[j].token0Address).select('*')
                var token1Info = await knex('eth_tokens').where('tokenAddress', pairs[j].token1Address).select('*')

                datas.push({
                    address: pairs[j].pairAddress,
                    token0Address: pairs[j].token0Address,
                    token0Symbol: token0Info[0] ? token0Info[0].tokenSymbol : '',
                    token1Address: pairs[j].token1Address,
                    token1Symbol: token1Info[0] ? token1Info[0].tokenSymbol : '',
                    // factoryAddress: pairs[j].factoryAddress,
                    // lastPrice: pairs[j].lastPrice,
                    // createdAt: pairs[j].createdAt,
                    // baseToken: pairs[j].baseToken
                })
            }
        }

        return {
            status: 'Success',
            message: 'Getting pairs with name "' + tokenName + '" is completed successfully!',
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

module.exports.getPairInfo = async function getPairInfo(pairAddr) {
    try {
        var pairAddress = pairAddr.toLowerCase()
        var rows = await knex('eth_pairs').where('pairAddress', pairAddress).select('*')

        if (rows.length == 0) {
            return {
                status: 'Fail',
                message: 'Pair does not exist!',
                data: []
            }
        } else {
            var token0Info = await this.getTokenInfo(rows[0].token0Address)
            var token1Info = await this.getTokenInfo(rows[0].token1Address)
            var baseToken = rows[0].baseToken == 0 ? rows[0].token0Address : rows[0].token1Address
            var baseDecimals = rows[0].baseToken == 0 ? token0Info.data[0].decimals : token1Info.data[0].decimals
            const contract = new web3.eth.Contract(minERC20ABI, baseToken)
            var res = await contract.methods.balanceOf(rows[0].pairAddress).call()
            var tokenPrice = await this.getPriceOfToken(baseToken)

            res = res / 10 ** baseDecimals
            res = res * tokenPrice.data.price * 2

            return {
                status: 'Success',
                message: 'Getting pair info completed successfully!',
                data: [{
                    address: rows[0].pairAddress,
                    token0Info: token0Info.data[0],
                    token1Info: token1Info.data[0],
                    factoryAddress: rows[0].factoryAddress,
                    lastPrice: (rows[0].lastPrice).toFixed(30),
                    createdAt: rows[0].createdAt,
                    liquidity: res.toFixed(30)
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
        var content = fs.readFileSync('./database/ethereum/transactions/' + pair + '.txt', {encoding:'utf8', flag:'r'})
        var rows = content.split('\n')
        var datas = []

        for (var i = 0; i < rows.length - 1; i ++) {
            datas.push(JSON.parse(rows[i]))
        }

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
            eth_live.pairAddress="' + pair + '"\
        GROUP BY\
            DATE( eth_live.swapAt ) \
        ORDER BY\
            DATE( eth_live.swapAt)'))[0]

        for (var i = 0; i < livePairs.length; i ++) {
            datas.push(livePairs[i])
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

async function mergeDailyPairData(rows) {
    var datas = []
    var res = []

    for (var i = 0; i < rows.length; i ++) {
        var oneData = await getDailyPairData(rows[i].pairAddress)

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

        if (ad < bd) return -1
        if (ad > bd) return 1
        return 0
    })

    return res
}

module.exports.getDailyTokenPrice = async function getDailyTokenPrice(tokenAddr) {
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

        token0Address = USDC_ADDRESS > baseTokens[i] ? baseTokens[i] : USDC_ADDRESS
        token1Address = USDC_ADDRESS < baseTokens[i] ? baseTokens[i] : USDC_ADDRESS

        funcs.push(
            knex('eth_pairs')
                .where('token0Address', token0Address)
                .where('token1Address', token1Address)
                .select('*')
        )

        var rows = await Promise.all(funcs)
        var res1 = await mergeDailyPairData(rows[0])
        var res2 = await mergeDailyPairData(rows[1])

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

            for (var j = 0; j < res1.length; j ++) {
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

            if (j == res1.length) {
                return {
                    status: 'Success!',
                    symbol: tokenInfo[0].tokenSymbol,
                    name: tokenInfo[0].tokenName,
                    data: res1
                }
            }
        }
    }
    
    return {
        status: 'Fail',
        message: "Can't find swap route!",
        data: []
    }
}

module.exports.getDailyPairPrice = async function getDailyPairPrice(pairAddr) {
    try {
        var pairInfo = (await knex('eth_pairs').where('pairAddress', pairAddr).select('*'))[0]
        var datas = await getDailyPairData(pairAddr)

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

async function getLivePairData(token0Address, token1Address) {
    var rows = await knex('eth_live')
        .join('eth_pairs', 'eth_pairs.pairAddress', '=', 'eth_live.pairAddress')
        .where('eth_pairs.token0Address', token0Address)
        .where('eth_pairs.token1Address', token1Address)
        .select('eth_live.*', knex.raw('CONCAT(YEAR( eth_live.swapAt ), "-", MONTH( eth_live.swapAt ), "-", DAY( eth_live.swapAt ), " ", HOUR(eth_live.swapAt), ":", MINUTE(eth_live.swapAt), ":", SECOND(eth_live.swapAt)) as SWAPAT'))

    return rows
}

async function mergeLivePairData(token0Address, token1Address) {
    var datas = []
    var res = []

    var oneData = await getLivePairData(token0Address, token1Address)

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

module.exports.getLiveTokenPrice = async function getLiveTokenPrice(tokenAddr) {
    var tokenAddress = tokenAddr.toLowerCase()
    var tokenInfo = await knex('eth_tokens').where('tokenAddress', tokenAddress).select('*')

    for (var i = 0; i < baseTokens.length; i ++) {
        var funcs = []

        var token0Address = tokenAddress > baseTokens[i] ? baseTokens[i] : tokenAddress
        var token1Address = tokenAddress < baseTokens[i] ? baseTokens[i] : tokenAddress
        var token2Address = USDC_ADDRESS > baseTokens[i] ? baseTokens[i] : USDC_ADDRESS
        var token3Address = USDC_ADDRESS < baseTokens[i] ? baseTokens[i] : USDC_ADDRESS

        var res = await Promise.all([mergeLivePairData(token0Address, token1Address), mergeLivePairData(token2Address, token3Address)])
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

            for (var j = 0; j < res1.length; j ++) {
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
            }

            if (j == res1.length) {
                return {
                    status: 'Success!',
                    symbol: tokenInfo[0].tokenSymbol,
                    name: tokenInfo[0].tokenName,
                    data: res1
                }
            }
        }
    }
    
    return {
        message: "Can't find swap route!",
        data: []
    }
}

module.exports.getLivePairPrice = async function getLivePairPrice(pairAddr) {
    try {
        var pair = pairAddr.toLowerCase()
        var rows = await knex('eth_live').where('pairAddress', pair).orderBy('swapAt', 'asc').select('*')
        var datas = []

        for (var i = 0; i < rows.length; i ++) {
            datas.push({
                SWAPAT: rows[i].swapAt,
                PRICE: (rows[i].swapPrice).toFixed(30),
                SWAPAMOUNT0: (rows[i].swapAmount0).toFixed(30),
                SWAPAMOUNT1: (rows[i].swapAmount1).toFixed(30),
                SWAPMAKER: rows[i].swapMaker,
                SWAPTRANSACTION: rows[i].swapTransactionHash,
                BUYORSELL: rows[i].isBuy ? 'BUY' : 'SELL'
            })
        }

        return {
            status: 'Success!',
            data: datas
        }
    } catch (err) {
        return {
            message: "Can't find swap route!",
            data: []
        }
    }
}

module.exports.getDailyMarketCap = async function getDailyMarketCap(tokenAddr) {
    try {
        var tokenAddress = tokenAddr.toLowerCase()
        var data = (await this.getDailyTokenPrice(tokenAddress)).data
        const contract = new web3.eth.Contract(minERC20ABI, tokenAddress)
        var totalSupply = await contract.methods.totalSupply().call()
        var tokenInfo = (await knex('eth_tokens').where('tokenAddress', tokenAddress).select('*'))[0]
        var res = []

        totalSupply = totalSupply / 10 ** tokenInfo.tokenDecimals

        for (var i = 0; i < data.length; i ++) {
            res.push({
                DATE: data[i].SWAPAT,
                MARKETCAP: (data[i].AVGPRICE * totalSupply).toFixed(30)
            })
        }

        return {
            status: 'Success!',
            data: res
        }
    } catch (err) {
        return {
            status: 'Fail(Server error)',
            message: err,
            data: []
        }
    }
}

module.exports.getHolderInfo = async function() {
}
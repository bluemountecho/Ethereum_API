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

module.exports.getAllTokens = async function getAllTokens(page = 0) {
    try {
        var rows = await knex('eth_tokens').orderBy('createdAt', 'desc').limit(100).offset(page * 100).select('*')
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

module.exports.getAllTokens1 = async function getAllTokens(page = 0) {
    try {
        var rows = await knex('eth_tokens').orderBy('createdAt', 'desc').limit(100).offset(page * 100).select('*')
        var datas = []

        for (var i = 0; i < rows.length; i ++) {
            datas.push({
                address: rows[i].tokenAddress,
                symbol: rows[i].tokenSymbol,
                // name: rows[i].tokenName
            })
        }

        return datas
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

async function getTokenTotalTrnasactions(tokenAddress) {
    var rows = await knex('eth_pairs').where('token0Address', tokenAddress).orWhere('token1Address', tokenAddress).select('*')
    var total = 0

    for (var i = 0; i < rows.length; i ++) {
        try {
            var content = fs.readFileSync('./database/ethereum/transactions/' + rows[i].pairAddress + '.txt', {encoding:'utf8', flag:'r'})
            var datas = content.split('\n')
            
            for (var j = 0; j < datas.length - 1; j ++) {
                datas[j] = JSON.parse(datas[j])
            }

            for (var j = 0; j < datas.length - 1; j ++) {
                total += Number.parseInt(datas[j].SWAPCOUNT)
            }
        } catch (err) {

        }
    }

    return total
}

module.exports.getLast24HourInfos = async function getLast24HourInfos(tokenAddress) {
    var res = (await this.getLiveTokenPrice(tokenAddress, true, -1)).data
    var ret = {}
    var date24ago = new Date().getTime() - 86400 * 1000
    var date12ago = new Date().getTime() - 12 * 3600 * 1000
    var date6ago = new Date().getTime() - 6 * 3600 * 1000
    var date2ago = new Date().getTime() - 2 * 3600 * 1000
    var date1ago = new Date().getTime() - 3600 * 1000
    var date30ago = new Date().getTime() - 1800 * 1000
    var today = convertTimestampToString(new Date().getTime(), true).split(' ')[0] + ' 00:00:00'

    today = new Date(today).getTime()
    ret.totalVolume = 0
    ret.totalTransactions = 0
    ret.todayTransactions = 0
    ret.price30 = ret.price1 = ret.price2 = ret.price6 = ret.price12 = ret.price24 = 0

    for (var i = 0; i < res.length; i ++) {
        var tmpTime = new Date(res[i].SWAPAT).getTime()

        if (tmpTime >= date24ago) {
            ret.totalVolume += Number.parseFloat(res[i].SWAPAMOUNTINUSD)
            ret.totalTransactions ++
        }
        
        if (tmpTime >= today) {
            ret.todayTransactions ++
        }
        
        if (ret.price30 == 0 && new Date(res[i].SWAPAT).getTime() < date30ago) {
            ret.price30 = res[i].PRICE
        }

        if (ret.price1 == 0 && new Date(res[i].SWAPAT).getTime() < date1ago) {
            ret.price1 = res[i].PRICE
        }

        if (ret.price2 == 0 && new Date(res[i].SWAPAT).getTime() < date2ago) {
            ret.price2 = res[i].PRICE
        }

        if (ret.price6 == 0 && new Date(res[i].SWAPAT).getTime() < date6ago) {
            ret.price6 = res[i].PRICE
        }

        if (ret.price12 == 0 && new Date(res[i].SWAPAT).getTime() < date12ago) {
            ret.price12 = res[i].PRICE
        }

        if (ret.price24 == 0 && new Date(res[i].SWAPAT).getTime() < date24ago) {
            ret.price24 = res[i].PRICE
        }
    }

    return ret
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

module.exports.getTokenStatistics = async function getTokenStatistics(tokenAddr) {
    try {
        var tokenAddress = tokenAddr.toLowerCase()
        var rows = await knex('eth_tokens').where('tokenAddress', tokenAddress).select('*')

        var funcs = []

        funcs.push(this.getPriceOfToken(tokenAddress))
        funcs.push(getTokenTotalTrnasactions(tokenAddress))
        funcs.push(this.getLast24HourInfos(tokenAddress))

        var res = await Promise.all(funcs)

        if (rows.length == 0) {
            return {
                status: 'Fail',
                message: 'Token does not exist!',
                data: []
            }
        } else {
            return {
                status: 'Success',
                message: 'Getting token statistics completed successfully!',
                data: [{
                    address: rows[0].tokenAddress,
                    symbol: rows[0].tokenSymbol,
                    name: rows[0].tokenName,
                    totalTransactions: res[1] + res[2].todayTransactions,
                    last24hTransactions: res[2].totalTransactions,
                    last24hVolume: res[2].totalVolume,
                    currentPrice: res[0].data.price,
                    priceChanges: {
                        priceChange30Min: {
                            price: res[2].price30,
                            changePercent: res[2].price30 == 0 ? 0 : -(100 - (res[0].data.price / res[2].price30 * 100)).toFixed(2)
                        },
                        priceChange1Hour: {
                            price: res[2].price1,
                            changePercent: res[2].price1 == 0 ? 0 : -(100 - (res[0].data.price / res[2].price1 * 100)).toFixed(2)
                        },
                        priceChange2Hour: {
                            price: res[2].price2,
                            changePercent: res[2].price2 == 0 ? 0 : -(100 - (res[0].data.price / res[2].price2 * 100)).toFixed(2)
                        },
                        priceChange6Hour: {
                            price: res[2].price6,
                            changePercent: res[2].price6 == 0 ? 0 : -(100 - (res[0].data.price / res[2].price6 * 100)).toFixed(2)
                        },
                        priceChange12Hour: {
                            price: res[2].price12,
                            changePercent: res[2].price12 == 0 ? 0 : -(100 - (res[0].data.price / res[2].price12 * 100)).toFixed(2)
                        },
                        priceChange24Hour: {
                            price: res[2].price24,
                            changePercent: res[2].price24 == 0 ? 0 : -(100 - (res[0].data.price / res[2].price24 * 100)).toFixed(2)
                        },
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

async function getLivePairData(token0Address, token1Address, flag) {
    var rows 

    if (flag) {
        var date = convertTimestampToString(new Date().getTime() - 86400 * 1000, true).split(' ')[0] + ' 00:00:00'

        rows = await knex('eth_live')
            .join('eth_pairs', 'eth_pairs.pairAddress', '=', 'eth_live.pairAddress')
            .where('eth_pairs.token0Address', token0Address)
            .where('eth_pairs.token1Address', token1Address)
            .where('eth_live.swapAt', '>=', date)
            .select('eth_live.*', knex.raw('CONCAT(YEAR( eth_live.swapAt ), "-", MONTH( eth_live.swapAt ), "-", DAY( eth_live.swapAt ), " ", HOUR(eth_live.swapAt), ":", MINUTE(eth_live.swapAt), ":", SECOND(eth_live.swapAt)) as SWAPAT'))
    } else {
        rows = await knex('eth_live')
            .join('eth_pairs', 'eth_pairs.pairAddress', '=', 'eth_live.pairAddress')
            .where('eth_pairs.token0Address', token0Address)
            .where('eth_pairs.token1Address', token1Address)
            .select('eth_live.*', knex.raw('CONCAT(YEAR( eth_live.swapAt ), "-", MONTH( eth_live.swapAt ), "-", DAY( eth_live.swapAt ), " ", HOUR(eth_live.swapAt), ":", MINUTE(eth_live.swapAt), ":", SECOND(eth_live.swapAt)) as SWAPAT'))
    }

    return rows
}

module.exports.mergeLivePairData = async function mergeLivePairData(token0Address, token1Address, flag, page = -1) {
    var datas = []
    var res = []

    var oneData = await getLivePairData(token0Address, token1Address, flag)

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

module.exports.getLiveTokenPrice = async function getLiveTokenPrice(tokenAddr, flag = false, page = 0) {
    var tokenAddress = tokenAddr.toLowerCase()
    var tokenInfo = await knex('eth_tokens').where('tokenAddress', tokenAddress).select('*')

    for (var i = 0; i < baseTokens.length; i ++) {
        var funcs = []

        var token0Address = tokenAddress > baseTokens[i] ? baseTokens[i] : tokenAddress
        var token1Address = tokenAddress < baseTokens[i] ? baseTokens[i] : tokenAddress
        var token2Address = USDC_ADDRESS > baseTokens[i] ? baseTokens[i] : USDC_ADDRESS
        var token3Address = USDC_ADDRESS < baseTokens[i] ? baseTokens[i] : USDC_ADDRESS

        var res = await Promise.all([this.mergeLivePairData(token0Address, token1Address, flag, page), this.mergeLivePairData(token2Address, token3Address, flag)])
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
            
            return {
                status: 'Success!',
                symbol: tokenInfo[0].tokenSymbol,
                name: tokenInfo[0].tokenName,
                data: res1
            }
        }
    }
    
    return {
        message: "Can't find swap route!",
        data: []
    }
}

module.exports.getLivePairPrice = async function getLivePairPrice(pairAddr, page = 0) {
    try {
        var pair = pairAddr.toLowerCase()
        var rows = await knex('eth_live').where('pairAddress', pair).orderBy('swapAt', 'desc').limit(100).offset(page * 100).select('*')
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

module.exports.getDailyMarketCap = async function getDailyMarketCap(tokenAddr, page = 0) {
    try {
        var tokenAddress = tokenAddr.toLowerCase()
        var data = (await this.getDailyTokenPrice(tokenAddress, page)).data
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

module.exports.getContavoInfo = async function getContavoInfo() {
    var rows = await knex('eth_tokens').select('tokenAddress').select('totalHolders').select('holders').select('links')

    return rows
}
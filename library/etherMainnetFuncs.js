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
const Web3 = require('web3')
const config = require('../config')
const minERC20ABI = [
    {
      "constant": true,
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
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
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

var networks = ["eth", "bsc", "polygon", "arbitrum", "optimism", "avalanche", "fantom", "harmony", "cronos", "aurora", "moonbeam", "moonriver", "metis", "heco", "okc", "kcc", "velas", "celo", "xdai", "smartbch", "hsc", "boba", "fuse", "emerald", "kardia", "iotex", "wan", "zyx", "elastos", "polis"]
var web3s = []

for (var i = 0; i < networks.length; i ++) {
    web3s[networks[i]] = new Web3(new Web3.providers.HttpProvider(config[networks[i]].web3Providers[0], options))
}

var fs = require('fs')

function convertTimestampToString(timestamp, flag = false) {
    if (flag == false) {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
    } else {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

module.exports.getPriceOfToken = async function getPriceOfToken(network, tokenAddress) {
    try {
        var tokenInfo = await knex(network + '_tokens').where('tokenAddress', tokenAddress).select('*')
        
        return {
            stats: 'Success!',
            data: {
                price: tokenInfo[0].lastPrice.toFixed(30),
                symbol: tokenInfo[0].tokenSymbol,
                name: tokenInfo[0].tokenName
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

module.exports.getLastPriceFromPair = async function getLastPriceFromPair(network, pairAddress) {
    try {
        var pairInfo = (await knex(network + '_pairs').where('pairAddress', pairAddress).select('*'))[0]
        var token0Address = pairInfo.token0Address
        var token1Address = pairInfo.token1Address
        var price = pairInfo.lastPrice
        var price0 = await this.getPriceOfToken(network, token0Address)
        var price1 = await this.getPriceOfToken(network, token1Address)
        var token0Info = (await knex(network + '_tokens').where('tokenAddress', token0Address).select('*'))[0]
        var token1Info = (await knex(network + '_tokens').where('tokenAddress', token1Address).select('*'))[0]

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

module.exports.getAllTokens = async function getAllTokens(network, page = 0) {
    try {
        var rows = await knex(network + '_tokens').orderBy('createdAt', 'desc').limit(50).offset(page * 50).select('*')
        var datas = []
        var funcs = []

        for (var i = 0; i < rows.length; i ++) {
            funcs.push(this.getTokenStatistics(network, rows[i].tokenAddress))
        }

        var res = await Promise.all(funcs)

        for (var i = 0; i < rows.length; i ++) {
            datas.push({
                address: rows[i].tokenAddress,
                symbol: rows[i].tokenSymbol,
                name: rows[i].tokenName,
                info: res[i].data[0]
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

module.exports.getTokensFromName = async function getTokensFromName(network, tokenName) {
    try {
        var rows = await knex(network + '_tokens')
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

async function getTokenTotalTrnasactions(network, tokenAddress) {
    var rows = await knex(network + '_token_daily').where('TOKENADDRESS', tokenAddress).select('')
    var total = 0

    for (var i = 0; i < rows.length; i ++) {
        total += rows[i].SWAPCOUNT
    }

    return total
}

module.exports.getLast24HourInfos = async function getLast24HourInfos(network, tokenAddress) {
    var res = (await knex(network + '_changes').where('tokenAddress', tokenAddress))[0]
    var ret = {}

    ret.totalVolume = res.volume24h
    ret.totalTransactions = res.trans24h
    ret.todayTransactions = res.transToday
    ret.price5 = res.price5m
    ret.price30 = res.price30m
    ret.price1 = res.price1h
    ret.price2 = res.price2h
    ret.price6 = res.price6h
    ret.price12 = res.price12h
    ret.price24 = res.price24h

    return ret
}

module.exports.getTokenInfo = async function getTokenInfo(network, tokenAddr) {
    try {
        var tokenAddress = tokenAddr.toLowerCase()
        // const contract = new web3s[network].eth.Contract(minERC20ABI, tokenAddress)
        var rows = await knex(network + '_tokens').where('tokenAddress', tokenAddress).select('*')
        // var totalSupply = await contract.methods.totalSupply().call()
        var totalSupply = rows[0].totalSupply
        var tokenPrice = await this.getPriceOfToken(network, tokenAddress)
        var info = (await this.getTokenStatistics(network, tokenAddress)).data[0]

        // totalSupply = totalSupply / 10 ** rows[0].tokenDecimals

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
            
            if (rows[0].coingeckoInfos != '' && rows[0].coingeckoInfos != null) {
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
                    totalTransactions: info.totalTransactions,
                    last24hTransactions: info.last24hTransactions,
                    last24hVolume: info.last24hVolume,
                    currentPrice: info.currentPrice,
                    priceChanges: info.priceChanges,
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
                        // github: 'https://github.com/thefortube/trust-assets/blob/master/blockchains/ethereum/assets/' + Web3.utils.toChecksumAddress(tokenAddr) + '/logo.png?raw=true'
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

module.exports.getTokenStatistics = async function getTokenStatistics(network, tokenAddr) {
    try {
        var tokenAddress = tokenAddr.toLowerCase()
        var rows = await knex(network + '_tokens').where('tokenAddress', tokenAddress).select('*')

        var funcs = []

        funcs.push(this.getPriceOfToken(network, tokenAddress))
        funcs.push(getTokenTotalTrnasactions(network, tokenAddress))
        funcs.push(this.getLast24HourInfos(network, tokenAddress))

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
                    // address: rows[0].tokenAddress,
                    // symbol: rows[0].tokenSymbol,
                    // name: rows[0].tokenName,
                    totalTransactions: res[1] + res[2].todayTransactions,
                    last24hTransactions: res[2].totalTransactions,
                    last24hVolume: res[2].totalVolume,
                    currentPrice: res[0].data.price,
                    priceChanges: {
                        priceChange5Min: {
                            price: res[2].price5,
                            changePercent: res[2].price5 == 0 ? 0 : -(100 - (res[0].data.price / res[2].price5 * 100)).toFixed(2)
                        },
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

module.exports.getPairsFromName = async function getPairsFromName(network, tokenName) {
    try {
        var rows = await knex(network + '_tokens')
            .where('tokenSymbol', 'like', '%' + tokenName + '%')
            .orWhere('tokenName', 'like', '%' + tokenName + '%')
            .orderByRaw('LOWER(tokenSymbol)="' + tokenName.toLowerCase() + '" desc')
            .orderBy('createdAt', 'asc')
            .select('*')
        var datas = []

        for (var i = 0; i < rows.length; i ++) {
            var pairs = await knex(network + '_pairs')
                .where('token0Address', rows[i].tokenAddress)
                .orWhere('token1Address', rows[i].tokenAddress)
                .orderBy('createdAt', "desc")
                .select('*')
            
            for (var j = 0; j < pairs.length; j ++) {
                var token0Info = await knex(network + '_tokens').where('tokenAddress', pairs[j].token0Address).select('*')
                var token1Info = await knex(network + '_tokens').where('tokenAddress', pairs[j].token1Address).select('*')

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
        var rows = await knex(network + '_pairs').where('pairAddress', pairAddress).select('*')

        if (rows.length == 0) {
            return {
                status: 'Fail',
                message: 'Pair does not exist!',
                data: []
            }
        } else {
            var token0Info = await this.getTokenInfo(network, rows[0].token0Address)
            var token1Info = await this.getTokenInfo(network, rows[0].token1Address)
            var baseToken = rows[0].baseToken == 0 ? rows[0].token0Address : rows[0].token1Address
            var baseDecimals = rows[0].baseToken == 0 ? token0Info.data[0].decimals : token1Info.data[0].decimals
            const contract = new web3s[network].eth.Contract(minERC20ABI, baseToken)
            var res = await contract.methods.balanceOf(rows[0].pairAddress).call()
            var tokenPrice = await this.getPriceOfToken(network, baseToken)

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

// async function getDailyPairData(network, pairAddr) {
//     try {
//         var pair = pairAddr.toLowerCase()
//         var datas = []
//         var content = fs.readFileSync('./database/ethereum/transactions/' + pair + '.txt', {encoding:'utf8', flag:'r'})
//         var rows = content.split('\n')

//         for (var i = 0; i < rows.length - 1; i ++) {
//             datas.push(JSON.parse(rows[i]))
//         }

//         for (var i = 0; i < datas.length; i ++) {
//             datas[i].AVGPRICE = datas[i].TOTALVOLUME0 / datas[i].TOTALVOLUME1
//         }

//         return datas
//     } catch (err) {
//         console.log(err)
//         return []
//     }
// }

// async function mergeDailyPairData(network, rows, token0Address, token1Address, page = -1) {
//     var datas = []
//     var res = []
//     var funcs = []

//     for (var i = 0; i < rows.length; i ++) {
//         funcs.push(getDailyPairData(network, rows[i].pairAddress))
//     }

//     funcs.push(knex.raw('\
//     SELECT\
//         eth_live.pairAddress AS PAIRADDRESS,\
//         CONCAT(YEAR( eth_live.swapAt ), "-", MONTH( eth_live.swapAt ), "-", DAY( eth_live.swapAt )) AS SWAPAT,\
//         avg( eth_live.swapPrice ) AS AVGPRICE,\
//         max( eth_live.swapPrice ) AS MAXPRICE,\
//         min( eth_live.swapPrice ) AS MINPRICE,\
//         sum( eth_live.swapAmount0 * ( eth_pairs.baseToken * 2 - 1 ) * ( eth_live.isBuy * - 2 + 1 ) ) AS VOLUME0,\
//         sum( eth_live.swapAmount1 * ( eth_pairs.baseToken * - 2 + 1 ) * ( eth_live.isBuy * - 2 + 1 ) ) AS VOLUME1,\
//         sum( eth_live.swapAmount0 ) AS TOTALVOLUME0,\
//         sum( eth_live.swapAmount1 ) AS TOTALVOLUME1,\
//         count( eth_live.swapMaker ) AS SWAPCOUNT \
//     FROM\
//         eth_live\
//         LEFT JOIN eth_pairs ON eth_pairs.pairAddress = eth_live.pairAddress \
//     WHERE\
//         eth_pairs.token0Address="' + token0Address + '" and eth_pairs.token1Address="' + token1Address + '" and DATE( eth_live.swapAt )="' + convertTimestampToString(new Date().getTime(), true).split(' ')[0] + '"\
//     GROUP BY\
//         DATE( eth_live.swapAt ) \
//     ORDER BY\
//         DATE( eth_live.swapAt)'))

//     var oneDatas = await Promise.all(funcs)

//     for (var i = 0; i < rows.length; i ++) {
//         for (var j = 0; j < oneDatas[i].length; j ++) {
//             if (!datas[oneDatas[i][j].SWAPAT]) {
//                 datas[oneDatas[i][j].SWAPAT] = []
//             }

//             datas[oneDatas[i][j].SWAPAT].push(oneDatas[i][j])
//         }
//     }
    
//     var livePairs = oneDatas[rows.length][0]

//     for (var i = 0; i < livePairs.length; i ++) {
//         if (!datas[livePairs[i].SWAPAT]) {
//             datas[livePairs[i].SWAPAT] = []
//         }

//         datas[livePairs[i].SWAPAT].push(livePairs[i])
//     }

//     for (var key in datas) {
//         var swapAt = key
//         var totalVolume0 = 0
//         var totalVolume1 = 0
//         var volume0 = 0
//         var volume1 = 0
//         var minPrice = 1000000000000000
//         var maxPrice = 0

//         for (var i = 0; i < datas[key].length; i ++) {
//             totalVolume0 += datas[key][i].TOTALVOLUME0
//             totalVolume1 += datas[key][i].TOTALVOLUME1
//             volume0 += datas[key][i].VOLUME0
//             volume1 += datas[key][i].VOLUME1

//             if (minPrice > datas[key][i].MINPRICE && datas[key][i].MINPRICE) minPrice = datas[key][i].MINPRICE
//             if (maxPrice < datas[key][i].MAXPRICE && datas[key][i].MAXPRICE) maxPrice = datas[key][i].MAXPRICE
//         }

//         res.push({
//             SWAPAT: swapAt,
//             TOTALVOLUME0: totalVolume0.toFixed(30),
//             TOTALVOLUME1: totalVolume1.toFixed(30),
//             VOLUME0: volume0.toFixed(30),
//             VOLUME1: volume1.toFixed(30),
//             LOWPRICE: minPrice.toFixed(30),
//             HIGHPRICE: maxPrice.toFixed(30),
//             AVGPRICE: (totalVolume0 / totalVolume1).toFixed(30)
//         })
//     }

//     res.sort(function (a, b) {
//         var ad = (new Date(a.SWAPAT)).getTime()
//         var bd = (new Date(b.SWAPAT)).getTime()

//         if (ad > bd) return -1
//         if (ad < bd) return 1
//         return 0
//     })

//     if (page >= 0) {
//         var pageData = []

//         for (var i = page * 100; i < page * 100 + 100 && i < res.length; i ++) {
//             pageData.push(res[i])
//         }

//         return pageData
//     }

//     return res
// }

module.exports.getDailyTokenPrice = async function getDailyTokenPrice(network, tokenAddr, page = 0) {
    try {
        var tokenAddress = tokenAddr.toLowerCase()
        var tokenInfo = await knex(network + '_tokens').where('tokenAddress', tokenAddress).select('*')
        // var rows = await knex('eth_token_daily').where('TOKENADDRESS', tokenAddress).orderBy('SWAPAT', 'asc').limit(0 * page, 100).select(knex.raw('DATE(SWAPAT) as swapAt, AVGPRICE, MAXPRICE as HIGHPRICE, MINPRICE as LOWPRICE, VOLUME, SWAPCOUNT'))
        var rows = await knex(network + '_token_daily').where('TOKENADDRESS', tokenAddress).orderBy('SWAPAT', 'desc').limit(100).offset(100 * page).select('*')
        var data = []

        for (var i = 0; i < rows.length; i ++) {
            data.push({
                SWAPAT: convertTimestampToString(new Date(rows[i].SWAPAT).getTime(), true).split(' ')[0],
                AVGPRICE: rows[i].AVGPRICE.toFixed(30),
                HIGHPRICE: rows[i].MAXPRICE.toFixed(30),
                LOWPRICE: rows[i].MINPRICE.toFixed(30),
                VOLUME: rows[i].VOLUME.toFixed(5),
                SWAPCOUNT: rows[i].SWAPCOUNT,
            })
        }

        return {
            status: 'Success!',
            symbol: tokenInfo[0].tokenSymbol,
            name: tokenInfo[0].tokenName,
            data: data
        }
    } catch (err) {
        return {
            status: 'Fail',
            message: "Server Error!",
            data: []
        }
    }
}

module.exports.getDailyPairPrice = async function getDailyPairPrice(network, pairAddr, page = 0) {
    try {
        pairAddr = pairAddr.toLowerCase()
        
        var datas = await getDailyPairData(pairAddr)

        var livePairs = (await knex.raw('\
        SELECT\
            ' + network + '_live.pairAddress AS PAIRADDRESS,\
            CONCAT(YEAR( ' + network + '_live.swapAt ), "-", MONTH( ' + network + '_live.swapAt ), "-", DAY( ' + network + '_live.swapAt )) AS SWAPAT,\
            avg( ' + network + '_live.swapPrice ) AS AVGPRICE,\
            max( ' + network + '_live.swapPrice ) AS MAXPRICE,\
            min( ' + network + '_live.swapPrice ) AS MINPRICE,\
            sum( ' + network + '_live.swapAmount0 * ( ' + network + '_pairs.baseToken * 2 - 1 ) * ( ' + network + '_live.isBuy * - 2 + 1 ) ) AS VOLUME0,\
            sum( ' + network + '_live.swapAmount1 * ( ' + network + '_pairs.baseToken * - 2 + 1 ) * ( ' + network + '_live.isBuy * - 2 + 1 ) ) AS VOLUME1,\
            sum( ' + network + '_live.swapAmount0 ) AS TOTALVOLUME0,\
            sum( ' + network + '_live.swapAmount1 ) AS TOTALVOLUME1,\
            count( ' + network + '_live.swapMaker ) AS SWAPCOUNT \
        FROM\
            ' + network + '_live\
            LEFT JOIN ' + network + '_pairs ON ' + network + '_pairs.pairAddress = ' + network + '_live.pairAddress \
        WHERE\
            ' + network + '_live.pairAddress="' + pairAddr + '" and DATE( ' + network + '_live.swapAt )="' + convertTimestampToString(new Date().getTime(), true).split(' ')[0] + '"\
        GROUP BY\
            DATE( ' + network + '_live.swapAt ) \
        ORDER BY\
            DATE( ' + network + '_live.swapAt)'))[0]

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

async function getLivePairData(network, token0Address, token1Address, flag) {
    var rows 

    if (flag) {
        var date = convertTimestampToString(new Date().getTime() - 86400 * 1000, true).split(' ')[0] + ' 00:00:00'

        rows = await knex(network + '_live')
            .join(network + '_pairs', network + '_pairs.pairAddress', '=', network + '_live.pairAddress')
            .where(network + '_pairs.token0Address', token0Address)
            .where(network + '_pairs.token1Address', token1Address)
            .where(network + '_live.swapAt', '>=', date)
            .select(network + '_live.*', knex.raw('CONCAT(YEAR( ' + network + '_live.swapAt ), "-", MONTH( ' + network + '_live.swapAt ), "-", DAY( ' + network + '_live.swapAt ), " ", HOUR(' + network + '_live.swapAt), ":", MINUTE(' + network + '_live.swapAt), ":", SECOND(' + network + '_live.swapAt)) as SWAPAT'))
    } else {
        rows = await knex(network + '_live')
            .join(network + '_pairs', network + '_pairs.pairAddress', '=', network + '_live.pairAddress')
            .where(network + '_pairs.token0Address', token0Address)
            .where(network + '_pairs.token1Address', token1Address)
            .select(network + '_live.*', knex.raw('CONCAT(YEAR( ' + network + '_live.swapAt ), "-", MONTH( ' + network + '_live.swapAt ), "-", DAY( ' + network + '_live.swapAt ), " ", HOUR(' + network + '_live.swapAt), ":", MINUTE(' + network + '_live.swapAt), ":", SECOND(' + network + '_live.swapAt)) as SWAPAT'))
    }

    return rows
}

module.exports.mergeLivePairData = async function mergeLivePairData(network, token0Address, token1Address, flag, page = -1) {
    var datas = []
    var res = []

    var oneData = await getLivePairData(network, token0Address, token1Address, flag)

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

module.exports.getLiveTokenPrice = async function getLiveTokenPrice(network, tokenAddr, flag = false, page = 0) {
    try {
        var tokenAddress = tokenAddr.toLowerCase()
        var tokenInfo = await knex(network + '_tokens').where('tokenAddress', tokenAddress).select('*')
        // var rows = await knex('eth_token_daily').where('TOKENADDRESS', tokenAddress).orderBy('SWAPAT', 'asc').limit(0 * page, 100).select(knex.raw('DATE(SWAPAT) as swapAt, AVGPRICE, MAXPRICE as HIGHPRICE, MINPRICE as LOWPRICE, VOLUME, SWAPCOUNT'))
        var rows

        if (page == -1) {
            rows = await knex(network + '_live').where('tokenAddress', tokenAddress).orderBy('swapAt', 'desc').select('*')
        } else {
            rows = await knex(network + '_live').where('tokenAddress', tokenAddress).orderBy('swapAt', 'desc').limit(100).offset(100 * page).select('*')
        }
        
        var data = []
        var pairs = []

        for (var i = 0; i < rows.length; i ++) {
            if (!pairs[rows[i].pairAddress]) {
                pairs[rows[i].pairAddress] = (await knex(network + '_pairs').where('pairAddress', rows[i].pairAddress).select('*'))[0]
            }

            var swapAmount = pairs[rows[i].pairAddress].token0Address == rows[i].tokenAddress ? rows[i].swapAmount0 : rows[i].swapAmount1

            data.push({
                SWAPAT: convertTimestampToString(new Date(rows[i].swapAt).getTime(), true),
                PAIRADDRESS: rows[i].pairAddress,
                PRICE: rows[i].priceUSD.toFixed(30),
                SWAPAMOUNTINUSD: (swapAmount * rows[i].priceUSD).toFixed(30),
                SWAPAMOUNT0: rows[i].swapAmount0.toFixed(30),
                SWAPAMOUNT1: rows[i].swapAmount1.toFixed(30),
                SWAPMAKER: rows[i].swapMaker,
                SWAPTRANSACTION: rows[i].swapTransactionHash,
                BUYORSELL: rows[i].isBuy ? 'BUY' : 'SELL'
            })
        }

        return {
            status: 'Success!',
            symbol: tokenInfo[0].tokenSymbol,
            name: tokenInfo[0].tokenName,
            data: data
        }
    } catch (err) {
        return {
            status: 'Fail',
            message: "Server Error!",
            data: []
        }
    }
}

module.exports.getLivePairPrice = async function getLivePairPrice(network, pairAddr, page = 0) {
    try {
        var pair = pairAddr.toLowerCase()
        var rows = await knex(network + '_live').where('pairAddress', pair).orderBy('swapAt', 'desc').limit(100).offset(page * 100).select('*')
        var datas = []

        for (var i = 0; i < rows.length; i ++) {
            datas.push({
                SWAPAT: convertTimestampToString(new Date(rows[i].swapAt).getTime(), true),
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

module.exports.getDailyMarketCap = async function getDailyMarketCap(network, tokenAddr, page = 0) {
    try {
        var tokenAddress = tokenAddr.toLowerCase()
        var data = (await this.getDailyTokenPrice(network, tokenAddress, page)).data
        const contract = new web3s[network].eth.Contract(minERC20ABI, tokenAddress)
        var totalSupply = await contract.methods.totalSupply().call()
        var tokenInfo = (await knex(network + '_tokens').where('tokenAddress', tokenAddress).select('*'))[0]
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
    var rows = await knex(network + '_tokens').select('tokenAddress').select('totalHolders').select('holders').select('links')

    return rows
}

module.exports.getAllCoinsList = async function getAllCoinsList(page = 0, order = 'marketcap') {
    // var geckoCoins = await knex('main_coin_list').where('coinImage', '!=', '').orderBy('coinImage').select('*')
    // var otherCoins = await knex('main_coin_list').where('coinImage', '').orderBy('coinSymbol').select('*')
    var otherCoins = await knex('main_coin_list').orderBy('coinSymbol').select('*')
    var datas = []

    // var bef = ''
    // var tmpdata = null
    // var tmpvolume = 0

    // for (var i = 0; i < geckoCoins.length; i ++) {
    //     if (geckoCoins[i].volume24h < 0) continue
    //     if (geckoCoins[i].pricenow >= 100000) continue
    //     if (geckoCoins[i].pricenow <= 0.0000000000000001) continue
    //     if (geckoCoins[i].coinSymbol == '') continue

    //     if (bef != geckoCoins[i].coinImage) {
    //         if (tmpdata != null) {
    //             datas.push(tmpdata)
    //         }

    //         tmpdata = {
    //             price24h: geckoCoins[i].price24h,
    //             price6h: geckoCoins[i].price6h,
    //             price2h: geckoCoins[i].price2h,
    //             price1h: geckoCoins[i].price1h,
    //             price30m: geckoCoins[i].price30m,
    //             price5m: geckoCoins[i].price5m,
    //             pricenow: geckoCoins[i].pricenow,
    //             volume24h: geckoCoins[i].volume24h,
    //             trans24h: geckoCoins[i].trans24h,
    //             marketcap: geckoCoins[i].marketcap,
    //             coinSymbol: geckoCoins[i].coinSymbol,
    //             coinName: geckoCoins[i].coinName,
    //             coinImage: geckoCoins[i].coinImage,
    //         }

    //         bef = geckoCoins[i].coinImage
    //         tmpvolume = geckoCoins[i].volume24h
    //     } else {
    //         if (tmpvolume < geckoCoins[i].volume24h) {
    //             tmpdata.price24h = geckoCoins[i].price24h
    //             tmpdata.price6h = geckoCoins[i].price6h
    //             tmpdata.price2h = geckoCoins[i].price2h
    //             tmpdata.price1h = geckoCoins[i].price1h
    //             tmpdata.price30m = geckoCoins[i].price30m
    //             tmpdata.price5m = geckoCoins[i].price5m
    //             tmpdata.pricenow = geckoCoins[i].pricenow
                
    //             tmpdata.coinSymbol = geckoCoins[i].coinSymbol                
    //             tmpdata.coinName = geckoCoins[i].coinName                
    //             tmpdata.coinImage = geckoCoins[i].coinImage

    //             tmpvolume = geckoCoins[i].volume24h
    //         }

    //         tmpdata.volume24h += geckoCoins[i].volume24h
    //         tmpdata.trans24h += geckoCoins[i].trans24h

    //         if (geckoCoins[i].coinImage != 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880')
    //             tmpdata.marketcap += geckoCoins[i].marketcap
    //     }
    // }

    var bef = ''
    var tmpdata = null
    var tmpvolume = 0
    var isMain = false

    for (var i = 0; i < otherCoins.length; i ++) {
        try {
            if (otherCoins[i].volume24h < 10000) continue
            if (otherCoins[i].pricenow >= 100000) continue
            if (otherCoins[i].pricenow <= 0.0000000000000001) continue
            if (otherCoins[i].coinSymbol == '') continue

            if (bef != otherCoins[i].coinSymbol.toLowerCase().replace(/ /, '')) {
                if (tmpdata != null) {
                    datas.push(tmpdata)
                }

                tmpdata = {
                    price24h: otherCoins[i].price24h,
                    price6h: otherCoins[i].price6h,
                    price2h: otherCoins[i].price2h,
                    price1h: otherCoins[i].price1h,
                    price30m: otherCoins[i].price30m,
                    price5m: otherCoins[i].price5m,
                    pricenow: otherCoins[i].pricenow,
                    volume24h: otherCoins[i].volume24h,
                    trans24h: otherCoins[i].trans24h,
                    marketcap: otherCoins[i].marketcap,
                    coinSymbol: otherCoins[i].coinSymbol,
                    coinName: otherCoins[i].coinName,
                    coinImage: otherCoins[i].localImage,
                }

                if (otherCoins[i].network == 'main') {
                    isMain = true
                } else {
                    isMain = false
                }

                bef = otherCoins[i].coinSymbol.toLowerCase().replace(/ /, '')
                tmpvolume = otherCoins[i].volume24h
            } else {
                if (tmpvolume < otherCoins[i].volume24h) {
                    tmpdata.price24h = otherCoins[i].price24h
                    tmpdata.price6h = otherCoins[i].price6h
                    tmpdata.price2h = otherCoins[i].price2h
                    tmpdata.price1h = otherCoins[i].price1h
                    tmpdata.price30m = otherCoins[i].price30m
                    tmpdata.price5m = otherCoins[i].price5m
                    tmpdata.pricenow = otherCoins[i].pricenow
                    
                    tmpdata.coinSymbol = otherCoins[i].coinSymbol                
                    tmpdata.coinName = otherCoins[i].coinName

                    if (otherCoins[i].localImage != '')
                        tmpdata.coinImage = otherCoins[i].localImage

                    tmpvolume = otherCoins[i].volume24h
                }

                tmpdata.volume24h += otherCoins[i].volume24h
                tmpdata.trans24h += otherCoins[i].trans24h

                if (otherCoins[i].network == 'main') {
                    tmpdata.marketcap = otherCoins[i].marketcap
                    isMain = true
                } else if (isMain == false) {
                    tmpdata.marketcap += otherCoins[i].marketcap
                }
            }
        } catch (err) {
        }        
    }

    datas.push(tmpdata)

    for (var i = 0; i < datas.length; i ++) {
        if (datas[i].marketcap > datas[i].trans24h * 10) {
            datas[i].marketcap = Math.floor(datas[i].trans24h * (9 + Math.random()))
        }
    }

    if (order == 'volume') {
        datas.sort(function (a, b) {
            if (a.volume24h > b.volume24h) return -1
            if (a.volume24h < b.volume24h) return 1
            return 0
        })
    } else if (order == 'marketcap') {        
        datas.sort(function (a, b) {
            if (a.trans24h >= 1000 && b.trans24h < 1000) return -1
            if (a.trans24h < 1000 && b.trans24h >= 1000) return 1
            if (a.marketcap / a.volume24h < 10000 && b.marketcap / b.volume24h >= 10000) return -1
            if (a.marketcap / a.volume24h >= 10000 && b.marketcap / b.volume24h < 10000) return 1
            if (a.marketcap / 1000.0 * a.trans24h / 1000.0 * a.volume24h / 1000.0 > b.marketcap / 1000.0 * b.trans24h / 1000.0 * b.volume24h / 1000.0) return -1
            if (a.marketcap / 1000.0 * a.trans24h / 1000.0 * a.volume24h / 1000.0 < b.marketcap / 1000.0 * b.trans24h / 1000.0 * b.volume24h / 1000.0) return 1
            // if (a.marketcap > b.marketcap) return -1
            // if (a.marketcap < b.marketcap) return 1
            return 0
        })
    }

    var res = []

    for (var i = 0; i < 100 && i + page * 100 < datas.length; i ++) {
        res.push(datas[i + page * 100])
    }

    return res
}

module.exports.getAllChangeTokens = async function getAllChangeTokens(network) {
    var changesTableName = network + '_changes'
    var data = []
    var rows = await knex(changesTableName).select('*')

    for (var i = 0; i < rows.length; i ++) {
        data.push(rows[i].tokenAddress)
    }

    return data
}

module.exports.getAllCoinsInfo = async function getAllCoinsInfo() {
    var rows = await knex('main_coin_list')
        .select(knex.raw('count(tokenAddress) as total_coins, sum(trans24h) as total_transactions, sum(volume24h) as total_volume, sum(marketcap) as total_marketcap'))
        .whereRaw('volume24h / trans24h <= 100000')
        .where('volume24h', '>', '0')
        .where('marketcap', '<', '1000000000000')

    rows[0].total_networks = config.networks.length

    return rows[0]
}
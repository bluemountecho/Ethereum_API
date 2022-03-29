var fs = require('fs')
var path = require('path')
const process = require('process')
const config = require('../../config')
const chainName = process.argv[2]
const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream(chainName + ".txt"),
  stderr: fs.createWriteStream(chainName + ".txt"),
});
const utf8 = require('utf8')
const tokensTableName = chainName + '_tokens'
const pairsTableName = chainName + '_pairs'
const dailyPastTableName = chainName + '_daily'
const liveTableName = chainName + '_live'
const tokenDailyTableName = chainName + '_token_daily'
const tokenLiveTableName = chainName + '_token_live'
const proxyCnt = config[chainName].PROXYCOUNT
const Web3 = require('web3')

var web3s = []

if (config[chainName].endPointType == 1) {
    for (var ii = 0; ii < proxyCnt; ii ++) {
        web3s.push(new Web3(new Web3.providers.HttpProvider(config[chainName].web3Providers[0], {
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
            agent: {
                // httpsAgent: new HttpsProxyAgent('https://' + config.PROXY[ii]),
                baseUrl: 'http://' + config.PROXY[ii]
            }
            // agent: {
            //     // http: new HttpsProxyAgent('http://' + config.PROXY[ii]),
            //     http: http.Agent('http://' + config.PROXY[ii]),
            //     baseUrl: 'http://' + config.PROXY[ii]
            // }
        })))
    }
} else {
    for (var ii = 0; ii < proxyCnt; ii ++) {
        web3s.push(new Web3(new Web3.providers.HttpProvider(config[chainName].web3Providers[ii], {
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
            agent: {
                // httpsAgent: new HttpsProxyAgent('https://' + config.PROXY[ii]),
                baseUrl: 'http://' + config.PROXY[ii]
            }
            // agent: {
            //     // http: new HttpsProxyAgent('http://' + config.PROXY[ii]),
            //     http: http.Agent('http://' + config.PROXY[ii]),
            //     baseUrl: 'http://' + config.PROXY[ii]
            // }
        })))
    }
}

const minERC20ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
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
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]

const minDSTokenABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
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
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]

const minPairABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "token0",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "token1",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]

const options = {
    // Enable auto reconnection
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
};

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

function hexToBn(hex) {
    if (hex.length % 2) {
        hex = '0' + hex;
    }
  
    var highbyte = parseInt(hex.slice(0, 2), 16)
    var bn = BigInt('0x' + hex);
  
    if (0x80 & highbyte) {
        // bn = ~bn; WRONG in JS (would work in other languages)
    
        // manually perform two's compliment (flip bits, add one)
        // (because JS binary operators are incorrect for negatives)
        bn = BigInt('0b' + bn.toString(2).split('').map(function (i) {
            return '0' === i ? 1 : 0
        }).join('')) + BigInt(1);
        // add the sign character to output string (bytes are unaffected)
        bn = -bn;
    }
  
    return bn;
}

function convertTimestampToString(timestamp, flag = false) {
    if (flag == false) {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
    } else {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

var tokensData = []
var pairsData = []
var blocksData = []
var lastBlockNumber = config[chainName].lastBlockNumber

async function getTokenAndPairData() {
    var res = await knex(tokensTableName).select('*')

    myLogger.log(res.length)

    for (var i = 0; i < res.length; i ++) {
        tokensData[res[i].tokenAddress] = {
            tokenDecimals: res[i].tokenDecimals,
            tokenSymbol: res[i].tokenSymbol,
            tokenName: res[i].tokenName,
            lastPrice: res[i].lastPrice,
            createdAt: convertTimestampToString(res[i].createdAt, true),
        }
    }

    res = await knex(pairsTableName).select('*')

    myLogger.log(res.length)

    for (var i = 0; i < res.length; i ++) {
        pairsData[res[i].pairAddress] = {
            token0Address: res[i].token0Address,
            token1Address: res[i].token1Address,
            decimals: res[i].decimals,
            baseToken: res[i].baseToken,
            lastPrice: res[i].lastPrice,
        }
    }
}

async function getTokenInfos(tokenAddress, web3) {
    try {
        const contract = new web3.eth.Contract(minERC20ABI, tokenAddress)
        var decimals, symbol, name

        [decimals, symbol, name] = await Promise.all([
            contract.methods.decimals().call(),
            contract.methods.symbol().call(),
            contract.methods.name().call()
        ])
    
        return [decimals, symbol, name]
    } catch (err) {
        const contract = new web3.eth.Contract(minDSTokenABI, tokenAddress)
        var decimals, symbol, name

        [decimals, symbol, name] = await Promise.all([
            contract.methods.decimals().call(),
            contract.methods.symbol().call(),
            contract.methods.name().call()
        ])

        symbol = web3.utils.hexToUtf8(symbol)
        name = web3.utils.hexToUtf8(name)
    
        return [decimals, symbol, name]
    }    
}

async function getPairDecimals(pairAddress, createdAt, web3) {
    if (pairsData[pairAddress]) {
        return [pairsData[pairAddress].decimals, pairsData[pairAddress].token0Address, pairsData[pairAddress].token1Address]
    }

    var pairContract = new web3.eth.Contract(minPairABI, pairAddress)
    var token0Address, token1Address
    var res = []

    try {
        [token0Address, token1Address] = await Promise.all([pairContract.methods.token0().call(), pairContract.methods.token1().call()])

        token0Address = token0Address.toLowerCase()
        token1Address = token1Address.toLowerCase()

        if (tokensData[token0Address]) {
            res[0] = []
            res[0][0] = tokensData[token0Address].tokenDecimals
            res[0][1] = tokensData[token0Address].tokenSymbol
            res[0][2] = tokensData[token0Address].tokenName
        } else {
            res[0] = await getTokenInfos(token0Address, web3)

            tokensData[token0Address] = {
                tokenDecimals: res[0][0],
                tokenSymbol: res[0][1],
                tokenName: res[0][2],
                lastPrice: 0,
                createdAt: createdAt
            }

            await knex(tokensTableName).insert({
                tokenAddress: token0Address,
                tokenDecimals: res[0][0],
                tokenSymbol: utf8.encode(res[0][1]),
                tokenName: utf8.encode(res[0][2]),
                createdAt: createdAt
            })
        }

        if (tokensData[token1Address]) {
            res[1] = []
            res[1][0] = tokensData[token1Address].tokenDecimals
            res[1][1] = tokensData[token1Address].tokenSymbol
            res[1][2] = tokensData[token1Address].tokenName
        } else {
            res[1] = await getTokenInfos(token1Address, web3)

            tokensData[token1Address] = {
                tokenDecimals: res[1][0],
                tokenSymbol: res[1][1],
                tokenName: res[1][2],
                lastPrice: 0,
                createdAt: createdAt,
            }

            await knex(tokensTableName).insert({
                tokenAddress: token1Address,
                tokenDecimals: res[1][0],
                tokenSymbol: utf8.encode(res[1][1]),
                tokenName: utf8.encode(res[1][2]),
                createdAt: createdAt
            })
        }

        return [res[1][0] - res[0][0], token0Address, token1Address]
    } catch (err) {
        myLogger.log(pairAddress, token0Address, token1Address)
        myLogger.log(err)
    }

    return 1
}

async function writeTransactionHistoryFile(deleteDate, writeDate) {
    // var path = "../../database/ethereum"

    var rows = (await knex.raw('\
        SELECT\
            ' + liveTableName + '.pairAddress AS PAIRADDRESS,\
            CONCAT(YEAR( ' + liveTableName + '.swapAt ), "-", MONTH( ' + liveTableName + '.swapAt ), "-", DAY( ' + liveTableName + '.swapAt )) AS SWAPAT,\
            avg( ' + liveTableName + '.swapPrice ) AS AVGPRICE,\
            max( ' + liveTableName + '.swapPrice ) AS MAXPRICE,\
            min( ' + liveTableName + '.swapPrice ) AS MINPRICE,\
            sum( ' + liveTableName + '.swapAmount0 * ( ' + pairsTableName + '.baseToken * 2 - 1 ) * ( ' + liveTableName + '.isBuy * - 2 + 1 ) ) AS VOLUME0,\
            sum( ' + liveTableName + '.swapAmount1 * ( ' + pairsTableName + '.baseToken * - 2 + 1 ) * ( ' + liveTableName + '.isBuy * - 2 + 1 ) ) AS VOLUME1,\
            sum( ' + liveTableName + '.swapAmount0 ) AS TOTALVOLUME0,\
            sum( ' + liveTableName + '.swapAmount1 ) AS TOTALVOLUME1,\
            count( ' + liveTableName + '.swapMaker ) AS SWAPCOUNT \
        FROM\
            ' + liveTableName + '\
            LEFT JOIN ' + pairsTableName + ' ON ' + pairsTableName + '.pairAddress = ' + liveTableName + '.pairAddress \
        WHERE\
            DATE(' + liveTableName + '.swapAt)="' + writeDate + '"\
        GROUP BY\
            ' + liveTableName + '.pairAddress,\
            DATE( ' + liveTableName + '.swapAt ) \
        ORDER BY\
            DATE( ' + liveTableName + '.swapAt)'))[0]

    for (var i = 0; i < rows.length; i ++) {
        await knex(dailyPastTableName).insert(rows[i])
    }

    await knex(liveTableName).where('swapAt', '<', deleteDate + ' ' + '00:00:00').delete()

    var ethData = []

    async function calcDailyPrice(outToken, baseToken, date) {
        var data = []
        var token0Address = baseToken
        var token1Address = outToken

        if (token0Address > token1Address) {
            token0Address = outToken
            token1Address = baseToken
        }

        var dailyPast = await knex(dailyPastTableName)
            .join(pairsTableName, pairsTableName + '.pairAddress', '=', dailyPastTableName + '.PAIRADDRESS')
            .where(pairsTableName + '.token0Address', token0Address)
            .where(pairsTableName + '.token1Address', token1Address)
            .whereRaw('DATE(SWAPAT)="' + date + '"')
            .select(dailyPastTableName + '.*')
        
        for (var i = 0; i < dailyPast.length; i ++) {
            dailyPast[i].SWAPAT = convertTimestampToString(new Date(dailyPast[i].SWAPAT).getTime(), true)

            if (!data[dailyPast[i].SWAPAT]) {
                data[dailyPast[i].SWAPAT] = {
                    MAXPRICE: dailyPast[i].MAXPRICE,
                    MINPRICE: dailyPast[i].MINPRICE,
                    TOTALVOLUME0: dailyPast[i].TOTALVOLUME0,
                    TOTALVOLUME1: dailyPast[i].TOTALVOLUME1,
                    SWAPCOUNT: dailyPast[i].SWAPCOUNT,
                }
            } else {
                data[dailyPast[i].SWAPAT].TOTALVOLUME0 += dailyPast[i].TOTALVOLUME0
                data[dailyPast[i].SWAPAT].TOTALVOLUME1 += dailyPast[i].TOTALVOLUME1
                data[dailyPast[i].SWAPAT].SWAPCOUNT += dailyPast[i].SWAPCOUNT
            }
        }

        for (var key in data) {
            try {
                var avg = data[key].TOTALVOLUME0 / data[key].TOTALVOLUME1
                var basePrice = 1
                
                if (baseToken != USD_ADDRESS) basePrice = ethData[key].AVGPRICE

                if (token0Address == baseToken) {
                    await knex(tokenDailyTableName).insert({
                        TOKENADDRESS: outToken,
                        SWAPAT: key,
                        AVGPRICE: avg * basePrice,
                        MAXPRICE: data[key].MAXPRICE * basePrice,
                        MINPRICE: data[key].MINPRICE * basePrice,
                        VOLUME: data[key].TOTALVOLUME0 * basePrice,
                        SWAPCOUNT: data[key].SWAPCOUNT,
                    })
                } else {
                    await knex(tokenDailyTableName).insert({
                        TOKENADDRESS: outToken,
                        SWAPAT: key,
                        AVGPRICE: avg != 0 ? 1 / avg * basePrice : 0,
                        MAXPRICE: data[key].MAXPRICE != 0 ? 1 / data[key].MAXPRICE * basePrice : 0,
                        MINPRICE: data[key].MINPRICE != 0 ? 1 / data[key].MINPRICE * basePrice : 0,
                        VOLUME: data[key].TOTALVOLUME1 * basePrice,
                        SWAPCOUNT: data[key].SWAPCOUNT,
                    })
                }
            } catch (err) {
                myLogger.log(err)
            }            
        }
    }

    async function calcAllDailyPrice(date) {
        await calcDailyPrice(ETH_ADDRESS, USD_ADDRESS, date)

        var data = []
        var rows = await knex(tokenDailyTableName).where('TOKENADDRESS', ETH_ADDRESS).select('*')

        for (var i = 0; i < rows.length; i ++) {
            ethData[convertTimestampToString(new Date(rows[i].SWAPAT).getTime(), true)] = rows[i]
        }

        var dailyPast = await knex(dailyPastTableName)
            .join(pairsTableName, pairsTableName + '.pairAddress', '=', dailyPastTableName + '.PAIRADDRESS')
            .whereRaw('(' + pairsTableName + '.token0Address="' + ETH_ADDRESS + '" or ' + pairsTableName + '.token1Address="' + ETH_ADDRESS + '") and DATE(' + dailyPastTableName + '.SWAPAT)="' + date +'"')
            .select(dailyPastTableName + '.*')
            .select(pairsTableName + '.token0Address')
            .select(pairsTableName + '.token1Address')
        
        for (var i = 0; i < dailyPast.length; i ++) {
            var token = dailyPast[i].token0Address

            if (token == ETH_ADDRESS) token = dailyPast[i].token1Address
            if (!data[token]) data[token] = []

            dailyPast[i].SWAPAT = convertTimestampToString(new Date(dailyPast[i].SWAPAT).getTime(), true)

            if (!data[token][dailyPast[i].SWAPAT]) {
                data[token][dailyPast[i].SWAPAT] = {
                    TOKEN: ETH_ADDRESS == dailyPast[i].token0Address,
                    MAXPRICE: dailyPast[i].MAXPRICE,
                    MINPRICE: dailyPast[i].MINPRICE,
                    TOTALVOLUME0: dailyPast[i].TOTALVOLUME0,
                    TOTALVOLUME1: dailyPast[i].TOTALVOLUME1,
                    SWAPCOUNT: dailyPast[i].SWAPCOUNT,
                }
            } else {
                data[token][dailyPast[i].SWAPAT].TOTALVOLUME0 += dailyPast[i].TOTALVOLUME0
                data[token][dailyPast[i].SWAPAT].TOTALVOLUME1 += dailyPast[i].TOTALVOLUME1
                data[token][dailyPast[i].SWAPAT].SWAPCOUNT += dailyPast[i].SWAPCOUNT
            }
        }

        for (var token in data) {
            for (var key in data[token]) {
                try {
                    var avg = data[token][key].TOTALVOLUME0 / data[token][key].TOTALVOLUME1
                    var basePrice = ethData[key].AVGPRICE
    
                    if (data[token][key].TOKEN) {
                        await knex(tokenDailyTableName).insert({
                            TOKENADDRESS: token,
                            SWAPAT: key,
                            AVGPRICE: avg * basePrice,
                            MAXPRICE: data[token][key].MAXPRICE * basePrice,
                            MINPRICE: data[token][key].MINPRICE * basePrice,
                            VOLUME: data[token][key].TOTALVOLUME0 * basePrice,
                            SWAPCOUNT: data[token][key].SWAPCOUNT,
                        })
                    } else {
                        await knex(tokenDailyTableName).insert({
                            TOKENADDRESS: token,
                            SWAPAT: key,
                            AVGPRICE: avg != 0 ? 1 / avg * basePrice : 0,
                            MAXPRICE: data[token][key].MAXPRICE != 0 ? 1 / data[token][key].MINPRICE * basePrice : 0,
                            MINPRICE: data[token][key].MINPRICE != 0 ? 1 / data[token][key].MAXPRICE * basePrice : 0,
                            VOLUME: data[token][key].TOTALVOLUME1 * basePrice,
                            SWAPCOUNT: data[token][key].SWAPCOUNT,
                        })
                    }
                } catch (err) {
                    myLogger.log(err)
                }            
            }
        }
    }

    await calcDailyPrice(ETH_ADDRESS, USD_ADDRESS, writeDate)
    await calcAllDailyPrice(writeDate)

    // myLogger.log(writeDate + " WRITE TRANSACTION HISTORY FILE FINISHED!!!")
}

async function init() {
    // try {
    //     var blockNumber = await web3s[0].eth.getBlockNumber()
    //     var curBlock = blockNumber

    //     if (curBlock > lastBlockNumber + 99) {
    //         blockNumber = lastBlockNumber + 99
    //     }

    //     var results = await Promise.all([
    //         web3s[1].eth.getPastLogs({
    //             fromBlock: lastBlockNumber,
    //             toBlock: blockNumber,
    //             topics: ['0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9']
    //         }),
    //         web3s[2].eth.getPastLogs({
    //             fromBlock: lastBlockNumber,
    //             toBlock: blockNumber,
    //             topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822']
    //         }),
    //         web3s[3].eth.getPastLogs({
    //             fromBlock: lastBlockNumber,
    //             toBlock: blockNumber,
    //             topics: ['0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118']
    //         }),
    //         web3s[4].eth.getPastLogs({
    //             fromBlock: lastBlockNumber,
    //             toBlock: blockNumber,
    //             topics: ['0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67']
    //         })
    //     ])

    //     // myLogger.log('==================================================')
    //     // myLogger.log('lastBlockNumber: ' + lastBlockNumber)
    //     // myLogger.log('UNISWAP V2 PAIR CREATED: ' + results[0].length)
    //     // myLogger.log('UNISWAP V2 SWAP        : ' + results[1].length)
    //     // myLogger.log('UNISWAP V3 POOL CREATED: ' + results[2].length)
    //     // myLogger.log('UNISWAP V3 SWAP        : ' + results[3].length)

    //     for (var i = 0; i < results[0].length; i += proxyCnt) {
    //         async function getOneV2Pair(result, web3) {
    //             try {
    //                 var token0Address = '0x' + result.topics[1].substr(26, 40).toLowerCase()
    //                 var token1Address = '0x' + result.topics[2].substr(26, 40).toLowerCase()
    //                 var pairAddress = '0x' + result.data.substr(26, 40).toLowerCase()
    //                 var factoryAddress = result.address.toLowerCase()
    //                 var block = result.blockNumber
    //                 var resBlock = await web3.eth.getBlock(block)
    //                 var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
    //                 var res = await getPairDecimals(pairAddress, tmpDate, web3)
    //                 var baseToken = tokensData[token0Address].createdAt < tokensData[token1Address].createdAt ? 0 : 1

    //                 // myLogger.log('-------------------------------------------')
    //                 // myLogger.log('V2 CREATED: ' + result.transactionHash)

    //                 pairsData[pairAddress] = {
    //                     token0Address: token0Address,
    //                     token1Address: token1Address,
    //                     decimals: res[0],
    //                     baseToken: baseToken,
    //                     lastPrice: 0,
    //                 }

    //                 try {
    //                     await knex(pairsTableName).insert({
    //                         token0Address: token0Address,
    //                         token1Address: token1Address,
    //                         factoryAddress: factoryAddress,
    //                         pairAddress: pairAddress,
    //                         createdAt: tmpDate,
    //                         baseToken: baseToken,
    //                         decimals: res[0]
    //                     })
    //                 } catch (err) {
    //                     myLogger.log('V2 CREATED: ' + result.transactionHash)
    //                     myLogger.log(err)
    //                 }
    //             } catch (err) {

    //             } 
    //         }

    //         var funcs = []

    //         for (var k = 0; k < proxyCnt && i + k < results[0].length; k ++) {
    //             funcs.push(getOneV2Pair(results[0][i + k], web3s[k]))
    //         }

    //         await Promise.all(funcs)
    //     }

    //     for (var i = 0; i < results[1].length; i += proxyCnt) {
    //         async function getOneV2Swap(result, web3) {
    //             try {
    //                 var amt0 = Number.parseInt(hexToBn(result.data.substr(2, 64)))
    //                 var amt1 = Number.parseInt(hexToBn(result.data.substr(66, 64)))
    //                 var amt2 = Number.parseInt(hexToBn(result.data.substr(130, 64)))
    //                 var amt3 = Number.parseInt(hexToBn(result.data.substr(194, 64)))
    //                 var swap0 = amt0 - amt2
    //                 var swap1 = amt1 - amt3
    //                 var pairAddress = result.address.toLowerCase()
    //                 var block = result.blockNumber
    //                 var resBlock

    //                 if (!blocksData[block]) {
    //                     resBlock = await web3.eth.getBlock(block)
    //                     blocksData[block] = {timestamp: resBlock.timestamp}
    //                 } else {
    //                     resBlock = blocksData[block]
    //                 }

    //                 var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
    //                 var transactionID = result.logIndex
    //                 var transactionHash = result.transactionHash
    //                 var decimals = await getPairDecimals(pairAddress, tmpDate, web3)
    //                 var baseToken = tokensData[decimals[1]].createdAt < tokensData[decimals[2]].createdAt ? 0 : 1
    //                 var isBuy = 0
    //                 var transactionData = await web3.eth.getTransactionReceipt(transactionHash)
    //                 var swapMaker = ""
    //                 var baseAddress = baseToken == 0 ? decimals[2] : decimals[1]

    //                 if (baseToken == 0) {
    //                     if (swap0 > 0) {
    //                         isBuy = 1
    //                     } else {
    //                         isBuy = 0
    //                     }
    //                 } else {
    //                     if (swap1 > 0) {
    //                         isBuy = 1
    //                     } else {
    //                         isBuy = 0
    //                     }
    //                 }

    //                 for (var j = 0; j < transactionData.logs.length; j ++) {
    //                     if (transactionData.logs[j].logIndex == transactionID) break;
    //                     if (transactionData.logs[j].topics[0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && transactionData.logs[j].address.toLowerCase() == baseAddress) {
    //                         if (isBuy) {
    //                             swapMaker = transactionData.logs[j].topics[2].substr(26, 40)
    //                         } else {
    //                             swapMaker = transactionData.logs[j].topics[1].substr(26, 40)
    //                         }
    //                     }
    //                 }

    //                 swapMaker = '0x' + swapMaker

    //                 // myLogger.log('-------------------------------------------')
    //                 // myLogger.log('V2 SWAP: ' + result.transactionHash)

    //                 if (!pairsData[pairAddress]) {
    //                     pairsData[pairAddress] = {
    //                         token0Address: decimals[1],
    //                         token1Address: decimals[2],
    //                         decimals: decimals[0],
    //                         baseToken: baseToken,
    //                         lastPrice: swap1 == 0 ? 0 : Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
    //                     }

    //                     try {
    //                         await knex(pairsTableName).insert({
    //                             token0Address: decimals[1],
    //                             token1Address: decimals[2],
    //                             pairAddress: pairAddress,
    //                             decimals: decimals[0],
    //                             baseToken: baseToken,
    //                             lastPrice: swap1 == 0 ? 0 : Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
    //                             createdAt: tmpDate
    //                         })
    //                     } catch (err) {
    //                         await knex(pairsTableName).update({
    //                             lastPrice: swap1 == 0 ? 0 : Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)
    //                         }).where('pairAddress', pairAddress)
    //                     }
    //                 } else {
    //                     pairsData[pairAddress].lastPrice = swap1 == 0 ? 0 : Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)

    //                     try {
    //                         await knex(pairsTableName).update({
    //                             lastPrice: swap1 == 0 ? 0 : Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)
    //                         }).where('pairAddress', pairAddress)
    //                     } catch (err) {
    //                         myLogger.log('V2 SWAP: ' + result.transactionHash)
    //                         myLogger.log(err)
    //                     }
    //                 }

    //                 var tmpToken = pairsData[pairAddress].baseToken == 1 ? pairsData[pairAddress].token0Address : pairsData[pairAddress].token1Address
    //                 var tmpBaseToken = pairsData[pairAddress].baseToken == 0 ? pairsData[pairAddress].token0Address : pairsData[pairAddress].token1Address
    //                 var tmpPrice = 0

    //                 if (pairsData[pairAddress] && pairsData[pairAddress].lastPrice != 0) {
    //                     tmpPrice = pairsData[pairAddress].baseToken == 0 ? tokensData[tmpBaseToken].lastPrice * pairsData[pairAddress].lastPrice : tokensData[tmpBaseToken].lastPrice / pairsData[pairAddress].lastPrice
    //                 }

    //                 if (tokensData[tmpToken]) {
    //                     tokensData[tmpToken].lastPrice = tmpPrice
    //                     await knex(tokensTableName).where('tokenAddress', tmpToken).update({
    //                         lastPrice: tmpPrice
    //                     })
    //                 }

    //                 var data = {
    //                     pairAddress: pairAddress,
    //                     tokenAddress: tmpToken,
    //                     swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
    //                     priceUSD: tmpPrice,
    //                     swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
    //                     swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
    //                     swapAt: tmpDate,
    //                     swapTransactionHash: transactionHash,
    //                     isBuy: isBuy,
    //                     swapMaker: swapMaker
    //                 }

    //                 try {
    //                     await knex(liveTableName).insert(data)
    //                 } catch (err) {
    //                     myLogger.log('V2 SWAP: ' + result.transactionHash)
    //                     myLogger.log(err)
    //                 }
    //             } catch (err) {
                    
    //             }
    //         }

    //         var funcs = []

    //         for (var k = 0; k < proxyCnt && i + k < results[1].length; k ++) {
    //             funcs.push(getOneV2Swap(results[1][i + k], web3s[k]))
    //         }

    //         await Promise.all(funcs)
    //     }

    //     for (var i = 0; i < results[2].length; i += proxyCnt) {
    //         async function getOneV3Pair(result, web3) {
    //             try {
    //                 var token0Address = '0x' + result.topics[1].substr(26, 40).toLowerCase()
    //                 var token1Address = '0x' + result.topics[2].substr(26, 40).toLowerCase()
    //                 var pairAddress = '0x' + result.data.substr(90, 40).toLowerCase()
    //                 var factoryAddress = result.address.toLowerCase()
    //                 var block = result.blockNumber
    //                 var resBlock = await web3.eth.getBlock(block)
    //                 var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
    //                 var res = await getPairDecimals(pairAddress, tmpDate, web3)
    //                 var baseToken = tokensData[token0Address].createdAt < tokensData[token1Address].createdAt ? 0 : 1

    //                 // myLogger.log('-------------------------------------------')
    //                 // myLogger.log('V3 CREATED: ' + result.transactionHash)
            
    //                 pairsData[pairAddress] = {
    //                     token0Address: token0Address,
    //                     token1Address: token1Address,
    //                     decimals: res[0],
    //                     baseToken: baseToken,
    //                     lastPrice: 0,
    //                 }
            
    //                 try {
    //                     await knex(pairsTableName).insert({
    //                         token0Address: token0Address,
    //                         token1Address: token1Address,
    //                         factoryAddress: factoryAddress,
    //                         pairAddress: pairAddress,
    //                         createdAt: tmpDate,
    //                         baseToken: baseToken,
    //                         decimals: res[0]
    //                     })
    //                 } catch (err) {
    //                     myLogger.log('V3 CREATED: ' + result.transactionHash)
    //                     myLogger.log(err)
    //                 }
    //             } catch (err) {
                    
    //             }
    //         }

    //         var funcs = []

    //         for (var k = 0; k < proxyCnt && i + k < results[2].length; k ++) {
    //             funcs.push(getOneV3Pair(results[2][i + k], web3s[k]))
    //         }

    //         await Promise.all(funcs)
    //     }

    //     for (var i = 0; i < results[3].length; i += proxyCnt) {
    //         async function getOneV3Swap(result, web3) {
    //             try {
    //                 var swap0 = Number.parseInt(hexToBn(result.data.substr(2, 64)))
    //                 var swap1 = Number.parseInt(hexToBn(result.data.substr(66, 64)))
    //                 var pairAddress = result.address.toLowerCase()
    //                 var block = result.blockNumber
    //                 var resBlock
    
    //                 if (!blocksData[block]) {
    //                     resBlock = await web3.eth.getBlock(block)
    //                     blocksData[block] = {timestamp: resBlock.timestamp}
    //                 } else {
    //                     resBlock = blocksData[block]
    //                 }
                    
    //                 var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
    //                 var transactionID = result.logIndex
    //                 var transactionHash = result.transactionHash
    //                 var decimals = await getPairDecimals(pairAddress, tmpDate, web3)
    //                 var baseToken = tokensData[decimals[1]].createdAt < tokensData[decimals[2]].createdAt ? 0 : 1
    //                 var isBuy = 0
    //                 var transactionData = await web3.eth.getTransactionReceipt(transactionHash)
    //                 var swapMaker = ""
    //                 var baseAddress = baseToken == 0 ? decimals[2] : decimals[1]
    
    //                 if (baseToken == 0) {
    //                     if (swap0 > 0) {
    //                         isBuy = 1
    //                     } else {
    //                         isBuy = 0
    //                     }
    //                 } else {
    //                     if (swap1 > 0) {
    //                         isBuy = 1
    //                     } else {
    //                         isBuy = 0
    //                     }
    //                 }
    
    //                 for (var j = 0; j < transactionData.logs.length; j ++) {
    //                     if (transactionData.logs[j].logIndex == transactionID) break;
    //                     if (transactionData.logs[j].topics[0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && transactionData.logs[j].address.toLowerCase() == baseAddress) {
    //                         if (isBuy) {
    //                             swapMaker = transactionData.logs[j].topics[2].substr(26, 40)
    //                         } else {
    //                             swapMaker = transactionData.logs[j].topics[1].substr(26, 40)
    //                         }
    //                     }
    //                 }
    
    //                 swapMaker = '0x' + swapMaker
    
    //                 // myLogger.log('-------------------------------------------')
    //                 // myLogger.log('V3 SWAP: ' + result.transactionHash)
    
    //                 if (!pairsData[pairAddress]) {
    //                     pairsData[pairAddress] = {
    //                         token0Address: decimals[1],
    //                         token1Address: decimals[2],
    //                         decimals: decimals[0],
    //                         baseToken: baseToken,
    //                         lastPrice: swap1 == 0 ? 0 : Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
    //                     }
    
    //                     try {
    //                         await knex(pairsTableName).insert({
    //                             token0Address: decimals[1],
    //                             token1Address: decimals[2],
    //                             pairAddress: pairAddress,
    //                             decimals: decimals[0],
    //                             baseToken: baseToken,
    //                             lastPrice: swap1 == 0 ? 0 : Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
    //                             createdAt: tmpDate
    //                         })
    //                     } catch (err) {
    //                         await knex(pairsTableName).update({
    //                             lastPrice: swap1 == 0 ? 0 : Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)
    //                         }).where('pairAddress', pairAddress)
    //                     }
    //                 } else {
    //                     try {
    //                         await knex(pairsTableName).update({
    //                             lastPrice: swap1 == 0 ? 0 : Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)
    //                         }).where('pairAddress', pairAddress)
    //                     } catch (err) {
    //                         myLogger.log('V3 SWAP: ' + result.transactionHash)
    //                         myLogger.log(err)
    //                     }
    //                 }

    //                 var tmpToken = pairsData[pairAddress].baseToken == 1 ? pairsData[pairAddress].token0Address : pairsData[pairAddress].token1Address
    //                 var tmpBaseToken = pairsData[pairAddress].baseToken == 0 ? pairsData[pairAddress].token0Address : pairsData[pairAddress].token1Address
    //                 var tmpPrice = 0

    //                 if (pairsData[pairAddress] && pairsData[pairAddress].lastPrice != 0) {
    //                     tmpPrice = pairsData[pairAddress].baseToken == 0 ? tokensData[tmpBaseToken].lastPrice * pairsData[pairAddress].lastPrice : tokensData[tmpBaseToken].lastPrice / pairsData[pairAddress].lastPrice
    //                 }

    //                 if (tokensData[tmpToken]) {
    //                     tokensData[tmpToken].lastPrice = tmpPrice
    //                     await knex(tokensTableName).where('tokenAddress', tmpToken).update({
    //                         lastPrice: tmpPrice
    //                     })
    //                 }

    //                 var data = {
    //                     pairAddress: pairAddress,
    //                     tokenAddress: tmpToken,
    //                     swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
    //                     priceUSD: tmpPrice,
    //                     swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
    //                     swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
    //                     swapAt: tmpDate,
    //                     swapTransactionHash: transactionHash,
    //                     isBuy: isBuy,
    //                     swapMaker: swapMaker
    //                 }

    //                 try {
    //                     await knex(liveTableName).insert(data)
    //                 } catch (err) {
    //                     myLogger.log('V3 SWAP: ' + result.transactionHash)
    //                     myLogger.log(err)
    //                 }
    //             } catch (err) {
                    
    //             }
    //         }

    //         var funcs = []

    //         for (var k = 0; k < proxyCnt && i + k < results[3].length; k ++) {
    //             funcs.push(getOneV3Swap(results[3][i + k], web3s[k]))
    //         }

    //         await Promise.all(funcs)
    //     }

    //     var resBlock

    //     if (!blocksData[lastBlockNumber]) {
    //         resBlock = await web3s[0].eth.getBlock(lastBlockNumber)
    //         blocksData[lastBlockNumber] = {timestamp: resBlock.timestamp}
    //     } else {
    //         resBlock = blocksData[lastBlockNumber]
    //     }

    //     var tmpDate1 = convertTimestampToString(resBlock.timestamp * 1000 - 7 * 86400 * 1000, true)

    //     if (!blocksData[blockNumber]) {
    //         resBlock = await web3s[0].eth.getBlock(blockNumber)
    //         blocksData[blockNumber] = {timestamp: resBlock.timestamp}
    //     } else {
    //         resBlock = blocksData[blockNumber]
    //     }

    //     var tmpDate2 = convertTimestampToString(resBlock.timestamp * 1000 - 7 * 86400 * 1000, true)

    //     if (tmpDate1.split(' ')[0] != tmpDate2.split(' ')[0]) {
    //         await writeTransactionHistoryFile(tmpDate2.split(' ')[0], convertTimestampToString(resBlock.timestamp * 1000 - 86400 * 1000, true).split(' ')[0])
    //     }
        
    //     if (curBlock > blockNumber) {
    //         lastBlockNumber = blockNumber + 1
    //     } else {
    //         lastBlockNumber = blockNumber
    //     }
    // } catch (err) {
    //     myLogger.log(err)
    // }

    // setTimeout(init, 100)

    await writeTransactionHistoryFile('2022-03-01', '2022-03-28')
}

getTokenAndPairData()
.then(res => {
    init()
})
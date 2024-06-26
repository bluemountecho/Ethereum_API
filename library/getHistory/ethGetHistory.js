var fs = require('fs')
const config = require('../../config')
const process = require('process')
const HttpsProxyAgent = require('https-proxy-agent');
const HttpProxyAgent = require('http-proxy-agent');
const axios = require('axios')
const utf8 = require('utf8')
const { JSDOM } = require('jsdom')
const https = require('https')
const http = require('http')
const Q = require('q')
const request = require('request');

const { Console } = require("console");
const chainName = process.argv[2]
const myLogger = new Console({
  stdout: fs.createWriteStream(chainName + ".txt"),
  stderr: fs.createWriteStream(chainName + ".txt"),
});

const pastTableName = chainName + '_past'
const tokensTableName = chainName + '_tokens'
const pairsTableName = chainName + '_pairs'
const dailyPastTableName = chainName + '_daily'
const liveTableName = chainName + '_live'
const tokenDailyTableName = chainName + '_token_daily'
const changesTableName = chainName + '_changes'
const proxyCnt = config[chainName].PROXYCOUNT

Web3 = require('web3')

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
                "type": "uint8"
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
                "type": "uint8"
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
    },
    keepAlive: true,
    timeout: 20000,
    headers: [{name: 'Access-Control-Allow-Origin', value: '*'}],
    withCredentials: false,
    agent: new HttpsProxyAgent('https://' + config.PROXY[process.argv[2]])
};

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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var tokensData = []
var pairsData = []
var blocksData = []
var FROMBLOCK = config[chainName].FROMBLOCK
var TOBLOCK = config[chainName].TOBLOCK
const USD_ADDRESS = config[chainName].USD_ADDRESS
const ETH_ADDRESS = config[chainName].ETH_ADDRESS

async function getURL(url, proxy, network = '') {
    var defer = Q.defer()

    request({
        'url': url,
        'method': "GET",
        'headers': network == 'bsc' ? {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
            'cookie': 'ASP.NET_SessionId=uwhn2rk2h1k5yxo4ylrf415f; __cflb=02DiuJNoxEYARvg2sN4zbncfn2GL25UpfgiXJQ9o28LgU; _gid=GA1.2.2037784143.1651651310; _ga=GA1.2.639158328.1651651309; _ga_PQY6J2Q8EP=GS1.1.1651651305.1.1.1651651719.0; cf_chl_rc_i=44; cf_chl_2=2ce1dabdcf48b99; cf_chl_prog=x14; cf_clearance=muvVO5KYFzyhT7Is13t86e7Z7VRu37ozwLj3cwjaUk4-1651720684-0-250; __cf_bm=bOPYzKQYe7aWv3Rjp2LWCQxGKs8bJ9S7K_7M205x44M-1651720693-0-AbzxCwwuXMsvIu6M+TFdN+YqS/GscI+XeE9mH08WEucis7ygYuSd5QARwotu+g6WEpQrApwF5WBzgvubCZEKllELvEoNlNXldhtKJsFSQoHspfYhfi5PWxDyxWXFmHErRw=='
        } : {},
        // 'proxy': 'http://' + proxy
    }, function (error, response, body) {
        try {
            myLogger.log(network, response.statusCode)
            if (!error && response && response.statusCode == 200) {
                defer.resolve(body)
            } else {
                defer.reject('')
            }
        } catch (err) {
            defer.reject('')
        }
    })

    return defer.promise
}

async function getTokenInfos(web3, tokenAddress) {
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

async function getPairDecimals(web3, pairAddress, createdAt) {
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
            res[0] = await getTokenInfos(web3, token0Address)

            if (!tokensData[token0Address]) {
                try {
                    await knex(tokensTableName).insert({
                        tokenAddress: token0Address,
                        tokenDecimals: res[0][0],
                        tokenSymbol: utf8.encode(res[0][1]),
                        tokenName: utf8.encode(res[0][2]),
                        createdAt: createdAt
                    })
                } catch (err) {
    
                }
            }

            tokensData[token0Address] = {
                tokenDecimals: res[0][0],
                tokenSymbol: utf8.encode(res[0][1]),
                tokenName: utf8.encode(res[0][2]),
                createdAt: createdAt
            }
        }

        if (tokensData[token1Address]) {
            res[1] = []
            res[1][0] = tokensData[token1Address].tokenDecimals
            res[1][1] = tokensData[token1Address].tokenSymbol
            res[1][2] = tokensData[token1Address].tokenName
        } else {
            res[1] = await getTokenInfos(web3, token1Address)

            if (!tokensData[token1Address]) {
                try {
                    await knex(tokensTableName).insert({
                        tokenAddress: token1Address,
                        tokenDecimals: res[1][0],
                        tokenSymbol: utf8.encode(res[1][1]),
                        tokenName: utf8.encode(res[1][2]),
                        createdAt: createdAt
                    })
                } catch (err) {
    
                }
            }

            tokensData[token1Address] = {
                tokenDecimals: res[1][0],
                tokenSymbol: utf8.encode(res[1][1]),
                tokenName: utf8.encode(res[1][2]),
                createdAt: createdAt
            }
        }

        return [res[1][0] - res[0][0], token0Address, token1Address]
    } catch (err) {
        // myLogger.log(pairAddress, token0Address, token1Address)
        // myLogger.log(err)
    }

    return [0, 0, 0]
}

async function getTokenAndPairData() {
    var res = await knex(tokensTableName).select('*')

    myLogger.log(res.length)

    for (var i = 0; i < res.length; i ++) {
        tokensData[res[i].tokenAddress] = {
            tokenDecimals: res[i].tokenDecimals,
            tokenSymbol: res[i].tokenSymbol,
            tokenName: res[i].tokenName,
            createdAt: convertTimestampToString(res[i].createdAt, true)
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
            blockNumber: res[i].blockNumber,
            transactionID: res[i].transactionID
        }
    }
}

async function getOnePartPairs(web3, fromBlock, toBlock) {
    try {
        var results = await Promise.all([
            web3.eth.getPastLogs({
                fromBlock: fromBlock,
                toBlock: toBlock,
                topics: ['0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9']
            }),
            web3.eth.getPastLogs({
                fromBlock: fromBlock,
                toBlock: toBlock,
                topics: ['0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118']
            })
        ])

        // myLogger.log('==================================================')
        // myLogger.log('Block Range: ' + fromBlock + ' ~ ' + toBlock)
        // myLogger.log('UNISWAP V2 PAIR CREATED: ' + results[0].length)
        // myLogger.log('UNISWAP V3 POOL CREATED: ' + results[1].length)

        for (var i = 0; i < results[0].length; i ++) {
            try {
                var token0Address = '0x' + results[0][i].topics[1].substr(26, 40).toLowerCase()
                var token1Address = '0x' + results[0][i].topics[2].substr(26, 40).toLowerCase()
                var pairAddress = '0x' + results[0][i].data.substr(26, 40).toLowerCase()
                var factoryAddress = results[0][i].address.toLowerCase()
                var block = results[0][i].blockNumber
                var resBlock = await web3.eth.getBlock(block)
                var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
                var res = await getPairDecimals(web3, pairAddress, tmpDate)
                var baseToken = 0

                if (tokensData[token0Address] && tokensData[token1Address]) {
                    baseToken = tokensData[token0Address].createdAt < tokensData[token1Address].createdAt ? 0 : 1
                } else if (tokensData[token0Address]) {
                    baseToken = 0
                } else if (tokensData[token1Address]) {
                    baseToken = 1
                }

                // myLogger.log(pairAddress)
                // myLogger.log('-------------------------------------------')
                // myLogger.log('V2 CREATED: ' + results[0][i].transactionHash)

                pairsData[pairAddress] = {
                    token0Address: token0Address,
                    token1Address: token1Address,
                    decimals: res[0],
                    baseToken: baseToken,
                    blockNumber: block,
                    transactionID: 0
                }

                try {
                    await knex(pairsTableName).insert({
                        token0Address: token0Address,
                        token1Address: token1Address,
                        factoryAddress: factoryAddress,
                        pairAddress: pairAddress,
                        createdAt: tmpDate,
                        blockNumber: block,
                        transactionID: 0,
                        baseToken: baseToken,
                        decimals: res[0]
                    })
                } catch (err) {
                }
            } catch (err) {
                myLogger.log(err)
            }
        }

        for (var i = 0; i < results[1].length; i ++) {
            try {
                var token0Address = '0x' + results[1][i].topics[1].substr(26, 40).toLowerCase()
                var token1Address = '0x' + results[1][i].topics[2].substr(26, 40).toLowerCase()
                var pairAddress = '0x' + results[1][i].data.substr(90, 40).toLowerCase()
                var factoryAddress = results[1][i].address.toLowerCase()
                var block = results[1][i].blockNumber
                var resBlock = await web3.eth.getBlock(block)
                var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
                var res = await getPairDecimals(web3, pairAddress, tmpDate)
                var baseToken = tokensData[token0Address].createdAt < tokensData[token1Address].createdAt ? 0 : 1

                // myLogger.log('-------------------------------------------')
                // myLogger.log('V3 CREATED: ' + results[1][i].transactionHash)
                // myLogger.log(pairAddress)
        
                pairsData[pairAddress] = {
                    token0Address: token0Address,
                    token1Address: token1Address,
                    decimals: res[0],
                    baseToken: baseToken,
                    blockNumber: block,
                    transactionID: 0
                }
        
                try {
                    await knex(pairsTableName).insert({
                        token0Address: token0Address,
                        token1Address: token1Address,
                        factoryAddress: factoryAddress,
                        pairAddress: pairAddress,
                        createdAt: tmpDate,
                        blockNumber: block,
                        transactionID: 0,
                        baseToken: baseToken,
                        decimals: res[0]
                    })
                } catch (err) {
                }
            } catch (err) {
                myLogger.log(err)
            }
        }
    } catch (err) {
        myLogger.log(fromBlock, toBlock, web3._provider)
        myLogger.log(err)
    }
}

async function getAllPairs(fromBlock) {
    if (fromBlock > TOBLOCK) {
        myLogger.log("GET PAIRS HISTORY FINISHED!!!")
        return
    }

    try {
        var v1 = config[chainName].PAIRV1
        var v2 = config[chainName].PAIRV2
        var toBlock = fromBlock + v1 - 1
        var funcs = []
        var web3i = 0

        if (toBlock > TOBLOCK) toBlock = TOBLOCK

        myLogger.log("***************", fromBlock, toBlock, "***************")

        for (var i = fromBlock; i <= toBlock; i += v2) {
            var to = i + v2 - 1

            if (to > toBlock) to = toBlock

            funcs.push(getOnePartPairs(web3s[web3i ++], i, to))
            await delay(100)

            if (to == toBlock) break
            // await delay(500)
        }

        await Promise.all(funcs)
    } catch (err) {
        myLogger.log(err)
    }
    
    getAllPairs(toBlock + 1)
}

async function getOnePartTransactionHistory(web3, fromBlock, toBlock) {
    try {
        var insertDatas = []

        var results = await Promise.all([
            web3.eth.getPastLogs({
                fromBlock: fromBlock,
                toBlock: toBlock,
                topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822']
            }),
            web3.eth.getPastLogs({
                fromBlock: fromBlock,
                toBlock: toBlock,
                topics: ['0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67']
            })
        ])

        // myLogger.log('==================================================')
        // myLogger.log('Block Range: ' + fromBlock + ' ~ ' + toBlock)
        // myLogger.log('UNISWAP V2 SWAP: ' + results[0].length)
        // myLogger.log('UNISWAP V3 SWAP: ' + results[1].length)

        for (var i = 0; i < results[0].length; i ++) {
            try {
                var amt0 = Number.parseInt(hexToBn(results[0][i].data.substr(2, 64)))
                var amt1 = Number.parseInt(hexToBn(results[0][i].data.substr(66, 64)))
                var amt2 = Number.parseInt(hexToBn(results[0][i].data.substr(130, 64)))
                var amt3 = Number.parseInt(hexToBn(results[0][i].data.substr(194, 64)))
                var swap0 = amt0 - amt2
                var swap1 = amt1 - amt3
                var pairAddress = results[0][i].address.toLowerCase()
                var block = results[0][i].blockNumber
                var resBlock

                if (!blocksData[block]) {
                    resBlock = await web3.eth.getBlock(block)
                    blocksData[block] = {timestamp: resBlock.timestamp}
                } else {
                    resBlock = blocksData[block]
                }
                
                var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
                var transactionID = results[0][i].logIndex
                var transactionHash = results[0][i].transactionHash
                var decimals = await getPairDecimals(web3, pairAddress, tmpDate)

                if (decimals[1] == 0) continue;
                
                var baseToken = 0
                try {
                    baseToken = tokensData[decimals[1]].createdAt < tokensData[decimals[2]].createdAt ? 0 : 1
                } catch (err) {
                }
                var isBuy = 0
                // var transactionData = await web3.eth.getTransactionReceipt(transactionHash)
                // var swapMaker = ""
                var baseAddress = baseToken == 0 ? decimals[2] : decimals[1]

                if (baseToken == 0) {
                    if (swap0 > 0) {
                        isBuy = 1
                    } else {
                        isBuy = 0
                    }
                } else {
                    if (swap1 > 0) {
                        isBuy = 1
                    } else {
                        isBuy = 0
                    }
                }

                // for (var j = 0; j < transactionData.logs.length; j ++) {
                //     if (transactionData.logs[j].logIndex == transactionID) break;
                //     if (transactionData.logs[j].topics[0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && transactionData.logs[j].address.toLowerCase() == baseAddress) {
                //         if (isBuy) {
                //             swapMaker = transactionData.logs[j].topics[2].substr(26, 40)
                //         } else {
                //             swapMaker = transactionData.logs[j].topics[1].substr(26, 40)
                //         }
                //     }
                // }

                // swapMaker = '0x' + swapMaker

                if (!pairsData[pairAddress]) {
                    pairsData[pairAddress] = {
                        token0Address: decimals[1],
                        token1Address: decimals[2],
                        decimals: decimals[0],
                        baseToken: baseToken,
                        blockNumber: block,
                        transactionID: transactionID
                    }

                    try {
                        await knex(pairsTableName).insert({
                            token0Address: decimals[1],
                            token1Address: decimals[2],
                            pairAddress: pairAddress,
                            blockNumber: block,
                            transactionID: transactionID,
                            decimals: decimals[0],
                            baseToken: baseToken,
                            lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                            createdAt: tmpDate
                        })
                    } catch (err) {
                        await knex(pairsTableName).update({
                            blockNumber: block,
                            transactionID: transactionID,
                            lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)
                        }).whereRaw('pairAddress="' + pairAddress + '"')
                    }

                    var data = {
                        pairAddress: pairAddress,
                        swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                        swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
                        swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
                        swapAt: tmpDate,
                        swapTransactionHash: transactionHash,
                        isBuy: isBuy,
                        // swapMaker: swapMaker
                    }

                    try {
                        // insertDatas.push(data)
                        await knex(pastTableName).insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                } else {
                    if (pairsData[pairAddress].blockNumber <= block && pairsData[pairAddress].transactionID <= transactionID) {
                        pairsData[pairAddress].blockNumber = block
                        pairsData[pairAddress].transactionID = transactionID
                        
                        try {
                            await knex(pairsTableName).update({
                                blockNumber: block,
                                transactionID: transactionID,
                                lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)
                            }).where('pairAddress', pairAddress)
                        } catch (err) {
                            myLogger.log(err)
                        }
                    }

                    var data = {
                        pairAddress: pairAddress,
                        swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                        swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
                        swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
                        swapAt: tmpDate,
                        swapTransactionHash: transactionHash,
                        isBuy: isBuy,
                        // swapMaker: swapMaker
                    }

                    try {
                        // insertDatas.push(data)
                        await knex(pastTableName).insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                }
            } catch (err) {
                myLogger.log(err)
            }
        }

        for (var i = 0; i < results[1].length; i ++) {
            try {
                var swap0 = Number.parseInt(hexToBn(results[1][i].data.substr(2, 64)))
                var swap1 = Number.parseInt(hexToBn(results[1][i].data.substr(66, 64)))
                var pairAddress = results[1][i].address.toLowerCase()
                var block = results[1][i].blockNumber
                var resBlock

                if (!blocksData[block]) {
                    resBlock = await web3.eth.getBlock(block)
                    blocksData[block] = {timestamp: resBlock.timestamp}
                } else {
                    resBlock = blocksData[block]
                }
                
                var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
                var transactionID = results[1][i].logIndex
                var transactionHash = results[1][i].transactionHash
                var decimals = await getPairDecimals(web3, pairAddress, tmpDate)

                if (decimals[1] == 0) continue;

                var baseToken = 0
                try {
                    baseToken = tokensData[decimals[1]].createdAt < tokensData[decimals[2]].createdAt ? 0 : 1
                } catch (err) {
                }
                var isBuy = 0
                // var transactionData = await web3.eth.getTransactionReceipt(transactionHash)
                // var swapMaker = ""
                var baseAddress = baseToken == 0 ? decimals[2] : decimals[1]

                if (baseToken == 0) {
                    if (swap0 > 0) {
                        isBuy = 1
                    } else {
                        isBuy = 0
                    }
                } else {
                    if (swap1 > 0) {
                        isBuy = 1
                    } else {
                        isBuy = 0
                    }
                }

                // for (var j = 0; j < transactionData.logs.length; j ++) {
                //     if (transactionData.logs[j].logIndex == transactionID) break;
                //     if (transactionData.logs[j].topics[0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && transactionData.logs[j].address.toLowerCase() == baseAddress) {
                //         if (isBuy) {
                //             swapMaker = transactionData.logs[j].topics[2].substr(26, 40)
                //         } else {
                //             swapMaker = transactionData.logs[j].topics[1].substr(26, 40)
                //         }
                //     }
                // }

                // swapMaker = '0x' + swapMaker

                if (!pairsData[pairAddress]) {
                    pairsData[pairAddress] = {
                        token0Address: decimals[1],
                        token1Address: decimals[2],
                        decimals: decimals[0],
                        baseToken: baseToken,
                        blockNumber: block,
                        transactionID: transactionID
                    }

                    try {
                        await knex(pairsTableName).insert({
                            token0Address: decimals[1],
                            token1Address: decimals[2],
                            pairAddress: pairAddress,
                            blockNumber: block,
                            transactionID: transactionID,
                            decimals: decimals[0],
                            baseToken: baseToken,
                            lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                            createdAt: tmpDate
                        })
                    } catch (err) {
                        await knex(pairsTableName).update({
                            blockNumber: block,
                            transactionID: transactionID,
                            lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)
                        }).whereRaw('pairAddress="' + pairAddress + '"')
                    }

                    var data = {
                        pairAddress: pairAddress,
                        swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                        swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
                        swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
                        swapAt: tmpDate,
                        swapTransactionHash: transactionHash,
                        isBuy: isBuy,
                        // swapMaker: swapMaker
                    }

                    try {
                        // insertDatas.push(data)
                        await knex(pastTableName).insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                } else {
                    if (pairsData[pairAddress].blockNumber <= block && pairsData[pairAddress].transactionID <= transactionID) {
                        pairsData[pairAddress].blockNumber = block
                        pairsData[pairAddress].transactionID = transactionID

                        try {
                            await knex(pairsTableName).update({
                                blockNumber: block,
                                transactionID: transactionID,
                                lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)
                            }).where('pairAddress', pairAddress)
                        } catch (err) {
                            myLogger.log(err)
                        }
                    }

                    var data = {
                        pairAddress: pairAddress,
                        swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                        swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
                        swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
                        swapAt: tmpDate,
                        swapTransactionHash: transactionHash,
                        isBuy: isBuy,
                        // swapMaker: swapMaker
                    }

                    try {
                        // insertDatas.push(data)
                        await knex(pastTableName).insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                }
            } catch (err) {
                myLogger.log(err)
            }
        }

        if (insertDatas.length) {
            // await knex(pastTableName).insert(insertDatas)
        }
    } catch (err) {
        myLogger.log(fromBlock, toBlock, web3._provider)
        myLogger.log(err)
    }
}

async function writeTransactionHistoryFile(date) {
    try {
        var path = "../../database/" + chainName

        var rows = (await knex.raw('\
            SELECT\
                ' + pastTableName + '.pairAddress AS PAIRADDRESS,\
                CONCAT(YEAR( ' + pastTableName + '.swapAt ), "-", MONTH( ' + pastTableName + '.swapAt ), "-", DAY( ' + pastTableName + '.swapAt )) AS SWAPAT,\
                avg( ' + pastTableName + '.swapPrice ) AS AVGPRICE,\
                max( ' + pastTableName + '.swapPrice ) AS MAXPRICE,\
                min( ' + pastTableName + '.swapPrice ) AS MINPRICE,\
                sum( ' + pastTableName + '.swapAmount0 * ( ' + pairsTableName + '.baseToken * 2 - 1 ) * ( ' + pastTableName + '.isBuy * - 2 + 1 ) ) AS VOLUME0,\
                sum( ' + pastTableName + '.swapAmount1 * ( ' + pairsTableName + '.baseToken * - 2 + 1 ) * ( ' + pastTableName + '.isBuy * - 2 + 1 ) ) AS VOLUME1,\
                sum( ' + pastTableName + '.swapAmount0 ) AS TOTALVOLUME0,\
                sum( ' + pastTableName + '.swapAmount1 ) AS TOTALVOLUME1,\
                count( ' + pastTableName + '.swapAmount0 ) AS SWAPCOUNT \
            FROM\
                ' + pastTableName + '\
                LEFT JOIN ' + pairsTableName + ' ON ' + pairsTableName + '.pairAddress = ' + pastTableName + '.pairAddress \
            WHERE\
                ' + pastTableName + '.swapAt<"' + date + ' ' + '00:00:00' + '"\
            GROUP BY\
                ' + pastTableName + '.pairAddress,\
                DATE( ' + pastTableName + '.swapAt ) \
            ORDER BY\
                DATE( ' + pastTableName + '.swapAt)'))[0]

        // for (var i = 0; i < rows.length; i ++) {
        //     // var fileName = path + '/transactions/' + rows[i].PAIRADDRESS + '.txt'
        //     // fs.appendFile(fileName, JSON.stringify(rows[i]) + '\n', "utf8", (err) => { })
        //     // await knex(dailyPastTableName).insert(rows[i])
        if (rows.length == 0) return
        
        await knex(dailyPastTableName).insert(rows)
        // }

        // rows = (await knex.raw('select CONCAT(YEAR( ' + pastTableName + '.swapAt ), "-", MONTH( ' + pastTableName + '.swapAt ), "-", DAY( ' + pastTableName + '.swapAt )) AS SWAPAT, swapMaker as SWAPMAKER, pairAddress from ' + pastTableName + ' where ' + pastTableName + '.swapAt<"' + date + ' ' + '00:00:00' + '" order by swapAt'))[0]

        // for (var i = 0; i < rows.length; i ++) {
        //     var fileName = path + '/swapers/' + rows[i].pairAddress + '.txt'
        //     fs.appendFile(fileName, JSON.stringify(rows[i]) + '\n', "utf8", (err) => { })
        // }

        await knex(pastTableName).where('swapAt', '<', date + ' ' + '00:00:00').delete()

        myLogger.log("WRITE TRANSACTION HISTORY FILE FINISHED!!!")
    } catch (err) {
        myLogger.log(date)
        myLogger.log(err)
    }    
}

async function getTransactionHistory(fromBlock) {
    if (fromBlock > TOBLOCK) {
        myLogger.log("GET TRANSACTION HISTORY FINISHED!!!")
        return
    }

    try {
        var v1 = config[chainName].TRANSACTIONV1
        var v2 = config[chainName].TRANSACTIONV2
        var toBlock = fromBlock + v1 - 1
        var funcs = []
        var web3i = 0

        if (toBlock > TOBLOCK) toBlock = TOBLOCK

        myLogger.log("***************", fromBlock, toBlock, "***************")

        for (var i = fromBlock; i <= toBlock; i += v2) {
            var to = i + v2 - 1

            if (to > toBlock) to = toBlock

            funcs.push(getOnePartTransactionHistory(web3s[web3i ++], i, to))
            await delay(100)

            if (to == toBlock) break
        }

        await Promise.all(funcs)
        
        var resBlock

        if (!blocksData[fromBlock]) {
            resBlock = await web3s[0].eth.getBlock(fromBlock)
            blocksData[fromBlock] = {timestamp: resBlock.timestamp}
        } else {
            resBlock = blocksData[fromBlock]
        }

        var tmpDate1 = convertTimestampToString(resBlock.timestamp * 1000, true)

        if (!blocksData[toBlock]) {
            resBlock = await web3s[1].eth.getBlock(toBlock)
            blocksData[toBlock] = {timestamp: resBlock.timestamp}
        } else {
            resBlock = blocksData[toBlock]
        }

        var tmpDate2 = convertTimestampToString(resBlock.timestamp * 1000, true)

        if (tmpDate1.split(' ')[0] != tmpDate2.split(' ')[0]) {
            await writeTransactionHistoryFile(tmpDate2.split(' ')[0])
        }
    } catch (err) {
        myLogger.log(err)
    }

    getTransactionHistory(toBlock + 1)
}

async function getUniswapV2PairPriceHistory() {
    var fromBlock = TOBLOCK, toBlock = FROMBLOCK
    var sum = 0
    var isVisit = []

    var rows = await knex(pairsTableName).select('*').where('lastPrice', '!=', 0)

    for (var i = 0; i < rows.length; i ++) {
        isVisit[rows[i].pairAddress] = true
    }

    for (var i = fromBlock; i > toBlock; i -= 1000) {
        var to = i
        var from = i - 999

        if (from < toBlock) from = toBlock
        
        let options = {
            fromBlock: from,
            toBlock: to,
            topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822']
        };

        results = await web3.eth.getPastLogs(options)

        for (var j = results.length - 1; j >= 0; j --) {
            try {
                if (isVisit[results[j].address.toLowerCase()]) continue

                var amt0 = Number.parseInt(hexToBn(results[j].data.substr(2, 64)))
                var amt1 = Number.parseInt(hexToBn(results[j].data.substr(66, 64)))
                var amt2 = Number.parseInt(hexToBn(results[j].data.substr(130, 64)))
                var amt3 = Number.parseInt(hexToBn(results[j].data.substr(194, 64)))
                var swap0 = amt0 - amt2
                var swap1 = amt1 - amt3
                var decimals = await getPairDecimals(results[j].address.toLowerCase())
                var block = results[j].blockNumber
                var transactionID = results[j].logIndex
                
                await knex(pairsTableName).update({
                    lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                    blockNumber: block,
                    transactionID: transactionID
                }).where('pairAddress', results[j].address.toLowerCase())

                isVisit[results[j].address.toLowerCase()] = true
            } catch (err) {
                myLogger.log(results[j])
                myLogger.log(err)
            }
        }

        myLogger.log('===================================')
        myLogger.log(from, to, results.length)
        sum += results.length
    }

    myLogger.log('Finished with ' + sum + ' rows!')
}

async function getUniswapV3PairPriceHistory() {
    var fromBlock = TOBLOCK, toBlock = FROMBLOCK
    var sum = 0
    var isVisit = []

    var rows = await knex(pairsTableName).select('*').where('lastPrice', '!=', 0)

    for (var i = 0; i < rows.length; i ++) {
        isVisit[rows[i].pairAddress] = true
    }

    for (var i = fromBlock; i > toBlock; i -= 1000) {
        var to = i
        var from = i - 999

        if (from < toBlock) from = toBlock
        
        let options = {
            fromBlock: from,
            toBlock: to,
            topics: ['0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67']
        };

        results = await web3.eth.getPastLogs(options)

        for (var j = results.length - 1; j >= 0; j --) {
            try {
                if (isVisit[results[j].address.toLowerCase()]) continue

                var swap0 = Number.parseInt(hexToBn(results[j].data.substr(2, 64)))
                var swap1 = Number.parseInt(hexToBn(results[j].data.substr(66, 64)))
                var decimals = await getPairDecimals(results[j].address.toLowerCase())
                var block = results[j].blockNumber
                var transactionID = results[j].logIndex
                
                await knex(pairsTableName).update({
                    lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                    blockNumber: block,
                    transactionID: transactionID
                }).where('pairAddress', results[j].address.toLowerCase())

                isVisit[results[j].address.toLowerCase()] = true
            } catch (err) {
                myLogger.log(results[j])
                myLogger.log(err)
            }
        }

        myLogger.log('===================================')
        myLogger.log(i, results.length)
        sum += results.length
    }

    myLogger.log('Finished with ' + sum + ' rows!')
}

async function getTokenSourceCodes() {
    var tokens = await knex(tokensTableName).orderBy('createdAt', 'desc').where('sourceCode', '').select('*')

    myLogger.log('Tokens Length: ' + tokens.length)

    for (var i = 0; i < tokens.length; i ++) {
        myLogger.log(i)

        try {
            var sourceCode = ''

            try {
                var res = await axios.get(config.ETH.scanData.scanSite + '/api?module=contract&action=getsourcecode&address=' + tokens[i].tokenAddress + '&apikey=' + config.ETH.scanData.apiKey)

                sourceCode = res.data.result[0].SourceCode
            } catch (err) {

            }

            await knex(tokensTableName)
                .where('tokenAddress', tokens[i].tokenAddress)
                .update({
                    sourceCode: utf8.encode(sourceCode),
                })

            myLogger.log(tokens[i].tokenAddress + ' is added!')

            await delay(200)
        } catch (err) {
            myLogger.log(err)
        }
    }

    myLogger.log('Getting Token Source Code Finished!!!')
}

async function getTokenCoingeckoInfos() {
    var tokens = await knex(tokensTableName).orderBy('createdAt', 'desc').where('coingeckoInfos', '').select('*')

    myLogger.log('Tokens Length: ' + tokens.length)

    for (var i = 0; i < tokens.length; i ++) {
        myLogger.log(i)

        try {
            var otherInfos = ''

            try {
                var res1 = await axios.get('https://api.coingecko.com/api/v3/coins/' + config.ETH.scanData.coinID + '/contract/' + tokens[i].tokenAddress)

                otherInfos = JSON.stringify(res1.data)
            } catch (err) {

            }

            await knex(tokensTableName)
                .where('tokenAddress', tokens[i].tokenAddress)
                .update({
                    coingeckoInfos: utf8.encode(otherInfos)
                })

            if (otherInfos != '') {
                myLogger.log(tokens[i].tokenAddress + ' is added!')
            }

            await delay(1200)
        } catch (err) {
            myLogger.log(err)
        }
    }

    myLogger.log('Getting Token Coingecko Info Finished!!!')
}

async function getOneTokenScanInfos(network, tokenAddress, proxy) {
    try {
        var res
        // var res = await getURL(config[network].ExplorerSite + '/token/' + tokenAddress + '#balances', proxy)
        var dom = new JSDOM(res)
        var totalHolders = 0
        // var links = {}

        // try {
        //     links['OfficialSite'] = dom.window.document.querySelector('#ContentPlaceHolder1_tr_officialsite_1').firstElementChild.childNodes[3].firstElementChild.getAttribute('href')
        // } catch (err) {

        // }

        // try {
        //     var linkElems = dom.window.document.querySelector('.col-md-8 > .list-inline').childNodes
        
        //     for (var j = 0; j < linkElems.length; j ++) {
        //         try {
        //             var key = linkElems[j].firstElementChild.getAttribute('data-original-title').split(':')[0]

        //             if (key == 'Email') {
        //                 links[key] = 'mailto:' + linkElems[j].firstElementChild.getAttribute('data-original-title').substr(key.length + 2)
        //             } else {
        //                 if (key == 'Github') {
        //                     links[key] = 'https://' + linkElems[j].firstElementChild.getAttribute('href')
        //                 } else {
        //                     links[key] = linkElems[j].firstElementChild.getAttribute('href')
        //                 }
        //             }
        //         } catch (err) {
        //         }
        //     }
        // } catch (err) {
        // }

        res = await getURL(config[network].ExplorerSite + '/token/generic-tokenholders2?m=normal&p=1&a=' + tokenAddress, proxy, network)    
        dom = new JSDOM(res)

        try {
            totalHolders = parseInt(dom.window.document.querySelector('p').textContent.split('total of')[1].replace(/,/, ''))
        } catch (err) {

        }

        var rows = dom.window.document.querySelectorAll('tbody tr')
        var holders = []

        for (var j = 0; j < rows.length; j ++) {
            try {
                var amount = rows[j].childNodes[2].textContent.replace(/,/g, '').replace(/ /g, '')
                var address = j
                var elem = rows[j].childNodes[1].querySelector('span[data-toggle="tooltip"]')

                if (elem == null) {
                    address = rows[j].childNodes[1].querySelector('a').textContent
                } else {
                    var tmp = elem.getAttribute('title').split('(')
                    address = tmp[tmp.length - 1].split(')')[0]
                }

                holders.push({
                    address: address,
                    amount: amount
                })
            } catch (err) {

            }
        }

        try {
            await knex(network + '_tokens').insert({
                tokenAddress: tokenAddress,
                totalHolders: totalHolders,
                // links: JSON.stringify(links),
                holders: JSON.stringify(holders)
            })
        } catch (err) {
            await knex(network + '_tokens').where('tokenAddress', tokenAddress).update({
                totalHolders: totalHolders,
                // links: JSON.stringify(links),
                holders: JSON.stringify(holders)
            })
        }
    } catch (err) {

    }    
}

async function getTokenScanInfos(network) {
    var tokens = (await axios.get('http://vdfhg4y4g%28%23%25%2Ag:U%23GT%2AGy98TH89y87gS4%2A%28%23TG%2AEG8%26%28%2A%23YTGEH@51.83.184.35:8888/' + network + '/all_change_tokens')).data
    var curToken = (await knex(network + '_tokens').select(knex.raw('max(tokenAddress) as curToken')))[0].curToken

    myLogger.log(network, tokens.length)

    // for (var i = 0; i < tokens.length; i ++) {
    //     await knex(tokensTableName).insert({
    //         tokenAddress: tokens[i].address
    //     })
    //     myLogger.log(i)
    // }

    for (var i = 0; i < tokens.length; i += 1) {
        if (tokens[i] <= curToken) continue
        var funcs = []

        for (var j = i; j < i + 1 && j < tokens.length; j ++) {
            funcs.push(getOneTokenScanInfos(network, tokens[j], config.PROXY[j - i]))
        }

        try {
            await Promise.all(funcs)
        } catch (err) {
            myLogger.log(err)
        }

        await delay(1000)
    }

    myLogger.log('Getting Token Scan Infos Finished!')
}

async function getAllScanInfos() {
    var funcs = []

    for (var i = 0; i < config.networks.length; i ++) {
        funcs.push(getTokenScanInfos(config.networks[i]))
    }

    await Promise.all(funcs)

    setTimeout(getAllScanInfos, 1000)
}

async function addMissedTokens() {
    var pairs = await knex(pairsTableName).orderBy('createdAt', 'asc').select('*')
    var tokens = await knex(tokensTableName).select('*')
    var tokenData = []

    for (var i = 0; i < tokens.length; i ++) {
        tokenData[tokens[i].tokenAddress] = true
    }

    myLogger.log('Pairs Length: ' + pairs.length)

    for (var i = 0; i < pairs.length; i ++) {
        try {
            if (!tokenData[pairs[i].token0Address]) {
                var res = await getTokenInfos(pairs[i].token0Address)

                await knex(tokensTableName).insert({
                    tokenAddress: pairs[i].token0Address,
                    tokenDecimals: res[0],
                    tokenSymbol: utf8.encode(res[1]),
                    tokenName: utf8.encode(res[2]),
                    createdAt: pairs[i].createdAt
                })

                tokenData[pairs[i].token0Address] = true
                myLogger.log(pairs[i].token0Address + ' is added!')
            }

            if (!tokenData[pairs[i].token1Address]) {
                var res = await getTokenInfos(pairs[i].token1Address)

                await knex(tokensTableName).insert({
                    tokenAddress: pairs[i].token1Address,
                    tokenDecimals: res[0],
                    tokenSymbol: utf8.encode(res[1]),
                    tokenName: utf8.encode(res[2]),
                    createdAt: pairs[i].createdAt
                })

                tokenData[pairs[i].token1Address] = true
                myLogger.log(pairs[i].token1Address + ' is added!')
            }

            if (i % 1000 == 0) myLogger.log(i + 'line')
        } catch (err) {
            myLogger.log(pairs[i])
            myLogger.log(err)
        }
    }

    myLogger.log('Adding missed tokens finished!')
}

async function getContavoInfo() {
    var rows = await getURL('http://user:pass@167.86.120.197:8888/eth/contavo_info', "")

    rows = JSON.parse(rows)
    
    for (var i = 0; i < rows.length; i ++) {
        await knex(tokensTableName).where('tokenAddress', rows[i].tokenAddress).update({
            totalHolders: rows[i].totalHolders,
            holders: rows[i].holders,
            links: rows[i].links
        })
    }

    console.log("Getting contavo info is finished!")
}

async function getDailyFromFile() {
    var rows = await knex(pairsTableName).select('*')

    myLogger.log(rows.length)

    for (var i = 0; i < rows.length; i ++) {
        myLogger.log(i)
        try {
            var content = fs.readFileSync('../../database/ethereum/transactions/' + rows[i].pairAddress + '.txt', {encoding:'utf8', flag:'r'})
            var datas = content.split('\n')
            var vis = []
            
            for (var j = 0; j < datas.length - 1; j ++) {
                datas[j] = JSON.parse(datas[j])

                if (vis[datas[j].SWAPAT]) continue

                vis[datas[j].SWAPAT] = true
                await knex(dailyPastTableName).insert(datas[j])
            }
        } catch (err) {
            myLogger.log(err)
        }
    }
}

async function getUSDPrice() {
    var ethData = []

    function getMax(a, b) {
        return a > b ? a : b
    }

    function getMin(a, b) {
        return a < b ? a : b
    }

    async function calcDailyPrice(outToken, baseToken) {
        var data = []
        var token0Address = baseToken
        var token1Address = outToken

        if (token0Address > token1Address) {
            token0Address = outToken
            token1Address = baseToken
        }

        var dailyPast = await knex(dailyPastTableName).join(pairsTableName, pairsTableName + '.pairAddress', '=', dailyPastTableName + '.PAIRADDRESS').where(pairsTableName + '.token0Address', token0Address).where(pairsTableName + '.token1Address', token1Address).orderBy(pairsTableName + '.createdAt', 'asc').select(dailyPastTableName + '.*')
        
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

    async function calcAllDailyPrice() {
        await calcDailyPrice(ETH_ADDRESS, USD_ADDRESS)

        var data = []
        var rows = await knex(tokenDailyTableName).where('TOKENADDRESS', ETH_ADDRESS).select('*')

        for (var i = 0; i < rows.length; i ++) {
            ethData[convertTimestampToString(new Date(rows[i].SWAPAT).getTime(), true)] = rows[i]
        }

        var dailyPast = await knex(dailyPastTableName).join(pairsTableName, pairsTableName + '.pairAddress', '=', dailyPastTableName + '.PAIRADDRESS').where(pairsTableName + '.token0Address', ETH_ADDRESS).orWhere(pairsTableName + '.token1Address', ETH_ADDRESS).orderBy(pairsTableName + '.createdAt', 'asc').select(dailyPastTableName + '.*').select(pairsTableName + '.token0Address').select(pairsTableName + '.token1Address')
        
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
                    if (!ethData[key]) continue
                    
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

        

        // var tokens = await knex(tokensTableName).where('tokenAddress', '>', '0x812485ac6eac722cb3c4e02d3a821a74f65cd0e2').select('*')

        // for (var i = 0; i < tokens.length; i += 30) {
        //     var funcs = []

        //     if (tokens[i].tokenAddress == ETH_ADDRESS) continue

        //     for (var j = 0; j < 30 && i + j < tokens.length; j ++) {
        //         funcs.push(calcDailyPrice(tokens[i + j].tokenAddress, ETH_ADDRESS))
        //     }
            
        //     await Promise.all(funcs)
        // }
    }

    async function getTokenAndPairLastPrice() {
        var rows = await knex(tokenDailyTableName).orderBy('SWAPAT', 'asc').select('*')
        var data = []

        for (var i = 0; i < rows.length; i ++) {
            data[rows[i].TOKENADDRESS] = rows[i].AVGPRICE
        }

        for (var token in data) {
            await knex(tokensTableName).where('tokenAddress', token).update({
                lastPrice: data[token]
            })
        }
        
        rows = await knex(dailyPastTableName).orderBy('SWAPAT', 'asc').select('*')
        data = []

        for (var i = 0; i < rows.length; i ++) {
            data[rows[i].PAIRADDRESS] = rows[i].AVGPRICE
        }

        for (var pair in data) {
            await knex(pairsTableName).where('pairAddress', pair).update({
                lastPrice: data[pair]
            })
        }
    }

    await calcAllDailyPrice()
    await getTokenAndPairLastPrice()

    console.log('Finished')
}

async function removeDuplicate() {
    var rows = await knex(liveTableName).select('*')
    var vis = []

    await knex(liveTableName).delete()

    for (var i = 0; i < rows.length; i ++) {
        if (!vis[rows[i].swapTransactionHash]) {
            vis[rows[i].swapTransactionHash] = []
        }

        if (!vis[rows[i].swapTransactionHash][rows[i].pairAddress]) {
            vis[rows[i].swapTransactionHash][rows[i].pairAddress] = true
            await knex(liveTableName).insert(rows[i])
        }
    }
}

async function createTables() {
    // try {
    //     await knex.raw('\
    //         ALTER TABLE `' + dailyPastTableName + '`\
    //             ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);\
    //     ')
    // } catch (err) {
    //     console.log(err)
    // }

    // try {
    //     await knex.raw('\
    //         ALTER TABLE `' + liveTableName + '`\
    //             ADD COLUMN tokenAddress varchar(255) AFTER pairAddress,\
    //             ADD COLUMN priceUSD double DEFAULT 0 AFTER swapPrice;\
    //     ')
    // } catch (err) {
    //     console.log(err)
    // }

    // try {
    //     await knex.raw('\
    //         ALTER TABLE `' + liveTableName + '`\
    //             ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),\
    //             ADD KEY `swapAt` (`swapAt`);\
    //     ')
    // } catch (err) {
    //     console.log(err)
    // }

    // try {
    //     await knex.raw('\
    //         ALTER TABLE `' + pairsTableName + '`\
    //             DROP COLUMN transactionID,\
    //             DROP COLUMN blockNumber;\
    //     ')
    // } catch (err) {
    //     console.log(err)
    // }

    // try {
    //     await knex.raw('\
    //         ALTER TABLE `' + tokensTableName + '`\
    //             MODIFY tokenName text,\
    //             MODIFY createdAt timestamp NULL DEFAULT NULL AFTER links,\
    //             RENAME COLUMN otherInfos TO coingeckoInfos,\
    //             ADD COLUMN lastPrice double NOT NULL DEFAULT 0;\
    //     ')
    // } catch (err) {
    //     console.log(err)
    // }

    // try {
    //     await knex.raw('\
    //         CREATE TABLE `' + tokenDailyTableName + '` (\
    //             `TOKENADDRESS` varchar(255) DEFAULT NULL,\
    //             `SWAPAT` timestamp NULL DEFAULT NULL,\
    //             `AVGPRICE` double DEFAULT NULL,\
    //             `MAXPRICE` double DEFAULT NULL,\
    //             `MINPRICE` double DEFAULT NULL,\
    //             `VOLUME` double DEFAULT NULL,\
    //             `SWAPCOUNT` int(11) DEFAULT NULL\
    //         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;\
    //     ')
    // } catch (err) {
    //     console.log(err)
    // }
    
    // try {
    //     await knex.raw('\
    //         ALTER TABLE `' + tokenDailyTableName + '`\
    //             ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);\
    //     ')
    // } catch (err) {
    //     console.log(err)
    // }
    
    // try {
    //     await knex.raw('\
    //         CREATE TABLE `' + changesTableName + '` (\
    //             `tokenAddress` varchar(255) NOT NULL,\
    //             `price24h` double DEFAULT 0,\
    //             `price12h` double DEFAULT 0,\
    //             `price6h` double DEFAULT 0,\
    //             `price2h` double DEFAULT 0,\
    //             `price1h` double DEFAULT 0,\
    //             `price30m` double DEFAULT 0,\
    //             `price5m` double DEFAULT 0,\
    //             `trans24h` int(11) DEFAULT 0,\
    //             `trans12h` int(11) DEFAULT 0,\
    //             `trans6h` int(11) DEFAULT 0,\
    //             `trans2h` int(11) DEFAULT 0,\
    //             `trans1h` int(11) DEFAULT 0,\
    //             `trans30m` int(11) DEFAULT 0,\
    //             `trans5m` int(11) DEFAULT 0,\
    //             `transToday` int(11) NOT NULL DEFAULT 0,\
    //             `volume24h` double NOT NULL DEFAULT 0\
    //         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;\
    //     ')
    // } catch (err) {
    //     console.log(err)
    // }
        
    // try {
    //     await knex.raw('\
    //         ALTER TABLE `' + changesTableName + '`\
    //             ADD PRIMARY KEY (`tokenAddress`) USING BTREE;\
    //     ')
    // } catch (err) {
    //     console.log(err)
    // }

    for (var i = 0; i < config.networks.length; i ++) {
        // if (config.networks[i] == 'eth') continue

        // try {
        //     await knex.raw('\
        //     CREATE TABLE `' + config.networks[i] + '_token_live` (\
        //         `tokenAddress` varchar(255) DEFAULT NULL,\
        //         `swapPrice` double DEFAULT NULL,\
        //         `swapAmount` double DEFAULT NULL,\
        //         `swapMaker` varchar(255) DEFAULT NULL,\
        //         `swapTransactionHash` varchar(255) DEFAULT NULL,\
        //         `swapAt` timestamp NULL DEFAULT NULL\
        //     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;\
        //     ')
        // } catch (err) {
        //     console.log(err)
        // }
        
        try {
            await knex.raw('\
            ALTER TABLE `' + config.networks[i] + '_pairs`\
                ADD COLUMN liquidity double NOT NULL DEFAULT 0,\
                ADD COLUMN updatedAt timestamp NULL DEFAULT NULL;\
            ')
        } catch (err) {
            console.log(err)
        }
    }

    console.log('CREATING TABLES FINISHED!')
}

async function init() {
    // await getAllPairs(FROMBLOCK)

    // await getTokenAndPairData()
    
    // myLogger.log('Getting token and pair data finished!')
    // myLogger.log(FROMBLOCK + '~' + TOBLOCK + ' ' + pastTableName)

    // await getTransactionHistory(FROMBLOCK)

    // await getUSDPrice()
    // await removeDuplicate()
    // await createTables()
    // getAllScanInfos()

    var rows = await knex('main_coins').select('*')

    for (var i = 0; i < rows.length; i ++) {
        await knex('main_coin_list').insert({
            tokenAddress: rows[i].coin_id,
            network: 'main',
            localImage: ''
        })
    }
}

init()

// getAllPairs(FROMBLOCK)

// getTokenAndPairData()
// .then(res => {
    // myLogger.log('Getting token and pair data finished!')
    // myLogger.log(FROMBLOCK + '~' + TOBLOCK + ' ' + pastTableName)

    // getTransactionHistory(FROMBLOCK)
// })

// getTokenAndPairData()
// .then(res => {
//     myLogger.log('Getting token and pair data finished!')
//     getUniswapV2PairPriceHistory()
// })

// addMissedTokens()
// getTokenSourceCodes()
// getTokenCoingeckoInfos()
// getTokenScanInfos()
// getContavoInfo()
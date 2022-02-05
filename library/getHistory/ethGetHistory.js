var fs = require('fs')
const config = require('../../config')
const process = require('process')
const HttpsProxyAgent = require('https-proxy-agent');
const axios = require('axios')
const utf8 = require('utf8')
const { JSDOM } = require('jsdom')

const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream("eth_" + process.argv[2] + ".txt"),
  stderr: fs.createWriteStream("eth_" + process.argv[2] + ".txt"),
});

var pastTableName = 'eth_past'

if (process.argv[2] != 0) {
    pastTableName = 'eth_past' + process.argv[2]
}

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

const web3 = new Web3(new Web3.providers.HttpProvider(config.ETH.web3Providers[process.argv[2]], options))

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
var FROMBLOCK = config.ETH.fromAndTo[process.argv[2]].FROMBLOCK
var TOBLOCK = config.ETH.fromAndTo[process.argv[2]].TOBLOCK

async function getTokenInfos(tokenAddress) {
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

async function getPairDecimals(pairAddress, createdAt) {
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
            res[0] = await getTokenInfos(token0Address)

            tokensData[token0Address] = {
                tokenDecimals: res[0][0],
                tokenSymbol: res[0][1],
                tokenName: res[0][2],
                createdAt: createdAt
            }

            knex('eth_tokens').insert({
                tokenAddress: token0Address,
                tokenDecimals: res[0][0],
                tokenSymbol: res[0][1],
                tokenName: res[0][2],
                createdAt: createdAt
            }).then(res => {})
            .catch(err => {})
        }

        if (tokensData[token1Address]) {
            res[1] = []
            res[1][0] = tokensData[token1Address].tokenDecimals
            res[1][1] = tokensData[token1Address].tokenSymbol
            res[1][2] = tokensData[token1Address].tokenName
        } else {
            res[1] = await getTokenInfos(token1Address)

            tokensData[token1Address] = {
                tokenDecimals: res[1][0],
                tokenSymbol: res[1][1],
                tokenName: res[1][2],
                createdAt: createdAt
            }

            knex('eth_tokens').insert({
                tokenAddress: token1Address,
                tokenDecimals: res[1][0],
                tokenSymbol: res[1][1],
                tokenName: res[1][2],
                createdAt: createdAt
            }).then(res => {})
            .catch(err => {})
        }

        return [res[1][0] - res[0][0], token0Address, token1Address]
    } catch (err) {
        // myLogger.log(pairAddress, token0Address, token1Address)
        // myLogger.log(err)
    }

    return 1
}

async function getTokenAndPairData() {
    var res = await knex('eth_tokens').select('*')

    myLogger.log(res.length)

    for (var i = 0; i < res.length; i ++) {
        tokensData[res[i].tokenAddress] = {
            tokenDecimals: res[i].tokenDecimals,
            tokenSymbol: res[i].tokenSymbol,
            tokenName: res[i].tokenName,
            createdAt: convertTimestampToString(res[i].createdAt, true)
        }
    }

    res = await knex('eth_pairs').select('*')

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

async function getAllPairs(fromBlock) {
    if (fromBlock > TOBLOCK) return

    try {
        var toBlock = fromBlock + 999

        if (toBlock > TOBLOCK) toBlock = TOBLOCK

        results = await Promise.all([
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

        myLogger.log('==================================================')
        myLogger.log('Block Range: ' + fromBlock + ' ~ ' + toBlock)
        myLogger.log('UNISWAP V2 PAIR CREATED: ' + results[0].length)
        myLogger.log('UNISWAP V3 POOL CREATED: ' + results[1].length)

        for (var i = 0; i < results[0].length; i ++) {
            try {
                var token0Address = '0x' + results[0][i].topics[1].substr(26, 40).toLowerCase()
                var token1Address = '0x' + results[0][i].topics[2].substr(26, 40).toLowerCase()
                var pairAddress = '0x' + results[0][i].data.substr(26, 40).toLowerCase()
                var factoryAddress = results[0][i].address.toLowerCase()
                var block = results[0][i].blockNumber
                var resBlock = await web3.eth.getBlock(block)
                var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
                var res = await getPairDecimals(pairAddress, tmpDate)
                var baseToken = tokensData[token0Address].createdAt < tokensData[token1Address].createdAt ? 0 : 1

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
                    await knex('eth_pairs').insert({
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
                    myLogger.log(err)
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
                var res = await getPairDecimals(pairAddress, tmpDate)
                var baseToken = tokensData[token0Address].createdAt < tokensData[token1Address].createdAt ? 0 : 1

                // myLogger.log('-------------------------------------------')
                // myLogger.log('V3 CREATED: ' + results[1][i].transactionHash)
        
                pairsData[pairAddress] = {
                    token0Address: token0Address,
                    token1Address: token1Address,
                    decimals: res[0],
                    baseToken: baseToken,
                    blockNumber: block,
                    transactionID: 0
                }
        
                try {
                    await knex('eth_pairs').insert({
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
                    myLogger.log(err)
                }
            } catch (err) {
                myLogger.log(err)
            }
        }
    } catch (err) {
        myLogger.log(err)
    }

    getAllPairs(toBlock + 1)
}

async function getOnePartTransactionHistory(fromBlock, toBlock) {
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

        myLogger.log('==================================================')
        myLogger.log('Block Range: ' + fromBlock + ' ~ ' + toBlock)
        myLogger.log('UNISWAP V2 SWAP: ' + results[0].length)
        myLogger.log('UNISWAP V3 SWAP: ' + results[1].length)

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
                var decimals = await getPairDecimals(pairAddress, tmpDate)
                var baseToken = tokensData[decimals[1]].createdAt < tokensData[decimals[2]].createdAt ? 0 : 1
                var isBuy = 0
                var transactionData = await web3.eth.getTransactionReceipt(transactionHash)
                var swapMaker = ""
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

                for (var j = 0; j < transactionData.logs.length; j ++) {
                    if (transactionData.logs[j].logIndex == transactionID) break;
                    if (transactionData.logs[j].topics[0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && transactionData.logs[j].address.toLowerCase() == baseAddress) {
                        if (isBuy) {
                            swapMaker = transactionData.logs[j].topics[2].substr(26, 40)
                        } else {
                            swapMaker = transactionData.logs[j].topics[1].substr(26, 40)
                        }
                    }
                }

                swapMaker = '0x' + swapMaker

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
                        await knex('eth_pairs').insert({
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
                        await knex('eth_pairs').update({
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
                        swapMaker: swapMaker
                    }

                    try {
                        // insertDatas.push(data)
                        await knex(pastTableName).insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                } else {
                    pairsData[pairAddress].blockNumber = block
                    pairsData[pairAddress].transactionID = transactionID

                    try {
                        await knex('eth_pairs').update({
                            blockNumber: block,
                            transactionID: transactionID,
                            lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)
                        }).where('pairAddress', pairAddress)
                    } catch (err) {
                        myLogger.log(err)
                    }

                    var data = {
                        pairAddress: pairAddress,
                        swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                        swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
                        swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
                        swapAt: tmpDate,
                        swapTransactionHash: transactionHash,
                        isBuy: isBuy,
                        swapMaker: swapMaker
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
                var decimals = await getPairDecimals(pairAddress, tmpDate)
                var baseToken = tokensData[decimals[1]].createdAt < tokensData[decimals[2]].createdAt ? 0 : 1
                var isBuy = 0
                var transactionData = await web3.eth.getTransactionReceipt(transactionHash)
                var swapMaker = ""
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

                for (var j = 0; j < transactionData.logs.length; j ++) {
                    if (transactionData.logs[j].logIndex == transactionID) break;
                    if (transactionData.logs[j].topics[0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && transactionData.logs[j].address.toLowerCase() == baseAddress) {
                        if (isBuy) {
                            swapMaker = transactionData.logs[j].topics[2].substr(26, 40)
                        } else {
                            swapMaker = transactionData.logs[j].topics[1].substr(26, 40)
                        }
                    }
                }

                swapMaker = '0x' + swapMaker

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
                        await knex('eth_pairs').insert({
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
                        await knex('eth_pairs').update({
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
                        swapMaker: swapMaker
                    }

                    try {
                        // insertDatas.push(data)
                        await knex(pastTableName).insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                } else {
                    pairsData[pairAddress].blockNumber = block
                    pairsData[pairAddress].transactionID = transactionID

                    try {
                        await knex('eth_pairs').update({
                            blockNumber: block,
                            transactionID: transactionID,
                            lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1)
                        }).where('pairAddress', pairAddress)
                    } catch (err) {
                        myLogger.log(err)
                    }

                    var data = {
                        pairAddress: pairAddress,
                        swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                        swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
                        swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
                        swapAt: tmpDate,
                        swapTransactionHash: transactionHash,
                        isBuy: isBuy,
                        swapMaker: swapMaker
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
        myLogger.log(err)
    }
}

async function writeTransactionHistoryFile(date) {
    var path = "../../database/ethereum"

    var rows = (await knex.raw('\
        SELECT\
            ' + pastTableName + '.pairAddress AS PAIRADDRESS,\
            CONCAT(YEAR( ' + pastTableName + '.swapAt ), "-", MONTH( ' + pastTableName + '.swapAt ), "-", DAY( ' + pastTableName + '.swapAt )) AS SWAPAT,\
            avg( ' + pastTableName + '.swapPrice ) AS AVGPRICE,\
            max( ' + pastTableName + '.swapPrice ) AS MAXPRICE,\
            min( ' + pastTableName + '.swapPrice ) AS MINPRICE,\
            sum( ' + pastTableName + '.swapAmount0 * ( eth_pairs.baseToken * 2 - 1 ) * ( ' + pastTableName + '.isBuy * - 2 + 1 ) ) AS VOLUME0,\
            sum( ' + pastTableName + '.swapAmount1 * ( eth_pairs.baseToken * - 2 + 1 ) * ( ' + pastTableName + '.isBuy * - 2 + 1 ) ) AS VOLUME1,\
            sum( ' + pastTableName + '.swapAmount0 ) AS TOTALVOLUME0,\
            sum( ' + pastTableName + '.swapAmount1 ) AS TOTALVOLUME1,\
            count( ' + pastTableName + '.swapMaker ) AS SWAPCOUNT \
        FROM\
            ' + pastTableName + '\
            LEFT JOIN eth_pairs ON eth_pairs.pairAddress = ' + pastTableName + '.pairAddress \
        WHERE\
            ' + pastTableName + '.swapAt<"' + date + ' ' + '00:00:00' + '"\
        GROUP BY\
            ' + pastTableName + '.pairAddress,\
            DATE( ' + pastTableName + '.swapAt ) \
        ORDER BY\
            DATE( ' + pastTableName + '.swapAt)'))[0]

    for (var i = 0; i < rows.length; i ++) {
        var fileName = path + '/transactions/' + rows[i].PAIRADDRESS + '.txt'
        fs.appendFile(fileName, JSON.stringify(rows[i]) + '\n', "utf8", (err) => { })
    }

    rows = (await knex.raw('select CONCAT(YEAR( ' + pastTableName + '.swapAt ), "-", MONTH( ' + pastTableName + '.swapAt ), "-", DAY( ' + pastTableName + '.swapAt )) AS SWAPAT, swapMaker as SWAPMAKER, pairAddress from ' + pastTableName + ' where ' + pastTableName + '.swapAt<"' + date + ' ' + '00:00:00' + '" order by swapAt'))[0]

    for (var i = 0; i < rows.length; i ++) {
        var fileName = path + '/swapers/' + rows[i].pairAddress + '.txt'
        fs.appendFile(fileName, JSON.stringify(rows[i]) + '\n', "utf8", (err) => { })
    }

    await knex(pastTableName).where('swapAt', '<', date + ' ' + '00:00:00').delete()

    myLogger.log("WRITE TRANSACTION HISTORY FILE FINISHED!!!")
}

async function getTransactionHistory(fromBlock) {
    if (fromBlock > TOBLOCK) {
        myLogger.log("GET TRANSACTION HISTORY FINISHED!!!")
        return
    }

    try {
        var v1 = 100
        var v2 = 50
        var toBlock = fromBlock + v1 - 1
        var funcs = []

        if (toBlock > TOBLOCK) toBlock = TOBLOCK

        myLogger.log("***************", fromBlock, toBlock, "***************")

        for (var i = fromBlock; i <= toBlock; i += v2) {
            var to = i + v2 - 1

            if (to > toBlock) to = toBlock

            funcs.push(getOnePartTransactionHistory(i, to))

            if (to == toBlock) break
        }

        await Promise.all(funcs)

        
        var resBlock

        if (!blocksData[fromBlock]) {
            resBlock = await web3.eth.getBlock(fromBlock)
            blocksData[fromBlock] = {timestamp: resBlock.timestamp}
        } else {
            resBlock = blocksData[fromBlock]
        }

        var tmpDate1 = convertTimestampToString(resBlock.timestamp * 1000, true)

        if (!blocksData[toBlock]) {
            resBlock = await web3.eth.getBlock(toBlock)
            blocksData[toBlock] = {timestamp: resBlock.timestamp}
        } else {
            resBlock = blocksData[toBlock]
        }

        var tmpDate2 = convertTimestampToString(resBlock.timestamp * 1000, true)

        if (tmpDate1.split(' ')[0] != tmpDate2.split(' ')[0]) {
            writeTransactionHistoryFile(tmpDate2.split(' ')[0])
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

    var rows = await knex('eth_pairs').select('*').where('lastPrice', '!=', 0)

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
                
                await knex('eth_pairs').update({
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

    var rows = await knex('eth_pairs').select('*').where('lastPrice', '!=', 0)

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
                
                await knex('eth_pairs').update({
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
    var tokens = await knex('eth_tokens').orderBy('createdAt', 'desc').where('sourceCode', '').select('*')

    myLogger.log('Tokens Length: ' + tokens.length)

    for (var i = 0; i < tokens.length; i ++) {
        myLogger.log(i)

        try {
            var sourceCode = ''
            // var otherInfos = ''

            try {
                var res = await axios.get(config.ETH.scanData.scanSite + '/api?module=contract&action=getsourcecode&address=' + tokens[i].tokenAddress + '&apikey=' + config.ETH.scanData.apiKey)

                sourceCode = res.data.result[0].SourceCode
            } catch (err) {

            }

            // try {
            //     var res1 = await axios.get('https://api.coingecko.com/api/v3/coins/' + config.ETH.scanData.coinID + '/contract/' + tokens[i].tokenAddress)

            //     otherInfos = JSON.stringify(res1.data)
            // } catch (err) {

            // }

            await knex('eth_tokens')
                .where('tokenAddress', tokens[i].tokenAddress)
                .update({
                    sourceCode: utf8.encode(sourceCode),
                    // otherInfos: utf8.encode(otherInfos)
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
    var tokens = await knex('eth_tokens').orderBy('createdAt', 'desc').where('coingeckoInfos', '').select('*')

    myLogger.log('Tokens Length: ' + tokens.length)

    for (var i = 0; i < tokens.length; i ++) {
        myLogger.log(i)

        try {
            // var sourceCode = ''
            var otherInfos = ''

            // try {
            //     var res = await axios.get(config.ETH.scanData.scanSite + '/api?module=contract&action=getsourcecode&address=' + tokens[i].tokenAddress + '&apikey=' + config.ETH.scanData.apiKey)

            //     sourceCode = res.data.result[0].SourceCode
            // } catch (err) {

            // }

            try {
                var res1 = await axios.get('https://api.coingecko.com/api/v3/coins/' + config.ETH.scanData.coinID + '/contract/' + tokens[i].tokenAddress)

                otherInfos = JSON.stringify(res1.data)
            } catch (err) {

            }

            await knex('eth_tokens')
                .where('tokenAddress', tokens[i].tokenAddress)
                .update({
                    // sourceCode: utf8.encode(sourceCode),
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

async function getOneTokenScanInfos(tokenAddress, proxy) {
    // console.log(tokenAddress, proxy)
    var res = await axios.get('https://etherscan.io/token/' + tokenAddress + '#balances', {
        // httpsAgent: new HttpsProxyAgent('https://' + proxy)
        // reconnect: {
        //     auto: true,
        //     delay: 5000, // ms
        //     maxAttempts: 5,
        //     onTimeout: false
        // },
        // keepAlive: true,
        // timeout: 20000,
        // headers:{
        //     'Access-Control-Allow-Origin': '*',
        //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
        // },
        // withCredentials: false,
        // httpsAgent: new HttpsProxyAgent('https://' + proxy)
    })
    var dom = new JSDOM(res.data)
    var totalSupply = 0
    
    try {
        totalSupply = dom.window.document.querySelector('span[title="Maximum Total Supply"]').parentElement.nextElementSibling.firstElementChild.getAttribute('title').replace(/,/g, '').replace(/ /g, '')
    } catch (err) {

    }

    var totalHolders = 0
    
    try {
        totalHolders = dom.window.document.querySelector('#sparkholderscontainer').previousElementSibling.textContent.split('(')[0].replace(/,/g, '').replace(/ /g, '').replace(new RegExp('\n', 'g'), '')
    } catch (err) {

    }

    var links = {}

    try {
        links['OfficialSite'] = dom.window.document.querySelector('#ContentPlaceHolder1_tr_officialsite_1').firstElementChild.childNodes[3].firstElementChild.getAttribute('href')
    } catch (err) {

    }

    try {
        var linkElems = dom.window.document.querySelector('.col-md-8 > .list-inline').childNodes
    
        for (var j = 0; j < linkElems.length; j ++) {
            try {
                var key = linkElems[j].firstElementChild.getAttribute('data-original-title').split(':')[0]

                if (key == 'Email') {
                    links[key] = 'mailto:' + linkElems[j].firstElementChild.getAttribute('data-original-title').substr(key.length + 2)
                } else {
                    if (key == 'Github') {
                        links[key] = 'https://' + linkElems[j].firstElementChild.getAttribute('href')
                    } else {
                        links[key] = linkElems[j].firstElementChild.getAttribute('href')
                    }
                }
            } catch (err) {
            }
        }
    } catch (err) {
    }

    res = await axios.get('https://etherscan.io/token/generic-tokenholders2?m=normal&a=' + tokenAddress, {
        // httpsAgent: new HttpsProxyAgent('https://' + proxy)
        // reconnect: {
        //     auto: true,
        //     delay: 5000, // ms
        //     maxAttempts: 5,
        //     onTimeout: false
        // },
        // keepAlive: true,
        // timeout: 20000,
        // headers:{
        //     'Access-Control-Allow-Origin': '*',
        //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
        // },
        // withCredentials: false,
        // httpsAgent: new HttpsProxyAgent('https://' + proxy)
    })
    dom = new JSDOM(res.data)

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

    await knex('eth_tokens').where('tokenAddress', tokenAddress).update({
        totalSupply: totalSupply,
        totalHolders: totalHolders,
        links: JSON.stringify(links),
        holders: JSON.stringify(holders)
    })
}

async function getTokenScanInfos() {
    var tokens = await knex('eth_tokens').orderBy('createdAt', 'desc').select('*')

    for (var i = 0; i < tokens.length; i += 5) {
        myLogger.log(i)
        var funcs = []

        for (var j = i; j < i + 5 && j < tokens.length; j ++) {
            funcs.push(getOneTokenScanInfos(tokens[j].tokenAddress, config.PROXY[j - i]))
            // await getOneTokenScanInfos(tokens[j].tokenAddress, config.PROXY[j - i])
        }

        try {
            await Promise.all(funcs)
        } catch (err) {
            myLogger.log(err)
        }

        await delay(500)
    }

    myLogger.log('Getting Token Scan Infos Finished!')
}

async function addMissedTokens() {
    var pairs = await knex('eth_pairs').orderBy('createdAt', 'asc').select('*')
    var tokens = await knex('eth_tokens').select('*')
    var tokenData = []

    for (var i = 0; i < tokens.length; i ++) {
        tokenData[tokens[i].tokenAddress] = true
    }

    myLogger.log('Pairs Length: ' + pairs.length)

    for (var i = 0; i < pairs.length; i ++) {
        try {
            if (!tokenData[pairs[i].token0Address]) {
                var res = await getTokenInfos(pairs[i].token0Address)

                await knex('eth_tokens').insert({
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

                await knex('eth_tokens').insert({
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

// getAllPairs(FROMBLOCK)

// getTokenAndPairData()
// .then(res => {
//     myLogger.log('Getting token and pair data finished!')
//     myLogger.log(FROMBLOCK + '~' + TOBLOCK + ' ' + pastTableName)

//     getTransactionHistory(FROMBLOCK)
// })

// getTokenAndPairData()
// .then(res => {
//     myLogger.log('Getting token and pair data finished!')
//     getUniswapV2PairPriceHistory()
// })

// addMissedTokens()
// getTokenSourceCodes()
// getTokenCoingeckoInfos()
getTokenScanInfos()
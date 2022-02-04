var fs = require('fs')
var path = require('path')

const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream("eth_live_" + convertTimestampToString(new Date())  + ".txt"),
  stderr: fs.createWriteStream("eth_live_" + convertTimestampToString(new Date())  + ".txt"),
});

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

const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/aHb_aSqhmtQHA9ekTkyfjhjRnwzyqNeM', options))
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
var lastBlockNumber = 14137477

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

            await knex('eth_tokens').insert({
                tokenAddress: token0Address,
                tokenDecimals: res[0][0],
                tokenSymbol: res[0][1],
                tokenName: res[0][2],
                createdAt: createdAt
            })
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

            await knex('eth_tokens').insert({
                tokenAddress: token1Address,
                tokenDecimals: res[1][0],
                tokenSymbol: res[1][1],
                tokenName: res[1][2],
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

async function writeTransactionHistoryFile(date) {
    var path = "../../database/ethereum"

    var rows = (await knex.raw('\
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
            eth_live.swapAt<"' + date + ' ' + '00:00:00' + '"\
        GROUP BY\
            eth_live.pairAddress,\
            DATE( eth_live.swapAt ) \
        ORDER BY\
            DATE( eth_live.swapAt)'))[0]

    for (var i = 0; i < rows.length; i ++) {
        var fileName = path + '/transactions/' + rows[i].PAIRADDRESS + '.txt'
        fs.appendFile(fileName, JSON.stringify(rows[i]) + '\n', "utf8", (err) => { })
    }

    rows = (await knex.raw('select CONCAT(YEAR( eth_live.swapAt ), "-", MONTH( eth_live.swapAt ), "-", DAY( eth_live.swapAt )) AS SWAPAT, swapMaker as SWAPMAKER, pairAddress from eth_live where eth_live.swapAt<"' + date + ' ' + '00:00:00' + '" order by swapAt'))[0]

    for (var i = 0; i < rows.length; i ++) {
        var fileName = path + '/swapers/' + rows[i].pairAddress + '.txt'
        fs.appendFile(fileName, JSON.stringify(rows[i]) + '\n', "utf8", (err) => { })
    }

    await knex('eth_live').where('swapAt', '<', date + ' ' + '00:00:00').delete()

    myLogger.log("WRITE TRANSACTION HISTORY FILE FINISHED!!!")
}

async function init() {
    try {
        var blockNumber = await web3.eth.getBlockNumber()
        var curBlock = blockNumber

        if (curBlock > lastBlockNumber + 99) {
            blockNumber = lastBlockNumber + 99
        }

        results = await Promise.all([
            web3.eth.getPastLogs({
                fromBlock: lastBlockNumber,
                toBlock: blockNumber,
                topics: ['0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9']
            }),
            web3.eth.getPastLogs({
                fromBlock: lastBlockNumber,
                toBlock: blockNumber,
                topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822']
            }),
            web3.eth.getPastLogs({
                fromBlock: lastBlockNumber,
                toBlock: blockNumber,
                topics: ['0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118']
            }),
            web3.eth.getPastLogs({
                fromBlock: lastBlockNumber,
                toBlock: blockNumber,
                topics: ['0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67']
            })
        ])

        myLogger.log('==================================================')
        myLogger.log('lastBlockNumber: ' + lastBlockNumber)
        myLogger.log('UNISWAP V2 PAIR CREATED: ' + results[0].length)
        myLogger.log('UNISWAP V2 SWAP        : ' + results[1].length)
        myLogger.log('UNISWAP V3 POOL CREATED: ' + results[2].length)
        myLogger.log('UNISWAP V3 SWAP        : ' + results[3].length)

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

                myLogger.log('-------------------------------------------')
                myLogger.log('V2 CREATED: ' + results[0][i].transactionHash)

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

            }            
        }

        for (var i = 0; i < results[1].length; i ++) {
            try {
                var amt0 = Number.parseInt(hexToBn(results[1][i].data.substr(2, 64)))
                var amt1 = Number.parseInt(hexToBn(results[1][i].data.substr(66, 64)))
                var amt2 = Number.parseInt(hexToBn(results[1][i].data.substr(130, 64)))
                var amt3 = Number.parseInt(hexToBn(results[1][i].data.substr(194, 64)))
                var swap0 = amt0 - amt2
                var swap1 = amt1 - amt3
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

                myLogger.log('-------------------------------------------')
                myLogger.log('V2 SWAP: ' + results[1][i].transactionHash)

                if (!pairsData[pairAddress]) {
                    pairsData[pairAddress] = {
                        token0Address: decimals[1],
                        token1Address: decimals[2],
                        decimals: decimals[0],
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
                        }).whereRaw('pairAddress="' + pairAddress + '" and (blockNumber<' + block + ' or (blockNumber=' + block + ' and transactionID<' + transactionID + '))')
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
                        await knex('eth_live').insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                } else if (pairsData[pairAddress].blockNumber < block || (pairsData[pairAddress].blockNumber == block && pairsData[pairAddress].transactionID < transactionID)) {
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
                        await knex('eth_live').insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                }
            } catch (err) {
                
            }
        }

        for (var i = 0; i < results[2].length; i ++) {
            try {
                var token0Address = '0x' + results[2][i].topics[1].substr(26, 40).toLowerCase()
                var token1Address = '0x' + results[2][i].topics[2].substr(26, 40).toLowerCase()
                var pairAddress = '0x' + results[2][i].data.substr(90, 40).toLowerCase()
                var factoryAddress = results[2][i].address.toLowerCase()
                var block = results[2][i].blockNumber
                var resBlock = await web3.eth.getBlock(block)
                var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
                var res = await getPairDecimals(pairAddress, tmpDate)
                var baseToken = tokensData[token0Address].createdAt < tokensData[token1Address].createdAt ? 0 : 1

                myLogger.log('-------------------------------------------')
                myLogger.log('V3 CREATED: ' + results[2][i].transactionHash)
        
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
                
            }
        }

        for (var i = 0; i < results[3].length; i ++) {
            try {
                var swap0 = Number.parseInt(hexToBn(results[3][i].data.substr(2, 64)))
                var swap1 = Number.parseInt(hexToBn(results[3][i].data.substr(66, 64)))
                var pairAddress = results[3][i].address.toLowerCase()
                var block = results[3][i].blockNumber
                var resBlock

                if (!blocksData[block]) {
                    resBlock = await web3.eth.getBlock(block)
                    blocksData[block] = {timestamp: resBlock.timestamp}
                } else {
                    resBlock = blocksData[block]
                }
                
                var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
                var transactionID = results[3][i].logIndex
                var transactionHash = results[3][i].transactionHash
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

                myLogger.log('-------------------------------------------')
                myLogger.log('V3 SWAP: ' + results[3][i].transactionHash)

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
                        }).whereRaw('pairAddress="' + pairAddress + '" and (blockNumber<' + block + ' or (blockNumber=' + block + ' and transactionID<' + transactionID + '))')
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
                        await knex('eth_live').insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                } else if (pairsData[pairAddress].blockNumber < block || (pairsData[pairAddress].blockNumber == block && pairsData[pairAddress].transactionID < transactionID)) {
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
                        await knex('eth_live').insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                }
            } catch (err) {
                
            }
        }

        var resBlock

        if (!blocksData[lastBlockNumber]) {
            resBlock = await web3.eth.getBlock(lastBlockNumber)
            blocksData[lastBlockNumber] = {timestamp: resBlock.timestamp}
        } else {
            resBlock = blocksData[lastBlockNumber]
        }

        var tmpDate1 = convertTimestampToString(resBlock.timestamp * 1000 - 7 * 86400 * 1000, true)

        if (!blocksData[blockNumber]) {
            resBlock = await web3.eth.getBlock(blockNumber)
            blocksData[blockNumber] = {timestamp: resBlock.timestamp}
        } else {
            resBlock = blocksData[blockNumber]
        }

        var tmpDate2 = convertTimestampToString(resBlock.timestamp * 1000 - 7 * 86400 * 1000, true)

        if (tmpDate1.split(' ')[0] != tmpDate2.split(' ')[0]) {
            writeTransactionHistoryFile(tmpDate2.split(' ')[0])
        }
        
        if (curBlock > blockNumber) {
            lastBlockNumber = blockNumber + 1
        } else {
            lastBlockNumber = blockNumber
        }
    } catch (err) {
        myLogger.log(err)
    }

    setTimeout(init, 100)
}

getTokenAndPairData()
.then(res => {
    init()
})

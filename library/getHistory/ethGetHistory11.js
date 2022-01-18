var fs = require('fs')
var path = require('path')

const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream("log_" + convertTimestampToString(new Date())  + ".txt"),
  stderr: fs.createWriteStream("log_" + convertTimestampToString(new Date())  + ".txt"),
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
    }
};

// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/SszaZPuxxxVhD6TKaCScBk7SQN4EEO8t', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/UhrdEQkkqcqwwlm9wOXnYx71ut5BNDTd', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/GwVYJ0rBAGMeeC7nkaVdBimTapbyssKC', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/KDRotLOmW8M21flLsKNaLN4IO5lB_6PN', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/fwJegFhgVtUiflVVpMRv0wV00g1CWW0p', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/L9M1slw79QVfDhr9v66G3UoN69gkHLew', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/GyQ7M-bgZiAfRJQ0cNduGGyTWaSOPKFg', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/yDKkjtKduNj3MOm6VS0NOq4K1oQGu3BY', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/ydhzzCYhpBSw5j9laeJ1MUavoXH7Yx0x', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/I6Ex4PhEd7lnlGDpOK4eZQ66ZtAi3t8H', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/pHiog1JCoRJEbpi3uPJT2-dV5zxcoXUJ', options))
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/gvEWEHmC6hIgX8E6eEe0Hm4uMeEZpQpX', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/Blyrrajz70B-xcvQMJE__h_k6XrLqPPo', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/rYh9vEbLLMy84dQmnEERywb0LLHaB-ed', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/TrnxMJ2lhHLjpN7BBM0CaCENbBVKoIRT', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/0-eOaucZ3wiI_2qkj6W4ExfohXDmaRjw', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/gwQXpDW7dSs1cCCWM2elWLX7g1pe9tfu', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/0_DTvXZh-Y7iIZppUg_yPfpDcdOG6M3t', options))
// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/gSyeUk2nIKtZMC_7xU1DnrB3DWeaXiRm', options))

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
    //   user : 'admin_root',
    //   password : 'bOPTDZXP8Xvdf9I1',
    //   database : 'admin_ethereum_api'
      user : 'root',
      password : '',
      database : 'ethereum_api'
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
// var FROMBLOCK = 14003767
// var TOBLOCK = 14026168

// var FROMBLOCK = 10100000
// var TOBLOCK = 10505861
// var FROMBLOCK = 10505861
// var TOBLOCK = 10700231
// var FROMBLOCK = 10700231
// var TOBLOCK = 10902387
// var FROMBLOCK = 10902387
// var TOBLOCK = 11102639
// var FROMBLOCK = 11102639
// var TOBLOCK = 11304643
// var FROMBLOCK = 11304643
// var TOBLOCK = 11506373
// var FROMBLOCK = 11506373
// var TOBLOCK = 11701952
// var FROMBLOCK = 11701952
// var TOBLOCK = 11903480
// var FROMBLOCK = 11903480
// var TOBLOCK = 12104733
// var FROMBLOCK = 12104733
// var TOBLOCK = 12306079
// var FROMBLOCK = 12306079
// var TOBLOCK = 12500189
var FROMBLOCK = 12500189
var TOBLOCK = 12699965
// var FROMBLOCK = 12699965
// var TOBLOCK = 12898513
// var FROMBLOCK = 12898513
// var TOBLOCK = 13104132
// var FROMBLOCK = 13104132
// var TOBLOCK = 13304528
// var FROMBLOCK = 13304528
// var TOBLOCK = 13502421
// var FROMBLOCK = 13502421
// var TOBLOCK = 13699125
// var FROMBLOCK = 13699125
// var TOBLOCK = 13903355
// var FROMBLOCK = 13903355
// var TOBLOCK = 14026168

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
                        await knex('eth_past11').insert(data)
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
                        await knex('eth_past11').insert(data)
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
                        await knex('eth_past11').insert(data)
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
                        await knex('eth_past11').insert(data)
                    } catch (err) {
                        myLogger.log(err)
                    }
                }
            } catch (err) {
                myLogger.log(err)
            }
        }

        if (insertDatas.length) {
            // await knex('eth_past11').insert(insertDatas)
        }
    } catch (err) {
        myLogger.log(err)
    }
}

async function writeTransactionHistoryFile(date) {
    var path = "../../database/ethereum"

    var rows = (await knex.raw('\
        SELECT\
            eth_past11.pairAddress AS PAIRADDRESS,\
            CONCAT(YEAR( eth_past11.swapAt ), "-", MONTH( eth_past11.swapAt ), "-", DAY( eth_past11.swapAt )) AS SWAPAT,\
            avg( eth_past11.swapPrice ) AS AVGPRICE,\
            max( eth_past11.swapPrice ) AS MAXPRICE,\
            min( eth_past11.swapPrice ) AS MINPRICE,\
            sum( eth_past11.swapAmount0 * ( eth_pairs.baseToken * 2 - 1 ) * ( eth_past11.isBuy * - 2 + 1 ) ) AS VOLUME0,\
            sum( eth_past11.swapAmount1 * ( eth_pairs.baseToken * - 2 + 1 ) * ( eth_past11.isBuy * - 2 + 1 ) ) AS VOLUME1,\
            sum( eth_past11.swapAmount0 ) AS TOTALVOLUME0,\
            sum( eth_past11.swapAmount1 ) AS TOTALVOLUME1,\
            count( eth_past11.swapMaker ) AS SWAPCOUNT \
        FROM\
            eth_past11\
            LEFT JOIN eth_pairs ON eth_pairs.pairAddress = eth_past11.pairAddress \
        WHERE\
            eth_past11.swapAt<"' + date + ' ' + '00:00:00' + '"\
        GROUP BY\
            eth_past11.pairAddress,\
            DATE( eth_past11.swapAt ) \
        ORDER BY\
            DATE( eth_past11.swapAt)'))[0]

    for (var i = 0; i < rows.length; i ++) {
        var fileName = path + '/transactions/' + rows[i].PAIRADDRESS + '.txt'
        fs.appendFile(fileName, JSON.stringify(rows[i]) + '\n', "utf8", (err) => { })
    }

    rows = (await knex.raw('select CONCAT(YEAR( eth_past11.swapAt ), "-", MONTH( eth_past11.swapAt ), "-", DAY( eth_past11.swapAt )) AS SWAPAT, swapMaker as SWAPMAKER, pairAddress from eth_past11 where eth_past11.swapAt<"' + date + ' ' + '00:00:00' + '" order by swapAt'))[0]

    for (var i = 0; i < rows.length; i ++) {
        var fileName = path + '/swapers/' + rows[i].pairAddress + '.txt'
        fs.appendFile(fileName, JSON.stringify(rows[i]) + '\n', "utf8", (err) => { })
    }

    await knex('eth_past11').where('swapAt', '<', date + ' ' + '00:00:00').delete()

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

// getAllPairs(FROMBLOCK)

getTokenAndPairData()
.then(res => {
    myLogger.log('Getting token and pair data finished!')
    myLogger.log(FROMBLOCK + '~' + TOBLOCK + ' eth_past11')

    getTransactionHistory(FROMBLOCK)
})
var fs = require('fs')
var path = require('path')

Web3 = require('web3')

//const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/9ea3677d970d4dc99f3f559768b0176c'))
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

const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/_732q-Q7bDxHrmyOqA-oazz3r1LBJKx5', options))
const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
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

var tokensData = []
var pairsData = []
var lastBlockNumber = 13976468

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
    /*
    var rows = await knex('eth_pairs').where('pairAddress', pairAddress).select('*')
    var token0Address, token1Address
    var res = []
    
    if (rows.length) {
        token0Address = rows[0].token0Address
        token1Address = rows[0].token1Address
    } else {
        var pairContract = new web3.eth.Contract(minPairABI, pairAddress)
        var tmpToken0Address, tmpToken1Address

        [tmpToken0Address, tmpToken1Address] = await Promise.all([pairContract.methods.token0().call(), pairContract.methods.token1().call()])
        token0Address = tmpToken0Address
        token1Address = tmpToken1Address
    }*/

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
        console.log(pairAddress, token0Address, token1Address)
        console.log(err)
    }

    return 1
}

function convertTimestampToString(timestamp, flag = false) {
    if (flag == false) {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
    } else {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

async function init() {
    try {
        var blockNumber = await web3.eth.getBlockNumber()

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

        console.log('==================================================')
        console.log('lastBlockNumber: ' + lastBlockNumber)
        console.log('UNISWAP V2 PAIR CREATED: ' + results[0].length)
        console.log('UNISWAP V2 SWAP        : ' + results[1].length)
        console.log('UNISWAP V3 POOL CREATED: ' + results[2].length)
        console.log('UNISWAP V3 SWAP        : ' + results[3].length)

        lastBlockNumber = blockNumber

        for (var i = 0; i < results[0].length; i ++) {
            var token0Address = '0x' + results[0][i].topics[1].substr(26, 40).toLowerCase()
            var token1Address = '0x' + results[0][i].topics[2].substr(26, 40).toLowerCase()
            var pairAddress = '0x' + results[0][i].data.substr(26, 40).toLowerCase()
            var factoryAddress = results[0][i].address.toLowerCase()
            var block = results[0][i].blockNumber
            var resBlock = await web3.eth.getBlock(block)
            var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
            var res = await getPairDecimals(pairAddress, tmpDate)

            console.log('-------------------------------------------')
            console.log('V2 CREATED: ' + results[0][i].transactionHash)

            pairsData[pairAddress] = {
                token0Address: token0Address,
                token1Address: token1Address,
                decimals: res[0],
                blockNumber: block,
                transactionID: 0
            }

            try {
                await knex('eth_pairs').insert({
                    token0Address: token0Address,
                    token1Address: token1Address,
                    pairAddress: pairAddress,
                    createdAt: tmpDate,
                    factoryAddress: factoryAddress,
                    blockNumber: block,
                    transactionID: 0
                })
            } catch (err) {
                console.log(err)
            }
        }

        for (var i = 0; i < results[1].length; i ++) {
            var amt0 = Number.parseInt(hexToBn(results[1][i].data.substr(2, 64)))
            var amt1 = Number.parseInt(hexToBn(results[1][i].data.substr(66, 64)))
            var amt2 = Number.parseInt(hexToBn(results[1][i].data.substr(130, 64)))
            var amt3 = Number.parseInt(hexToBn(results[1][i].data.substr(194, 64)))
            var swap0 = amt2 - amt0
            var swap1 = amt3 - amt1
            var pairAddress = results[1][i].address.toLowerCase()
            var block = results[1][i].blockNumber
            var transactionID = results[1][i].logIndex

            //var curDate = new Date(new Date().toUTCString())
            //var curTimeString = convertTimestampToString(curDate.getTime(), true)
            //var fileName = '../../database/liveInfo/' + pairAddress + '_' + curTimeString + '.txt'
            //fs.appendFile(fileName, JSON.stringify(data) + '\n', "utf8", (err) => { })

            console.log('-------------------------------------------')
            console.log('V2 SWAP: ' + results[1][i].transactionHash)

            var decimals = await getPairDecimals(pairAddress)

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
                        transactionID: transactionID
                    })
                } catch (err) {
                    await knex('eth_pairs').update({
                        blockNumber: block,
                        transactionID: transactionID
                    }).whereRaw('pairAddress="' + pairAddress + '" and (blockNumber<' + block + ' or (blockNumber=' + block + ' and transactionID<' + transactionID + '))')
                }

                var res = await web3.eth.getBlock(block)
                var tmp = convertTimestampToString(res.timestamp * 1000).split('_')
                var data = {
                    pairAddress: pairAddress,
                    swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                    swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
                    swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
                    swapDate: tmp[0] + '-' + tmp[1] + '-' + tmp[2],
                    swapTime: tmp[3] + ':' + tmp[4] + ':' + tmp[5]
                }

                try {
                    await knex('eth_live').insert(data)
                } catch (err) {
                    console.log(err)
                }
            } else if (pairsData[pairAddress].blockNumber < block || (pairsData[pairAddress].blockNumber == block && pairsData[pairAddress].transactionID < transactionID)) {
                pairsData[pairAddress].blockNumber = block
                pairsData[pairAddress].transactionID = transactionID

                try {
                    await knex('eth_pairs').update({
                        blockNumber: block,
                        transactionID: transactionID
                    }).where('pairAddress', pairAddress)
                } catch (err) {
                    console.log(err)
                }

                var res = await web3.eth.getBlock(block)
                var tmp = convertTimestampToString(res.timestamp * 1000).split('_')
                var data = {
                    pairAddress: pairAddress,
                    swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                    swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
                    swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
                    swapDate: tmp[0] + '-' + tmp[1] + '-' + tmp[2],
                    swapTime: tmp[3] + ':' + tmp[4] + ':' + tmp[5]
                }

                try {
                    await knex('eth_live').insert(data)
                } catch (err) {
                    console.log(err)
                }
            }
        }

        for (var i = 0; i < results[2].length; i ++) {
            var token0Address = '0x' + results[2][i].topics[1].substr(26, 40).toLowerCase()
            var token1Address = '0x' + results[2][i].topics[2].substr(26, 40).toLowerCase()
            var pairAddress = '0x' + results[2][i].data.substr(90, 40).toLowerCase()
            var factoryAddress = results[2][i].address.toLowerCase()
            var block = results[2][i].blockNumber
            var res = await getPairDecimals(pairAddress)

            console.log('-------------------------------------------')
            console.log('V3 CREATED: ' + results[2][i].transactionHash)
    
            pairsData[pairAddress] = {
                token0Address: token0Address,
                token1Address: token1Address,
                decimals: res[0],
                blockNumber: block,
                transactionID: 0
            }
    
            try {
                await knex('eth_pairs').insert({
                    token0Address: token0Address,
                    token1Address: token1Address,
                    pairAddress: pairAddress,
                    factoryAddress: factoryAddress,
                    blockNumber: block,
                    transactionID: 0
                })
            } catch (err) {
                console.log(err)
            }
        }

        for (var i = 0; i < results[3].length; i ++) {
            // console.log("===================== UNISWAP V3 SWAP ====================")
            // console.log(data.transactionHash)
            // var swap0 = Number.parseInt(hexToBn(data.data.substr(2, 64)))
            // var swap1 = Number.parseInt(hexToBn(data.data.substr(66, 64)))

            // getPairDecimals(data.address)
            // .then(decimals => {
            //     web3.eth.getBlock(data.blockNumber).then(res => {
            //         knex('eth_pairs').insert({
            //             pairAddress: data.address.toLowerCase(),
            //             lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals / swap1),
            //             timestamp: res.timestamp
            //         }).then(res => { })
            //         .catch(err => {
            //             knex('eth_pairs').update({
            //                 lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals / swap1),
            //                 timestamp: res.timestamp
            //             }).where('pairAddress', data.address.toLowerCase())
            //             .then(res => { }) 
            //         })      
            //     })
            // })
            var swap0 = Number.parseInt(hexToBn(results[3][i].data.substr(2, 64)))
            var swap1 = Number.parseInt(hexToBn(results[3][i].data.substr(66, 64)))
            var pairAddress = results[3][i].address.toLowerCase()
            var block = results[3][i].blockNumber
            var transactionID = results[3][i].logIndex

            console.log('-------------------------------------------')
            console.log('V3 SWAP: ' + results[3][i].transactionHash)

            if (!pairsData[pairAddress]) {
                var decimals = await getPairDecimals(pairAddress)

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
                        transactionID: transactionID
                    })
                } catch (err) {
                    await knex('eth_pairs').update({
                        blockNumber: block,
                        transactionID: transactionID
                    }).whereRaw('pairAddress="' + pairAddress + '" and (blockNumber<' + block + ' or (blockNumber=' + block + ' and transactionID<' + transactionID + '))')
                }

                var res = await web3.eth.getBlock(block)
                var tmp = convertTimestampToString(res.timestamp * 1000).split('_')
                var data = {
                    pairAddress: pairAddress,
                    swapPrice: Math.abs(swap0 * 1.0 * 10 ** decimals[0] / swap1),
                    swapAmount0: Math.abs(swap0 / 10 ** tokensData[decimals[1]].tokenDecimals),
                    swapAmount1: Math.abs(swap1 / 10 ** tokensData[decimals[2]].tokenDecimals),
                    swapDate: tmp[0] + '-' + tmp[1] + '-' + tmp[2],
                    swapTime: tmp[3] + ':' + tmp[4] + ':' + tmp[5]
                }

                try {
                    await knex('eth_live').insert(data)
                } catch (err) {
                    console.log(err)
                }
            } else if (pairsData[pairAddress].blockNumber < block || (pairsData[pairAddress].blockNumber == block && pairsData[pairAddress].transactionID < transactionID)) {
                pairsData[pairAddress].blockNumber = block
                pairsData[pairAddress].transactionID = transactionID

                try {
                    await knex('eth_pairs').update({
                        blockNumber: block,
                        transactionID: transactionID
                    }).where('pairAddress', pairAddress)
                } catch (err) {
                    console.log(err)
                }

                var res = await web3.eth.getBlock(block)
                var tmp = convertTimestampToString(res.timestamp * 1000).split('_')
                var data = {
                    pairAddress: pairAddress,
                    swapPrice: Math.abs(swap0 * 1.0 * 10 ** pairsData[pairAddress].decimals / swap1),
                    swapAmount0: Math.abs(swap0 / 10 ** tokensData[pairsData[pairAddress].token0Address].tokenDecimals),
                    swapAmount1: Math.abs(swap1 / 10 ** tokensData[pairsData[pairAddress].token1Address].tokenDecimals),
                    swapDate: tmp[0] + '-' + tmp[1] + '-' + tmp[2],
                    swapTime: tmp[3] + ':' + tmp[4] + ':' + tmp[5]
                }

                try {
                    await knex('eth_live').insert(data)
                } catch (err) {
                    console.log(err)
                }
            }
        }
    } catch (err) {
        console.log(err)
    }

    setTimeout(init, 10000)
    /*
    web3.eth.subscribe('logs', {
        topics: ['0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9']
    }, function(error, result){
        if (error)
            console.log(error)
    })
    .on("data", function(data){
        console.log("===================== UNISWAP V2 PAIR CREATED ====================")
        console.log(data.transactionHash);
        var token0Address = '0x' + data.topics[1].substr(26, 40).toLowerCase()
        var token1Address = '0x' + data.topics[2].substr(26, 40).toLowerCase()
        knex('eth_pairs').insert({
            token0Address: token0Address,
            token1Address: token1Address,
            pairAddress: '0x' + data.data.substr(26, 40).toLowerCase(),
            factoryAddress: data.address.toLowerCase()
        }).then(res => {
        })
        .catch(err => {
            console.log(err)
        })
    })

    web3.eth.subscribe('logs', {
        topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822']
    }, function(error, result){
        if (error)
            console.log(error)
    })
    .on("data", function(data){
        console.log("===================== UNISWAP V2 SWAP ====================")
        console.log(data.transactionHash);
        var amt0 = Number.parseInt(hexToBn(data.data.substr(2, 64)))
        var amt1 = Number.parseInt(hexToBn(data.data.substr(66, 64)))
        var amt2 = Number.parseInt(hexToBn(data.data.substr(130, 64)))
        var amt3 = Number.parseInt(hexToBn(data.data.substr(194, 64)))
        var swap0 = amt0 + amt2
        var swap1 = amt1 + amt3

        getPairDecimals(data.address)
        .then(decimals => {
            web3.eth.getBlock(data.blockNumber).then(res => {
                knex('eth_pairs').insert({
                    pairAddress: data.address.toLowerCase(),
                    lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals / swap1),
                    timestamp: res.timestamp
                }).then(res => { })
                .catch(err => {
                    knex('eth_pairs').update({
                        lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals / swap1),
                        timestamp: res.timestamp
                    }).where('pairAddress', data.address.toLowerCase())
                    .then(res => { }) 
                })      
            })
        })
    })

    web3.eth.subscribe('logs', {
        topics: ['0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118']
    }, function(error, result){
        if (error)
            console.log(error)
    })
    .on("data", function(data){
        console.log("===================== UNISWAP V3 POOL CREATED ====================")
        console.log(data.transactionHash);
        knex('eth_pairs').insert({
            token0Address: '0x' + data.topics[1].substr(26, 40).toLowerCase(),
            token1Address: '0x' + data.topics[2].substr(26, 40).toLowerCase(),
            pairAddress: '0x' + data.data.substr(90, 40).toLowerCase(),
            factoryAddress: data.address.toLowerCase()
        }).then(res => { })
        .catch(err => {
            console.log(err)
        })
    })

    web3.eth.subscribe('logs', {
        topics: ['0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67']
    }, function(error, result){
        if (error)
            console.log(error);
    })
    .on("data", function(data){
        console.log("===================== UNISWAP V3 SWAP ====================")
        console.log(data.transactionHash)
        var swap0 = Number.parseInt(hexToBn(data.data.substr(2, 64)))
        var swap1 = Number.parseInt(hexToBn(data.data.substr(66, 64)))

        getPairDecimals(data.address)
        .then(decimals => {
            web3.eth.getBlock(data.blockNumber).then(res => {
                knex('eth_pairs').insert({
                    pairAddress: data.address.toLowerCase(),
                    lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals / swap1),
                    timestamp: res.timestamp
                }).then(res => { })
                .catch(err => {
                    knex('eth_pairs').update({
                        lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals / swap1),
                        timestamp: res.timestamp
                    }).where('pairAddress', data.address.toLowerCase())
                    .then(res => { }) 
                })      
            })
        })
    })
    */
}

init()
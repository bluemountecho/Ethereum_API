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

function convertTimestampToString(timestamp, flag = false) {
    if (flag == false) {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
    } else {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

var tokensData = []
var pairsData = []
var FROMBLOCK = 0
var TOBLOCK = 13997110

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

        console.log('==================================================')
        console.log('Block Range: ' + fromBlock + ' ~ ' + toBlock)
        console.log('UNISWAP V2 PAIR CREATED: ' + results[0].length)
        console.log('UNISWAP V3 POOL CREATED: ' + results[1].length)

        for (var i = 0; i < results[0].length; i ++) {
            var token0Address = '0x' + results[0][i].topics[1].substr(26, 40).toLowerCase()
            var token1Address = '0x' + results[0][i].topics[2].substr(26, 40).toLowerCase()
            var pairAddress = '0x' + results[0][i].data.substr(26, 40).toLowerCase()
            var factoryAddress = results[0][i].address.toLowerCase()
            var block = results[0][i].blockNumber
            var resBlock = await web3.eth.getBlock(block)
            var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
            var res = await getPairDecimals(pairAddress, tmpDate)
            var baseToken = tokensData[token0Address].createdAt < tokensData[token1Address].createdAt ? 0 : 1

            console.log('-------------------------------------------')
            console.log('V2 CREATED: ' + results[0][i].transactionHash)

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
                console.log(err)
            }
        }

        for (var i = 0; i < results[1].length; i ++) {
            var token0Address = '0x' + results[1][i].topics[1].substr(26, 40).toLowerCase()
            var token1Address = '0x' + results[1][i].topics[2].substr(26, 40).toLowerCase()
            var pairAddress = '0x' + results[1][i].data.substr(90, 40).toLowerCase()
            var factoryAddress = results[1][i].address.toLowerCase()
            var block = results[1][i].blockNumber
            var resBlock = await web3.eth.getBlock(block)
            var tmpDate = convertTimestampToString(resBlock.timestamp * 1000, true)
            var res = await getPairDecimals(pairAddress, tmpDate)
            var baseToken = tokensData[token0Address].createdAt < tokensData[token1Address].createdAt ? 0 : 1

            console.log('-------------------------------------------')
            console.log('V3 CREATED: ' + results[1][i].transactionHash)
    
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
                console.log(err)
            }
        }
    } catch (err) {
        console.log(err)
    }

    getAllPairs(toBlock + 1)
}

getAllPairs(FROMBLOCK)
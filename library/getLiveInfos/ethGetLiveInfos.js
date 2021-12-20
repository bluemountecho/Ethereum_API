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
        "name": "totalSupply",
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

const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://eth-mainnet.alchemyapi.io/v2/I8IUQHQ-q9Wb5nDDcco__u0bPhqYDUjr'))
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

async function getTokenInfos(tokenAddress) {
    const contract = new web3.eth.Contract(minERC20ABI, tokenAddress)
    var decimals, symbol, name, totalSupply

    [decimals, symbol, name, totalSupply] = await Promise.all([
        contract.methods.decimals().call(),
        contract.methods.symbol().call(),
        contract.methods.name().call(),
        contract.methods.totalSupply().call()
    ])

    return [decimals, symbol, name, totalSupply]
}

async function getPairDecimals(pairAddress) {
    var pairContract = new web3.eth.Contract(minPairABI, pairAddress)
    var token0Address, token1Address

    [token0Address, token1Address] = await Promise.all([pairContract.methods.token0().call(), pairContract.methods.token1().call()])
    
    var res = await Promise.all([
        getTokenInfos(token0Address),
        getTokenInfos(token1Address)
    ])

    return res[1][0] - res[0][0]
}

async function init() {
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
}

init()
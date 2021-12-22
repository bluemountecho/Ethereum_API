Web3 = require('web3')

const FROMBLOCK = 0
const TOBLOCK = 13847794

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

const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/I8IUQHQ-q9Wb5nDDcco__u0bPhqYDUjr'))
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
    try {
        const contract = new web3.eth.Contract(minERC20ABI, tokenAddress)
        var decimals, symbol, name, totalSupply

        [decimals, symbol, name, totalSupply] = await Promise.all([
            contract.methods.decimals().call(),
            contract.methods.symbol().call(),
            contract.methods.name().call(),
            contract.methods.totalSupply().call()
        ])
    
        return [decimals, symbol, name, totalSupply]
    } catch (err) {
        const contract = new web3.eth.Contract(minDSTokenABI, tokenAddress)
        var decimals, symbol, name, totalSupply

        [decimals, symbol, name, totalSupply] = await Promise.all([
            contract.methods.decimals().call(),
            contract.methods.symbol().call(),
            contract.methods.name().call(),
            contract.methods.totalSupply().call()
        ])

        symbol = web3.utils.hexToUtf8(symbol)
        name = web3.utils.hexToUtf8(name)
    
        return [decimals, symbol, name, totalSupply]
    }    
}

async function getPairDecimals(pairAddress) {
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

    var pairContract = new web3.eth.Contract(minPairABI, pairAddress)
    var token0Address, token1Address
    var res = []

    try {
        [token0Address, token1Address] = await Promise.all([pairContract.methods.token0().call(), pairContract.methods.token1().call()])

        rows = await knex('eth_tokens').where('tokenAddress', token0Address.toLowerCase())

        if (rows.length) {
            res[0] = []
            res[0][0] = rows[0].tokenDecimals
            res[0][1] = rows[0].tokenSymbol
            res[0][2] = rows[0].tokenName
            res[0][3] = rows[0].totalSupply
        } else {
            res[0] = await getTokenInfos(token0Address)
            knex('eth_tokens').insert({
                tokenAddress: token0Address.toLowerCase(),
                tokenDecimals: res[0][0],
                tokenSymbol: res[0][1],
                tokenName: res[0][2],
                totalSupply: res[0][3]
            }).then(res => {})
            .catch(err => {})
        }

        rows = await knex('eth_tokens').where('tokenAddress', token1Address.toLowerCase())

        if (rows.length) {
            res[1] = []
            res[1][0] = rows[0].tokenDecimals
            res[1][1] = rows[0].tokenSymbol
            res[1][2] = rows[0].tokenName
            res[1][3] = rows[0].totalSupply
        } else {
            res[1] = await getTokenInfos(token1Address)
            knex('eth_tokens').insert({
                tokenAddress: token1Address.toLowerCase(),
                tokenDecimals: res[1][0],
                tokenSymbol: res[1][1],
                tokenName: res[1][2],
                totalSupply: res[1][3]
            }).then(res => {})
            .catch(err => {})
        }

        return res[1][0] - res[0][0]
    } catch (err) {
        console.log(pairAddress, token0Address, token1Address)
        console.log(err)
    }

    return 1
}

async function getUniswapV2PairHistory() {
    var fromBlock = FROMBLOCK, toBlock = TOBLOCK
    var sum = 0

    for (var i = fromBlock; i < toBlock; i += 10000) {
        var from = i
        var to = i + 9999

        if (to > toBlock) to = toBlock
        
        let options = {
            fromBlock: from,
            toBlock: to,
            topics: ['0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9']
        };

        results = await web3.eth.getPastLogs(options)

        for (var j = 0; j < results.length; j ++) {
            await getPairDecimals('0x' + results[j].data.substr(26, 40).toLowerCase())

            try {
                await knex('eth_pairs').insert({
                    token0Address: '0x' + results[j].topics[1].substr(26, 40).toLowerCase(),
                    token1Address: '0x' + results[j].topics[2].substr(26, 40).toLowerCase(),
                    pairAddress: '0x' + results[j].data.substr(26, 40).toLowerCase(),
                    factoryAddress: results[j].address.toLowerCase()
                })
            } catch (err) {
                await knex('eth_pairs').update({
                    token0Address: '0x' + results[j].topics[1].substr(26, 40).toLowerCase(),
                    token1Address: '0x' + results[j].topics[2].substr(26, 40).toLowerCase(),
                    factoryAddress: results[j].address.toLowerCase()
                }).where('pairAddress', '0x' + results[j].data.substr(26, 40).toLowerCase())
            }
        }

        console.log(i, results.length)
        sum += results.length
    }

    console.log('Finished with ' + sum + ' rows!')
}

async function getUniswapV3PairHistory() {
    var fromBlock = FROMBLOCK, toBlock = TOBLOCK
    var sum = 0

    for (var i = fromBlock; i < toBlock; i += 10000) {
        var from = i
        var to = i + 9999

        if (to > toBlock) to = toBlock

        try {
            let options = {
                fromBlock: from,
                toBlock: to,
                topics: ['0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118']
            };
    
            results = await web3.eth.getPastLogs(options)
    
            for (var j = 0; j < results.length; j ++) {
                await getPairDecimals('0x' + results[j].data.substr(90, 40).toLowerCase())

                try {
                    await knex('eth_pairs').insert({
                        token0Address: '0x' + results[j].topics[1].substr(26, 40).toLowerCase(),
                        token1Address: '0x' + results[j].topics[2].substr(26, 40).toLowerCase(),
                        pairAddress: '0x' + results[j].data.substr(90, 40).toLowerCase(),
                        factoryAddress: results[j].address.toLowerCase()
                    })
                } catch (err) {
                    await knex('eth_pairs').update({
                        token0Address: '0x' + results[j].topics[1].substr(26, 40).toLowerCase(),
                        token1Address: '0x' + results[j].topics[2].substr(26, 40).toLowerCase(),
                        factoryAddress: results[j].address.toLowerCase()
                    }).where('pairAddress', '0x' + results[j].data.substr(90, 40).toLowerCase())
                }
            }
        } catch (err) {
            console.log(err)
        }

        console.log(i, results.length)
        sum += results.length
    }

    console.log('Finished with ' + sum + ' rows!')
}

async function getUniswapV2PairPriceHistory() {
    var fromBlock = TOBLOCK, toBlock = FROMBLOCK
    var sum = 0
    var isVisit = []
    var decimalList = []
    var pairList = []

    var rows = await knex('eth_pairs').select('*').where('lastPrice', '!=', 0)

    for (var i = 0; i < rows.length; i ++) {
        isVisit[rows[i].pairAddress] = true
        pairList[rows[i].pairAddress] = {
            token0Address: rows[i].token0Address,
            token1Address: rows[i].token1Address
        }
    }

    rows = await knex('eth_tokens').select('*')

    for (var i = 0; i < rows.length; i ++) {
        decimalList[rows[i].tokenAddress] = rows[i].tokenDecimals
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
                var swap0 = amt0 + amt2
                var swap1 = amt1 + amt3

                var decimal0 = -1
                var decimal1 = -1
                var decimals = 0

                if (pairList[results[j].address.toLowerCase()] && decimalList[pairList[results[j].address.toLowerCase()].token0Address]) {
                    decimal0 = decimalList[pairList[results[j].address.toLowerCase()].token0Address]
                }

                if (pairList[results[j].address.toLowerCase()] && decimalList[pairList[results[j].address.toLowerCase()].token1Address]) {
                    decimal1 = decimalList[pairList[results[j].address.toLowerCase()].token1Address]
                }
                
                if (decimal0 != -1 && decimal1 != -1) {
                    decimals = decimal1 - decimal0
                } else {
                    decimals = await getPairDecimals(results[j].address)
                }

                var res = await web3.eth.getBlock(results[j].blockNumber)
                
                await knex('eth_pairs').update({
                    lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals / swap1),
                    timestamp: res.timestamp
                }).where('pairAddress', results[j].address.toLowerCase())

                isVisit[results[j].address.toLowerCase()] = true
            } catch (err) {
                console.log(results[j])
                console.log(err)
            }
        }

        console.log('===================================')
        console.log(i, results.length)
        sum += results.length
    }

    console.log('Finished with ' + sum + ' rows!')
}

async function getUniswapV3PairPriceHistory() {
    var fromBlock = TOBLOCK, toBlock = FROMBLOCK
    var sum = 0
    var isVisit = []
    var decimalList = []
    var pairList = []

    var rows = await knex('eth_pairs').select('*').where('lastPrice', '!=', 0)

    for (var i = 0; i < rows.length; i ++) {
        isVisit[rows[i].pairAddress] = true
        pairList[rows[i].pairAddress] = {
            token0Address: rows[i].token0Address,
            token1Address: rows[i].token1Address
        }
    }

    rows = await knex('eth_tokens').select('*')

    for (var i = 0; i < rows.length; i ++) {
        decimalList[rows[i].tokenAddress] = rows[i].tokenDecimals
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
                var decimal0 = -1
                var decimal1 = -1
                var decimals = 0

                if (pairList[results[j].address.toLowerCase()] && decimalList[pairList[results[j].address.toLowerCase()].token0Address]) {
                    decimal0 = decimalList[pairList[results[j].address.toLowerCase()].token0Address]
                }

                if (pairList[results[j].address.toLowerCase()] && decimalList[pairList[results[j].address.toLowerCase()].token1Address]) {
                    decimal1 = decimalList[pairList[results[j].address.toLowerCase()].token1Address]
                }
                
                if (decimal0 != -1 && decimal1 != -1) {
                    decimals = decimal1 - decimal0
                } else {
                    decimals = await getPairDecimals(results[j].address)
                }

                var res = await web3.eth.getBlock(results[j].blockNumber)
                
                await knex('eth_pairs').update({
                    lastPrice: Math.abs(swap0 * 1.0 * 10 ** decimals / swap1),
                    timestamp: res.timestamp
                }).where('pairAddress', results[j].address.toLowerCase())

                isVisit[results[j].address.toLowerCase()] = true
            } catch (err) {
                console.log(results[j])
                console.log(err)
            }
        }

        console.log('===================================')
        console.log(i, results.length)
        sum += results.length
    }

    console.log('Finished with ' + sum + ' rows!')
}

//getUniswapV2PairHistory()
//getUniswapV3PairHistory()
//getUniswapV2PairPriceHistory()
getUniswapV3PairPriceHistory()
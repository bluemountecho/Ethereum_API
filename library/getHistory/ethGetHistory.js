Web3 = require('web3')

const V3_FACTORY_ABI = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')
const V2_FACTORY_ABI = require('@uniswap/v2-core/build/IUniswapV2Factory.json')

//const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/9ea3677d970d4dc99f3f559768b0176c'))
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/I8IUQHQ-q9Wb5nDDcco__u0bPhqYDUjr'))
const V3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
const V2_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
const SUSHI_FACTORY_ADDRESS = "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"
const SHIBA_FACTORY_ADDRESS = "0x115934131916C8b277DD010Ee02de363c09d037c"
const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
const ETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
const factoryV3 = new web3.eth.Contract(V3_FACTORY_ABI.abi, V3_FACTORY_ADDRESS)
const factoryV2 = new web3.eth.Contract(V2_FACTORY_ABI.abi, V2_FACTORY_ADDRESS)
const factorySUSHI = new web3.eth.Contract(V2_FACTORY_ABI.abi, SUSHI_FACTORY_ADDRESS)
const factorySHIBA = new web3.eth.Contract(V2_FACTORY_ABI.abi, SHIBA_FACTORY_ADDRESS)
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

async function getUniswapV2PairHistory() {
    var fromBlock = 0, toBlock = 13840672
    var sum = 0

    for (var i = fromBlock; i < toBlock; i += 10000) {
        var from = i
        var to = i + 9999

        if (to > toBlock) to = toBlock
        
        let options = {
            fromBlock: from,
            toBlock: to
        };

        results = await factoryV2.getPastEvents('PairCreated', options)

        for (var j = 0; j < results.length; j ++) {
            try {
                await knex('eth_pairs').insert({
                    token0Address: '0x' + results[j].raw.topics[1].substr(26, 40).toLowerCase(),
                    token1Address: '0x' + results[j].raw.topics[2].substr(26, 40).toLowerCase(),
                    pairAddress: '0x' + results[j].raw.data.substr(26, 40).toLowerCase(),
                    factoryAddress: results[j].address.toLowerCase()
                })
            } catch (err) {
                await knex('eth_pairs').update({
                    token0Address: '0x' + results[j].raw.topics[1].substr(26, 40).toLowerCase(),
                    token1Address: '0x' + results[j].raw.topics[2].substr(26, 40).toLowerCase(),
                    factoryAddress: results[j].address.toLowerCase()
                }).where('pairAddress', '0x' + results[j].raw.data.substr(26, 40).toLowerCase())
            }
        }

        console.log(i, results.length)
        sum += results.length
    }

    console.log('Finished with ' + sum + ' rows!')
}

async function getUniswapV3PairHistory() {
    var fromBlock = 13830000, toBlock = 13835794
    var sum = 0

    for (var i = fromBlock; i < toBlock; i += 10000) {
        var from = i
        var to = i + 9999

        if (to > toBlock) to = toBlock

        try {
            let options = {
                fromBlock: from,
                toBlock: to
            };
    
            results = await factoryV3.getPastEvents('PoolCreated', options)
    
            var data = []
    
            for (var j = 0; j < results.length; j ++) {
                console.log(results[j])
                data.push({
                    token0Address: '0x' + results[j].raw.topics[1].substr(26, 40).toLowerCase(),
                    token1Address: '0x' + results[j].raw.topics[2].substr(26, 40).toLowerCase(),
                    pairAddress: '0x' + results[j].raw.data.substr(90, 40).toLowerCase(),
                    factoryAddress: results[j].address.toLowerCase()
                })
            }
    
            await knex('eth_pairs').insert(data)
        } catch (err) {
            console.log(err)
        }

        console.log(i, results.length)
        sum += results.length
    }

    console.log('Finished with ' + sum + ' rows!')
}

async function getUniswapV2PairPriceHistory() {
    var fromBlock = 13834794, toBlock = 13835794
    var sum = 0

    for (var i = fromBlock; i < toBlock; i += 10000) {
        var from = i
        var to = i + 9999

        if (to > toBlock) to = toBlock

        try {
            let options = {
                fromBlock: from,
                toBlock: to,
                topics: ['0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67']
            };
    
            results = await web3.eth.getPastLogs(options)

            console.log(results)
    
            /*var data = []
    
            for (var j = 0; j < results.length; j ++) {
                data.push({
                    token0Address: results[j].returnValues.token0,
                    token1Address: results[j].returnValues.token1,
                    pairAddress: results[j].returnValues.pair,
                    swapName: 'UniswapV2'
                })
            }
    
            await knex('eth_pairs').insert(data)*/
        } catch (err) {
            console.log(err)
        }

        console.log(i, results.length)
        sum += results.length
    }

    console.log('Finished with ' + sum + ' rows!')
}

getUniswapV2PairHistory()
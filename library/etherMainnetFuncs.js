Web3 = require('web3')

const JSBI = require('jsbi')
const V3_FACTORY_ABI = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')
const V2_FACTORY_ABI = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const V3_POOL_ABI = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json')
const V2_PAIR_ABI = require('@uniswap/v2-core/build/IUniswapV2Pair.json')
const minABI = require('./minABI.json')
const minPairABI = require('./minPairABI.json')
const baseTokens = require('./etherBaseTokens.json')

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

module.exports.getPriceFromSwapEvent = async function getPriceFromSwapEvent(pairAddress, token0Address, token1Address, isV2, customToBlock = 0) {
    var pairContract, token0Contract, token1Contract
    var abi

    if (isV2) {
        abi = V2_PAIR_ABI.abi
    } else {
        abi = V3_POOL_ABI.abi
    }
    
    [pairContract, token0Contract, token1Contract] = await Promise.all([new web3.eth.Contract(abi, pairAddress), new web3.eth.Contract(minABI, token0Address), new web3.eth.Contract(minABI, token1Address)])

    var decimals0, decimals1
    var toBlockNumber

    [decimals0, decimals1, toBlockNumber] = await Promise.all([token0Contract.methods.decimals().call(), token1Contract.methods.decimals().call(), web3.eth.getBlockNumber()])

    if (customToBlock != 0) {
        toBlockNumber = customToBlock   
    }
    
    let options = {
        fromBlock: toBlockNumber - 3000,
        toBlock: toBlockNumber
    };

    if (options.fromBlock < 0) {
        options.fromBlock = 0
    }

    var results
    var transactionHash = ''
    
    try {
        results = await pairContract.getPastEvents('Swap', options)

        if (results.length > 0) {
            transactionHash = results[results.length - 1].transactionHash
        }
    } catch (e) {
    }

    if (transactionHash == '') {
        options.fromBlock = 0

        try {
            results = await pairContract.getPastEvents('Swap', options)

            if (results.length > 0) {
                transactionHash = results[results.length - 1].transactionHash
            } else {
                return [0, 0, 0]
            }
        } catch (e) {
        }
    }

    if (transactionHash == '') {
        var from = 0

        while (true) {
            if (from > options.toBlock) break

            try {
                results = await pairContract.getPastEvents('Swap', options)
        
                if (results.length > 0) {
                    transactionHash = results[results.length - 1].transactionHash
                    console.log(results[results.length - 1])
                    break
                } else {
                    options.fromBlock = Math.floor((options.fromBlock + from) / 2)
                }
            } catch (e) {
                from = options.fromBlock
                options.fromBlock = Math.floor((options.fromBlock + options.toBlock) / 2) + 1
                console.log(pairAddress, options)
            }
        }
    }

    if (transactionHash == '') {
        return [0, 0, 0]
    }

    var res = await web3.eth.getTransactionReceipt(transactionHash)
    var swap0, swap1
    
    for (var i = 0; i < res.logs.length; i ++) {
        if (res.logs[i].address.toLowerCase() != pairAddress.toLowerCase()) continue
        if (isV2 && res.logs[i].topics[0] == "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822") {
            var amt0 = Number.parseInt(hexToBn(res.logs[i].data.substr(2, 64)))
            var amt1 = Number.parseInt(hexToBn(res.logs[i].data.substr(66, 64)))
            var amt2 = Number.parseInt(hexToBn(res.logs[i].data.substr(130, 64)))
            var amt3 = Number.parseInt(hexToBn(res.logs[i].data.substr(194, 64)))

            swap0 = amt0 + amt2
            swap1 = amt1 + amt3
            break
        } else if (isV2 == false && res.logs[i].topics[0] == "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67") {
            swap0 = Number.parseInt(hexToBn(res.logs[i].data.substr(2, 64)))
            swap1 = Number.parseInt(hexToBn(res.logs[i].data.substr(66, 64)))
            break
        }
    }

    return [Math.abs(swap0 / swap1 * 10 ** (decimals1 - decimals0)), res.blockNumber]
}

module.exports.getTokenBalanceOf = async function getTokenBalanceOf(tokenAddress, balanceAddress) {
    try {
        var tokenContract = new web3.eth.Contract(minABI, tokenAddress)
        var balance
        var decimals

        [balance, decimals] = await Promise.all([tokenContract.methods.balanceOf(balanceAddress).call(), tokenContract.methods.decimals().call()])

        if (decimals == 0) {
            return 0
        }

        return balance / 10 ** decimals
    } catch (e) {
        return 0;
    }
}

module.exports.getPriceOfTwoTokensV2 = async function getPriceOfTwoTokensV2(token0Address, token1Address) {
    try {
        var pair_address, pair_address0, pair_address1, pair_address2
        
        [pair_address0, pair_address1, pair_address2] = await Promise.all([factoryV2.methods.getPair(token0Address, token1Address).call(), factorySUSHI.methods.getPair(token0Address, token1Address).call(), factorySHIBA.methods.getPair(token0Address, token1Address).call()])

        if (pair_address0 != "0x0000000000000000000000000000000000000000") {
            pair_address = pair_address0
        } else if (pair_address1 != "0x0000000000000000000000000000000000000000") {
            pair_address = pair_address1
        } else {
            pair_address = pair_address2
        }

        if (pair_address == "0x0000000000000000000000000000000000000000") {
            return [0, 0, 0]
        }
        
        var balance0, balance1
        
        [balance0, balance1] = await Promise.all([this.getTokenBalanceOf(token0Address, pair_address), this.getTokenBalanceOf(token1Address, pair_address)])

        if (balance1 == 0) {
            return [0, 0, 0]
        }

        return [balance0 / balance1, balance0, balance1]
    } catch (e) {
        return [0, 0, 0]
    }
}

module.exports.getPriceOfTwoTokensV3 = async function getPriceOfTwoTokensV3(token0Address, token1Address) {
    try {
        var funcArray = []
        var res = []

        funcArray.push(this.getFeePriceOfTwoTokensV3(token0Address, token1Address))
        funcArray.push(this.getFeePriceOfTwoTokensV3(token0Address, token1Address, 500))
        funcArray.push(this.getFeePriceOfTwoTokensV3(token0Address, token1Address, 3000))
        funcArray.push(this.getFeePriceOfTwoTokensV3(token0Address, token1Address, 10000))
        res = await Promise.all(funcArray)

        var total = res[0][1] + res[1][1] + res[2][1] + res[3][1]
        var total1 = res[0][2] + res[1][2] + res[2][2] + res[3][2]
        var price = 0

        if (total != 0) {
            price = res[0][0] * res[0][1] / total + res[1][0] * res[1][1] / total + res[2][0] * res[2][1] / total + res[3][0] * res[3][1] / total
        }

        return [price, total, total1]
    } catch (e) {
        return [0, 0, 0]
    }
}

module.exports.getFeePriceOfTwoTokensV3 = async function getFeePriceOfTwoTokensV3(token0Address, token1Address, fee = 100) {
    try {
        var token0Contract, token1Contract
        [token0Contract, token1Contract] = await Promise.all([new web3.eth.Contract(minABI, token0Address), new web3.eth.Contract(minABI, token1Address)])
        var token0Decimals
        var token1Decimals
        var pool_address

        [pool_address, token0Decimals, token1Decimals] = await Promise.all([factoryV3.methods.getPool(token0Address, token1Address, fee).call(), token0Contract.methods.decimals().call(), token1Contract.methods.decimals().call()])

        if (pool_address == "0x0000000000000000000000000000000000000000") {
            return [0, 0, 0]
        }

        var pool_1 = new web3.eth.Contract(V3_POOL_ABI.abi, pool_address)
        var balance0
        var balance1
        var pool_balance

        [balance0, balance1, pool_balance] = await Promise.all([this.getTokenBalanceOf(token0Address, pool_address), this.getTokenBalanceOf(token1Address, pool_address), pool_1.methods.slot0().call()])
        
        var sqrtPriceX96 = pool_balance[0]
        var price = (JSBI.BigInt(sqrtPriceX96) * JSBI.BigInt(sqrtPriceX96)) / JSBI.BigInt(2) ** JSBI.BigInt(192)

        if (balance0 < 0.1 || balance1 < 0.1) {
            return [0, 0, 0]
        }

        if (token0Address < token1Address) {
            price = price * 10 ** (token0Decimals - token1Decimals);
        } else {
            price = price * 10 ** (token1Decimals - token0Decimals);
        }

        if (token0Address < token1Address) {
            price = 1 / price;
        }

        price = price * 100 / (100 + fee / 10000)

        return [price, balance0, balance1]
    } catch (e) {
        return [0, 0, 0]
    }
}

module.exports.getPriceOfTokenV3 = async function getPriceOfTokenV3(tokenAddress) {
    try {
        var funcArray = []
        var resTmp = []
        var res = []

        funcArray.push(this.getPriceOfTwoTokensV3(USDC_ADDRESS, tokenAddress))

        for (var i = 0; i < baseTokens.length; i ++) {
            funcArray.push(this.getPriceOfTwoTokensV3(USDC_ADDRESS, baseTokens[i]))
            funcArray.push(this.getPriceOfTwoTokensV3(baseTokens[i], tokenAddress))
        }

        resTmp = await Promise.all(funcArray)
        res.push([resTmp[0][0], resTmp[0][2] * resTmp[0][0]])

        console.log("=================== Uniswap V3 ======================")
        console.log(resTmp)

        for (var i = 0; i < baseTokens.length; i ++) {
            res.push([resTmp[1 + i * 2][0] * resTmp[2 + i * 2][0], resTmp[1 + i * 2][2] < resTmp[2 + i * 2][1] ? resTmp[1 + i * 2][0] * resTmp[1 + i * 2][2] : resTmp[1 + i * 2][0] * resTmp[2 + i * 2][1]])
        }

        var total = 0
        var price = 0

        for (var i = 0; i < res.length; i ++) {
            if (res[i][0] != 0) {
                total += res[i][1]
            }
        }

        console.log("=================== Uniswap V3 ======================")
        console.log(res)

        for (var i = 0; i < res.length; i ++) {
            if (res[i][0] != 0) {
                price += res[i][1] / total * res[i][0]
            }
        }

        return [price, total]
    } catch (e) {
        console.log(e)
        return [0, 0]
    }
}

module.exports.getPriceOfTokenV2 = async function getPriceOfTokenV2(tokenAddress) {
    try {
        var funcArray = []
        var resTmp = []
        var res = []
    
        funcArray.push(this.getPriceOfTwoTokensV2(USDC_ADDRESS, tokenAddress))
    
        for (var i = 0; i < baseTokens.length; i ++) {
            funcArray.push(this.getPriceOfTwoTokensV2(USDC_ADDRESS, baseTokens[i]))
            funcArray.push(this.getPriceOfTwoTokensV2(baseTokens[i], tokenAddress))
        }
    
        resTmp = await Promise.all(funcArray)
        res.push([resTmp[0][0], resTmp[0][2] * resTmp[0][0]])

        console.log("=================== Uniswap V2 ======================")
        console.log(resTmp)
    
        for (var i = 0; i < baseTokens.length; i ++) {
            res.push([resTmp[1 + i * 2][0] * resTmp[2 + i * 2][0], resTmp[1 + i * 2][2] < resTmp[2 + i * 2][1] ? resTmp[1 + i * 2][0] * resTmp[1 + i * 2][2] : resTmp[1 + i * 2][0] * resTmp[2 + i * 2][1]])
        }
    
        var total = 0
        var price = 0
    
        for (var i = 0; i < res.length; i ++) {
            if (res[i][0] != 0) {
                total += res[i][1]
            }
        }
    
        console.log("=================== Uniswap V2 ======================")
        console.log(res)
    
        for (var i = 0; i < res.length; i ++) {
            if (res[i][0] != 0) {
                price += res[i][1] / total * res[i][0]
            }
        }
        
        return [price, total]
    } catch (e) {
        console.log(e)
        return [0, 0]
    }
}

module.exports.getPriceOfToken = async function getPriceOfToken(tokenAddress) {
    try {
        var res = await Promise.all([this.getPriceOfTokenV2(tokenAddress), this.getPriceOfTokenV3(tokenAddress)])
        var total = res[0][1] + res[1][1]
        var price = 0

        if (total != 0) {
            price = res[0][0] * res[0][1] / total + res[1][0] * res[1][1] / total
        }

        return {
            'status': 'success',
            'data': {
                price: price.toFixed(20),
                priceV2: res[0][0].toFixed(20),
                totalVolumeV2: res[0][1].toFixed(20),
                priceV3: res[1][0].toFixed(20),
                totalVolumeV3: res[1][1].toFixed(20),
                totalVolume: total.toFixed(20)
            }
        }
    } catch (e) {
        return {
            'status': 'fail',
            'data': {

            }
        }
    }
}

module.exports.getLastPriceFromPair = async function getLastPriceFromPair(pairAddress) {
    try {
        var pairContract = new web3.eth.Contract(minPairABI, pairAddress)
        var token0Address, token1Address
        var result

        [token0Address, token1Address] = await Promise.all([pairContract.methods.token0().call(), pairContract.methods.token1().call()])
        
        var res = await Promise.all([this.getPriceFromSwapEvent(pairAddress, token0Address, token1Address, true), this.getPriceFromSwapEvent(pairAddress, token0Address, token1Address, false), this.getPriceOfToken(token0Address), this.getPriceOfToken(token1Address)])

        var token0Price = res[2].data.price
        var token1Price = res[3].data.price

        result = res[0]

        if (res[0][0] == 0) {
            result = res[1]
        }

        if (result[0] == 0) {
            return {
                'status': 'fail',
                'data': {
    
                }
            }
        }

        res = await Promise.all([
            this.getPriceFromSwapEvent("0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc", USDC_ADDRESS, ETH_ADDRESS, true, result[1]),
            //this.getPriceFromSwapEvent("0xE0554a476A092703abdB3Ef35c80e0D76d32939F", USDC_ADDRESS, ETH_ADDRESS, false, result[1]),
            //this.getPriceFromSwapEvent("0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640", USDC_ADDRESS, ETH_ADDRESS, false, result[1]),
            this.getPriceFromSwapEvent("0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8", USDC_ADDRESS, ETH_ADDRESS, false, result[1]),
            //this.getPriceFromSwapEvent("0x7BeA39867e4169DBe237d55C8242a8f2fcDcc387", USDC_ADDRESS, ETH_ADDRESS, false, result[1])
        ])

        var ethPrice = res[0][1] > res[1][1] ? res[0][0] : res[1][0]
        var tmp = result[0]
        var price0, price1
        
        if (token1Address.toLowerCase() == ETH_ADDRESS.toLowerCase()) {
            tmp = 1 / tmp
            price0 = (ethPrice * tmp).toFixed(20)
            price1 = ethPrice.toFixed(20)
        } else if (token0Address.toLowerCase() == ETH_ADDRESS.toLowerCase()) {
            price1 = (ethPrice * tmp).toFixed(20)
            price0 = ethPrice.toFixed(20)
        } else {
            price0 = Number.parseFloat(token0Price).toFixed(20)
            price1 = Number.parseFloat(token1Price).toFixed(20)
        }

        return {
            'status': 'success',
            'data': {
                token0Price: price0,
                token1Price: price1,
                token0: token0Address,
                token1: token1Address
            }
        }
    } catch (e) {
        console.log(e)
        return {
            'status': 'fail',
            'data': {

            }
        }
    }
}
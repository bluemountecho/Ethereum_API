Web3 = require('web3')

const JSBI = require('jsbi')
const V3_FACTORY_ABI = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')
const V2_FACTORY_ABI = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const V3_POOL_ABI = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json')
// const V2_PAIR_ABI = require('@uniswap/v2-core/build/IUniswapV2Pair.json')
const minABI = require('../library/minABI.json')
const baseTokens = require('../library/baseTokens.json')

//const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/9ea3677d970d4dc99f3f559768b0176c'))
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/I8IUQHQ-q9Wb5nDDcco__u0bPhqYDUjr'))
const V3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
const V2_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
const factoryV3 = new web3.eth.Contract(V3_FACTORY_ABI.abi, V3_FACTORY_ADDRESS)
const factoryV2 = new web3.eth.Contract(V2_FACTORY_ABI.abi, V2_FACTORY_ADDRESS)

module.exports.getTokenBalanceOf = async function getTokenBalanceOf(tokenAddress, balanceAddress) {
    try {
        var tokenContract = new web3.eth.Contract(minABI, tokenAddress)

        var balance = await tokenContract.methods.balanceOf(balanceAddress).call()
        var decimals = await tokenContract.methods.decimals().call()

        return balance / 10 ** decimals
    } catch (e) {
        return 0;
    }
}

module.exports.getPriceOfTwoTokensV2 = async function getPriceOfTwoTokensV2(token0Address, token1Address) {
    try {
        var pair_address = await factoryV2.methods.getPair(token0Address, token1Address).call()
        var balance0 = await this.getTokenBalanceOf(token0Address, pair_address)
        var balance1 = await this.getTokenBalanceOf(token1Address, pair_address)

        if (balance1 == 0 || balance0 == 0) {
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

        return [price, Number.parseFloat(total), Number.parseFloat(total1)]
    } catch (e) {
        return [0, 0, 0]
    }
}

    module.exports.getFeePriceOfTwoTokensV3 = async function getFeePriceOfTwoTokensV3(token0Address, token1Address, fee = 100) {
    try {
        var token0Contract = new web3.eth.Contract(minABI, token0Address)
        var token1Contract = new web3.eth.Contract(minABI, token1Address)
        var token0Decimals = 0
        var token1Decimals = 0

        token0Decimals = await token0Contract.methods.decimals().call()
        token1Decimals = await token1Contract.methods.decimals().call()

        var pool_address = await factoryV3.methods.getPool(token0Address, token1Address, fee).call()
        var pool_1 = new web3.eth.Contract(V3_POOL_ABI.abi, pool_address)
        var balance0 = await this.getTokenBalanceOf(token0Address, pool_address)
        var balance1 = await this.getTokenBalanceOf(token1Address, pool_address)

        if (balance0 < 2 || balance1 < 2) return [0, 0, 0]

        var pool_balance = await pool_1.methods.slot0().call()
        var sqrtPriceX96 = pool_balance[0]
        var price = (JSBI.BigInt(sqrtPriceX96) * JSBI.BigInt(sqrtPriceX96)) / JSBI.BigInt(2) ** JSBI.BigInt(192)

        if (token0Address < token1Address) {
            price = price * 10 ** (token0Decimals - token1Decimals);
        } else {
            price = price * 10 ** (token1Decimals - token0Decimals);
        }

        if (token0Address < token1Address) {
            price = 1 / price;
        }

        price = price * 100 / (100 + fee / 10000)

        return [price, Number.parseFloat(balance0), Number.parseFloat(balance1)]
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
        var price = res[0][0] * res[0][1] / total + res[1][0] * res[1][1] / total

        return {
            'status': 'success',
            'data': {
                price: price,
                priceV2: res[0][0],
                totalVolumeV2: res[0][1],
                priceV3: res[1][0],
                totalVolumeV3: res[1][1],
                totalVolume: total
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
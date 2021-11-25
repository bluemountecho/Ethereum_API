Web3 = require('web3')

const JSBI = require('jsbi')
const FACTORY_ABI = require('@pancakeswap-libs/pancake-swap-core/build/PancakeFactory.json')
const minABI = require('./minABI.json')
const baseTokens = require('./bscBaseTokens.json')

const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org'))
const FACTORY_ADDRESS = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
const BUSD_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
const factory = new web3.eth.Contract(FACTORY_ABI.abi, FACTORY_ADDRESS)

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

module.exports.getPriceOfTwoTokens = async function getPriceOfTwoTokens(token0Address, token1Address) {
    try {
        var pair_address = await factory.methods.getPair(token0Address, token1Address).call()
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

module.exports.getPriceOfTokenPancake = async function getPriceOfTokenPancake(tokenAddress) {
    try {
        var funcArray = []
        var resTmp = []
        var res = []
    
        funcArray.push(this.getPriceOfTwoTokens(BUSD_ADDRESS, tokenAddress))
    
        for (var i = 0; i < baseTokens.length; i ++) {
            funcArray.push(this.getPriceOfTwoTokens(BUSD_ADDRESS, baseTokens[i]))
            funcArray.push(this.getPriceOfTwoTokens(baseTokens[i], tokenAddress))
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
        var res = await this.getPriceOfTokenPancake(tokenAddress)

        return {
            'status': 'success',
            'data': {
                price: res[0].toFixed(20),
                totalVolume: res[1].toFixed(20)
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
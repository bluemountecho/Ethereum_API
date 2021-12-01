Web3 = require('web3')

const JSBI = require('jsbi')
const FACTORY_ABI = require('@pancakeswap-libs/pancake-swap-core/build/PancakeFactory.json')
const PAIR_ABI = require('@pancakeswap-libs/pancake-swap-core/build/PancakePair.json')
const V2_FACTORY_ABI = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const minABI = require('./minABI.json')
const minPairABI = require('./minPairABI.json')
const baseTokens = require('./bscBaseTokens.json')

const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.ninicoin.io'))
//const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://bsc-ws-node.nariox.org:443'))
const FACTORY_ADDRESS = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
const SUSHI_FACTORY_ADDRESS = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4"
const BUSD_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
const BNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
const factory = new web3.eth.Contract(FACTORY_ABI.abi, FACTORY_ADDRESS)
const factorySUSHI = new web3.eth.Contract(V2_FACTORY_ABI.abi, SUSHI_FACTORY_ADDRESS)

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

module.exports.getPriceFromSwapEvent = async function getPriceFromSwapEvent(pairAddress, token0Address, token1Address, customToBlock = 0) {
    var pairContract, token0Contract, token1Contract

    [pairContract, token0Contract, token1Contract] = await Promise.all([new web3.eth.Contract(PAIR_ABI.abi, pairAddress), new web3.eth.Contract(minABI, token0Address), new web3.eth.Contract(minABI, token1Address)])

    var decimals0, decimals1
    var toBlockNumber

    [decimals0, decimals1, toBlockNumber] = await Promise.all([token0Contract.methods.decimals().call(), token1Contract.methods.decimals().call(), web3.eth.getBlockNumber()])

    if (customToBlock != 0) {
        toBlockNumber = customToBlock   
    }
    
    let options = {
        fromBlock: toBlockNumber,
        toBlock: toBlockNumber
    };

    if (options.fromBlock < 0) {
        options.fromBlock = 0
    }

    var results
    var transactionHash = ''
    
    /*
    try {
        results = await pairContract.getPastEvents('Swap', options)

        if (results.length > 0) {
            transactionHash = results[results.length - 1].transactionHash
        }
    } catch (e) {
        console.log(e)
    }

    console.log(options)

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
            console.log(e)
        }
    }

    console.log(options)

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
                console.log(e)
                from = options.fromBlock
                options.fromBlock = Math.floor((options.fromBlock + options.toBlock) / 2) + 1
                console.log(pairAddress, options)
            }
        }
    } */

    var to = toBlockNumber

    for (var from = toBlockNumber - 1000; from >= 0; from -= 1000) {
        options.fromBlock = from
        options.toBlock = to

        results = await pairContract.getPastEvents('Swap', options)

        if (results.length > 0) {
            transactionHash = results[results.length - 1].transactionHash
            break
        }

        console.log(options)

        to = from
    }

    if (transactionHash == '') {
        return [0, 0, 0]
    }

    var res = await web3.eth.getTransactionReceipt(transactionHash)
    var swap0, swap1
    
    for (var i = 0; i < res.logs.length; i ++) {
        if (res.logs[i].address.toLowerCase() != pairAddress.toLowerCase()) continue
        if (res.logs[i].topics[0] == "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822") {
            var amt0 = Number.parseInt(hexToBn(res.logs[i].data.substr(2, 64)))
            var amt1 = Number.parseInt(hexToBn(res.logs[i].data.substr(66, 64)))
            var amt2 = Number.parseInt(hexToBn(res.logs[i].data.substr(130, 64)))
            var amt3 = Number.parseInt(hexToBn(res.logs[i].data.substr(194, 64)))

            swap0 = amt0 + amt2
            swap1 = amt1 + amt3
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

module.exports.getPriceOfTwoTokens = async function getPriceOfTwoTokens(token0Address, token1Address) {
    try {
        var pair_address, pair_address0, pair_address1, pair_address2
        
        [pair_address0, pair_address1] = await Promise.all([factory.methods.getPair(token0Address, token1Address).call(), factorySUSHI.methods.getPair(token0Address, token1Address).call()])

        if (pair_address0 != "0x0000000000000000000000000000000000000000") {
            pair_address = pair_address0
        } else {
            pair_address = pair_address1
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

        console.log("=================== PancakeSwap ======================")
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
    
        console.log("=================== PancakeSwap ======================")
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

module.exports.getLastPriceFromPair = async function getLastPriceFromPair(pairAddress) {
    try {
        var pairContract = new web3.eth.Contract(minPairABI, pairAddress)
        var token0Address, token1Address
        var result

        [token0Address, token1Address] = await Promise.all([pairContract.methods.token0().call(), pairContract.methods.token1().call()])

        console.log(token0Address, token1Address)
        
        var res = await this.getPriceFromSwapEvent(pairAddress, token0Address, token1Address)

        result = res

        if (result[0] == 0) {
            return {
                'status': 'fail',
                'data': {
    
                }
            }
        }

        console.log(res)

        res = await this.getPriceFromSwapEvent("0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16", BNB_ADDRESS, BUSD_ADDRESS, result[1])

        console.log(res)

        var bnbPrice = 1 / res[0]
        var tmp = result[0]
        var price0, price1
        
        if (token1Address.toLowerCase() == BNB_ADDRESS.toLowerCase()) {
            tmp = 1 / tmp
            price0 = (bnbPrice * tmp).toFixed(20)
            price1 = bnbPrice.toFixed(20)
        } else if (token0Address.toLowerCase() == BNB_ADDRESS.toLowerCase()) {
            price1 = (bnbPrice * tmp).toFixed(20)
            price0 = bnbPrice.toFixed(20)
        } else {
            price0 = (0).toFixed(20)
            price1 = (0).toFixed(20)
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
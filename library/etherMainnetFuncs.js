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

var pairList = []
var tokenList = []

knex('eth_pairs').select('*').then(rows => {
    for (var i = 0; i < rows.length; i ++) {
        /*
        if (!pairList[rows[i].token0Address]) {
            pairList[rows[i].token0Address] = []
        }

        if (!pairList[rows[i].token0Address][rows[i].token1Address]) {
            pairList[rows[i].token0Address][rows[i].token1Address] = []
        }
    
        pairList[rows[i].token0Address][rows[i].token1Address].push({
            lastPrice: rows[i].lastPrice ? 1.0 / rows[i].lastPrice : 0,
            timestamp: rows[i].timestamp
        })

        if (!pairList[rows[i].token1Address]) {
            pairList[rows[i].token1Address] = []
        }

        if (!pairList[rows[i].token1Address][rows[i].token0Address]) {
            pairList[rows[i].token1Address][rows[i].token0Address] = []
        }
    
        pairList[rows[i].token1Address][rows[i].token0Address].push({
            lastPrice: rows[i].lastPrice,
            timestamp: rows[i].timestamp
        })*/
        if (!pairList[rows[i].token0Address])
            pairList[rows[i].token0Address] = 0
        if (!pairList[rows[i].token1Address])
            pairList[rows[i].token1Address] = 0

        pairList[rows[i].token0Address] ++
        pairList[rows[i].token1Address] ++
    }

    knex('eth_tokens').select('*').then(rows => {
        for (var i = 0; i < rows.length; i ++) {
            tokenList[rows[i].tokenAddress] = {
                tokenAddress: rows[i].tokenAddress,
                symbol: rows[i].tokenSymbol,
                name: rows[i].tokenName,
                decimal: rows[i].tokenDecimals
            }
        }
        
        console.log('========= Ether Datas are ready! =========')

        var cnt = 0

        for (var key in pairList) {
            if (pairList[key] > 100) {
                console.log(pairList[key])
                console.log(tokenList[key])
                cnt ++
            }
        }

        console.log('Finished with ' + cnt + ' rows!')
    })
})

module.exports.getPriceOfToken = async function getPriceOfToken(tokenAddress) {
    try {
        var route = []
        var vis = []
        var qh = 0, qt = 1

        route.push({
            tokenAddress: tokenAddress,
            res: 1.0,
            bef: -1
        })

        vis[tokenAddress] = true

        while (qh < qt) {
            var cur = route[qh]

            if (!pairList[cur.tokenAddress]) {
                continue
            }

            for (var key in pairList[cur.tokenAddress]) {
                if (vis[key]) continue

                vis[key] = true

                for (var j = 0; j < pairList[cur.tokenAddress][key].length; j ++) {
                    route[qt ++] = {
                        tokenAddress: key,
                        res: cur.res * pairList[cur.tokenAddress][key][j].lastPrice,
                        bef: qh
                    }

                    if ((key == '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' || key == '0xdac17f958d2ee523a2206206994597c13d831ec7') && route[qt - 1].res) break
                }
            }

            if ((route[qt - 1] == '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' || route[qt - 1] == '0xdac17f958d2ee523a2206206994597c13d831ec7') && route[qt - 1].res) break

            qh ++
        }

        if (qh >= qt) {
            console.log(route)

            return {
                message: 'Can\'t find swap route!',
                data: {

                }
            }
        } else {
            console.log(route)

            return {
                message: 'Success!',
                data: route[qt - 1].res
            }
        }
    } catch (e) {
        console.log(e)
        
        return {
            message: 'Error occured!',
            data: {
                
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
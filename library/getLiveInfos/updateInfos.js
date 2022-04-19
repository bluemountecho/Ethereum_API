var fs = require('fs')
const config = require('../../config')
const utf8 = require('utf8')
const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream("update.txt"),
  stderr: fs.createWriteStream("update.txt"),
});
const axios = require('axios')
const Web3 = require('web3');

var web3s = []

for (var i = 0; i < config.networks.length; i ++) {
    const chainName = config.networks[i]
    const proxyCnt = config[chainName].PROXYCOUNT

    web3s[chainName] = []

    if (config[chainName].endPointType == 1) {
        for (var ii = 0; ii < proxyCnt; ii ++) {
            web3s[chainName].push(new Web3(new Web3.providers.HttpProvider(config[chainName].web3Providers[0], {
                // Enable auto reconnection
                reconnect: {
                    auto: true,
                    delay: 5000, // ms
                    maxAttempts: 5,
                    onTimeout: false
                },
                keepAlive: true,
                timeout: 20000,
                headers: [{name: 'Access-Control-Allow-Origin', value: '*'}],
                withCredentials: false,
                agent: {
                    // httpsAgent: new HttpsProxyAgent('https://' + config.PROXY[ii]),
                    baseUrl: 'http://' + config.PROXY[ii]
                }
                // agent: {
                //     // http: new HttpsProxyAgent('http://' + config.PROXY[ii]),
                //     http: http.Agent('http://' + config.PROXY[ii]),
                //     baseUrl: 'http://' + config.PROXY[ii]
                // }
            })))
        }
    } else {
        for (var ii = 0; ii < proxyCnt; ii ++) {
            web3s[chainName].push(new Web3(new Web3.providers.HttpProvider(config[chainName].web3Providers[ii], {
                // Enable auto reconnection
                reconnect: {
                    auto: true,
                    delay: 5000, // ms
                    maxAttempts: 5,
                    onTimeout: false
                },
                keepAlive: true,
                timeout: 20000,
                headers: [{name: 'Access-Control-Allow-Origin', value: '*'}],
                withCredentials: false,
                agent: {
                    // httpsAgent: new HttpsProxyAgent('https://' + config.PROXY[ii]),
                    baseUrl: 'http://' + config.PROXY[ii]
                }
                // agent: {
                //     // http: new HttpsProxyAgent('http://' + config.PROXY[ii]),
                //     http: http.Agent('http://' + config.PROXY[ii]),
                //     baseUrl: 'http://' + config.PROXY[ii]
                // }
            })))
        }
    }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const minERC20ABI = [
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
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
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
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

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        port : 3306,
        user : 'admin_root',
        password : 'bOPTDZXP8Xvdf9I1',
        database : 'admin_ethereum_api'
        // user : 'root',
        // password : '',
        // database : 'ethereum_api'
    }
})

function convertTimestampToString(timestamp, flag = false) {
    if (flag == false) {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
    } else {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

async function getCoinsList() {
    for (var i = 0; i < config.networks.length; i ++) {
        var changesTableName = config.networks[i] + '_changes'
        var tokensTableName = config.networks[i] + '_tokens'

        var rows = await knex(changesTableName).join(tokensTableName, changesTableName + '.tokenAddress', '=', tokensTableName + '.tokenAddress')
            .select(knex.raw(changesTableName + '.*, ' + tokensTableName + '.tokenName, ' + tokensTableName + '.tokenSymbol, ' + tokensTableName + '.totalSupply, ' + tokensTableName + '.coingeckoInfos, ' + tokensTableName + '.lastPrice'))
        var rows1 = await knex('main_coin_list').where('network', config.networks[i])

        var visChanges = []
        var visList = []

        for (var j = 0; j < rows1.length; j ++) {
            visList[rows1[j].tokenAddress] = true
        }

        for (var j = 0; j < rows.length; j ++) {
            if (rows[j].tokenName.length > 50) continue
            if (rows[j].lastPrice >= 100000) continue
            if (rows[j].trans24h == 0 || rows[j].volume24h == 0) continue
            if (rows[j].trans24h * 400000 <= rows[j].volume24h) continue

            visChanges[rows[j].tokenAddress] = true

            if (visList[rows[j].tokenAddress]) {
                await knex('main_coin_list').update({
                    tokenAddress: rows[j].tokenAddress,
                    network: config.networks[i],
                    price24h: rows[j].price24h,
                    price12h: rows[j].price12h,
                    price6h: rows[j].price6h,
                    price2h: rows[j].price2h,
                    price1h: rows[j].price1h,
                    price30m: rows[j].price30m,
                    price5m: rows[j].price5m,
                    pricenow: rows[j].lastPrice,
                    trans24h: rows[j].trans24h,
                    volume24h: rows[j].volume24h,
                    marketcap: rows[j].totalSupply * rows[j].lastPrice,
                    coinName: rows[j].tokenName,
                    coinSymbol: rows[j].tokenSymbol,
                    coinImage: (rows[j].coingeckoInfos && rows[j].coingeckoInfos != '') ? JSON.parse(rows[j].coingeckoInfos).image.large : '',
                }).where("tokenAddress", rows[j].tokenAddress).where('network', config.networks[i])
            } else {
                await knex('main_coin_list').insert({
                    tokenAddress: rows[j].tokenAddress,
                    network: config.networks[i],
                    price24h: rows[j].price24h,
                    price12h: rows[j].price12h,
                    price6h: rows[j].price6h,
                    price2h: rows[j].price2h,
                    price1h: rows[j].price1h,
                    price30m: rows[j].price30m,
                    price5m: rows[j].price5m,
                    pricenow: rows[j].lastPrice,
                    trans24h: rows[j].trans24h,
                    volume24h: rows[j].volume24h,
                    marketcap: rows[j].totalSupply * rows[j].lastPrice,
                    coinName: rows[j].tokenName,
                    coinSymbol: rows[j].tokenSymbol,
                    coinImage: (rows[j].coingeckoInfos && rows[j].coingeckoInfos != '') ? JSON.parse(rows[j].coingeckoInfos).image.large : '',
                })
            }
        }

        for (var token in visList) {
            if (visChanges[token]) continue

            await knex('main_coin_list').where('tokenAddress', token).where('network', config.networks[i]).delete()
        }
    }

    var rows = await knex('main_live').whereRaw('swapAt>=DATE_SUB(NOW(), INTERVAL 24 HOUR)').groupBy('coin_id').select(knex.raw('*, sum(swapAmountUSD) as volume, count(coin_id) as trans'))

    for (var i = 0; i < rows.length; i ++) {
        var coin = await knex('main_coins').where('coin_id', rows[i].coin_id).select('*')
        var info = await knex('main_coin_list').where('tokenAddress', coin[0].coin_token_address).where('network', coin[0].coin_net).select('*')

        if (info.length == 0) continue

        await knex('main_coin_list').where('tokenAddress', rows[i].coin_id.toString()).where('network', 'main').update({
            trans24h: rows[i].trans,
            volume24h: rows[i].volume,
            coinName: coin[0].coin_name,
            coinSymbol: coin[0].coin_symbol,
            price24h: info[0].price24h * (0.9997 + Math.random() * 0.001),
            price12h: info[0].price12h * (0.9997 + Math.random() * 0.001),
            price6h: info[0].price6h * (0.9997 + Math.random() * 0.001),
            price2h: info[0].price2h * (0.9997 + Math.random() * 0.001),
            price1h: info[0].price1h * (0.9997 + Math.random() * 0.001),
            price30m: info[0].price30m * (0.9997 + Math.random() * 0.001),
            price5m: info[0].price5m * (0.9997 + Math.random() * 0.001),
            pricenow: info[0].pricenow * (0.9997 + Math.random() * 0.001),
            marketcap: coin[0].coin_total_supply * (0.98 + Math.random() * 0.02),
            coinImage: (coin[0].coin_geckoInfo && coin[0].coin_geckoInfo != '') ? JSON.parse(coin[0].coin_geckoInfo).image.large : '',
        })
    }

    myLogger.log(convertTimestampToString(new Date().getTime(), true) + ' getCoinList')

    setTimeout(getCoinsList, 1000)
}

async function getTotalSupply() {
    for (var i = 0; i < config.networks.length; i ++) {
        var changesTableName = config.networks[i] + '_changes'
        var tokensTableName = config.networks[i] + '_tokens'
        var tmpWeb3s = web3s[config.networks[i]]

        var tokens = await knex(changesTableName).join(tokensTableName, tokensTableName + '.tokenAddress', '=', changesTableName + '.tokenAddress').select('*')

        for (var j = 0; j < tokens.length; j += tmpWeb3s.length) {
            try {
                var funcs = []

                for (var k = 0; j + k < tokens.length && k < tmpWeb3s.length; k ++) {
                    var contract = new tmpWeb3s[k].eth.Contract(minERC20ABI, tokens[j + k].tokenAddress)

                    funcs.push(contract.methods.totalSupply().call())
                }

                var res = await Promise.all(funcs)

                for (var k = 0; j + k < tokens.length && k < tmpWeb3s.length; k ++) {
                    await knex(tokensTableName).where('tokenAddress', tokens[j + k].tokenAddress).update({'totalSupply': res[k] / 10 ** tokens[j + k].tokenDecimals})
                }
            } catch (err) {

            }

            await delay(200)
        }
    }

    var rows = await knex('main_coins').select('*')

    for (var i = 0; i < rows.length; i ++) {
        var res = await axios.get('https://api.coingecko.com/api/v3/coins/' + config.coinMap[rows[i].coin_id])
        var info = res.data

        await knex('main_coins').where('coin_id', rows[i].coin_id).update({
            coin_total_supply: info.market_data.market_cap.usd,
            coin_geckoInfo: utf8.encode(JSON.stringify(info))
        })

        await delay(1200)
    }

    setTimeout(getTotalSupply, 1000)
}

async function getCoinGeckoInfo() {
    var infos = (await axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=true')).data

    for (var i = 0; i < infos.length; i ++) {
        var keys = Object.keys(infos[i].platforms)

        if (keys.length == 0) continue

        var res = await axios.get('https://api.coingecko.com/api/v3/coins/' + infos[i].id)
        var info = JSON.stringify(res.data)

        for (var j = 0; j < keys.length; j ++) {
            var address = infos[i].platforms[keys[j]]

            if (address == '') continue
            if (!config.netMap[keys[j]]) continue

            var net = config.netMap[keys[j]]

            await knex(net + '_tokens').where('tokenAddress', address).update('coingeckoInfos', utf8.encode(info))
        }

        await delay(2000)
    }

    setTimeout(getCoinGeckoInfo, 3600000 * 10)
}

async function init() {
    getCoinsList()
    getCoinGeckoInfo()
    getTotalSupply()
}

init()
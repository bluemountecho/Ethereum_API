var fs = require('fs')
const config = require('../../config')
const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream("update.txt"),
  stderr: fs.createWriteStream("update.txt"),
});
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

        for (var j = 0; j < rows.length; j ++) {
            if (rows[j].tokenName.length > 50) continue

            try {
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
            } catch (err) {
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
            }
        }
    }

    setTimeout(getCoinsList, 1000)
}

async function init() {
    getCoinsList()
}

init()
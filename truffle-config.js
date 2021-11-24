var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", 
      port: 7545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider('f59ecbb30863b2d44eb9736241453f1c4adc71371af577dfb5e532d153671b11', "https://rinkeby.infura.io/v3/9ea3677d970d4dc99f3f559768b0176c");
      },
      network_id: 4,
      from: '0xbf96178161586b8C9c5096E35Ac2EA2Ad1fAd2A7'
    }
  },
  compilers: {
    solc: {
      version: "^0.6.0",
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: 'P5QXWEDN6PEQE4KB61J5GISXXNEKEYAGFM'
  }
};

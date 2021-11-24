var UniswapV2Controller = artifacts.require("./UniswapV2Controller.sol");

module.exports = function(deployer) {
  deployer.deploy(UniswapV2Controller);
};

// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol';

contract UniswapV2Controller {
    address internal constant UNISWAP_V2_FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    constructor() public {
        
    }

    function getPairPrice(address token0, address token1) external view returns(uint256, uint256) {
        uint256 reserve0;
        uint256 reserve1;

        (reserve0, reserve1) = UniswapV2Library.getReserves(UNISWAP_V2_FACTORY, token0, token1);

        return (reserve0, reserve1);
        
        return UniswapV2Library.quote(1, reserve0, reserve1);
    }
}
/*
 Navicat Premium Data Transfer

 Source Server         : localhost(mysql)
 Source Server Type    : MySQL
 Source Server Version : 100417
 Source Host           : localhost:3306
 Source Schema         : ethereum_api

 Target Server Type    : MySQL
 Target Server Version : 100417
 File Encoding         : 65001

 Date: 21/12/2021 18:16:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for eth_pairs
-- ----------------------------
DROP TABLE IF EXISTS `eth_pairs`;
CREATE TABLE `eth_pairs`  (
  `token0Address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `token1Address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `factoryAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `pairAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `lastPrice` float NULL DEFAULT 0,
  `timestamp` int(20) NULL DEFAULT 0,
  PRIMARY KEY (`pairAddress`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for eth_tokens
-- ----------------------------
DROP TABLE IF EXISTS `eth_tokens`;
CREATE TABLE `eth_tokens`  (
  `tokenAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tokenSymbol` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tokenName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tokenDecimals` int(255) NULL DEFAULT NULL,
  `totalSupply` bigint(255) NULL DEFAULT NULL,
  PRIMARY KEY (`tokenAddress`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

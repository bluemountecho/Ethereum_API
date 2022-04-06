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

 Date: 06/04/2022 23:21:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bsc_daily
-- ----------------------------
DROP TABLE IF EXISTS `bsc_daily`;
CREATE TABLE `bsc_daily`  (
  `PAIRADDRESS` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `SWAPAT` timestamp(0) NULL DEFAULT NULL,
  `AVGPRICE` double NULL DEFAULT NULL,
  `MAXPRICE` double NULL DEFAULT NULL,
  `MINPRICE` double NULL DEFAULT NULL,
  `VOLUME0` double NULL DEFAULT NULL,
  `VOLUME1` double NULL DEFAULT NULL,
  `TOTALVOLUME0` double NULL DEFAULT NULL,
  `TOTALVOLUME1` double NULL DEFAULT NULL,
  `SWAPCOUNT` int(11) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for bsc_live
-- ----------------------------
DROP TABLE IF EXISTS `bsc_live`;
CREATE TABLE `bsc_live`  (
  `pairAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapPrice` double NULL DEFAULT NULL,
  `swapAmount0` double NULL DEFAULT NULL,
  `swapAmount1` double NULL DEFAULT NULL,
  `swapMaker` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapTransactionHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapAt` timestamp(0) NULL DEFAULT NULL,
  `isBuy` tinyint(4) NULL DEFAULT 0
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for bsc_pairs
-- ----------------------------
DROP TABLE IF EXISTS `bsc_pairs`;
CREATE TABLE `bsc_pairs`  (
  `token0Address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `token1Address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `factoryAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `pairAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `lastPrice` double NULL DEFAULT 0,
  `createdAt` timestamp(0) NULL DEFAULT NULL,
  `blockNumber` int(20) NULL DEFAULT 0,
  `transactionID` int(20) NULL DEFAULT 0,
  `baseToken` tinyint(255) NULL DEFAULT 0,
  `decimals` int(255) NULL DEFAULT NULL,
  PRIMARY KEY (`pairAddress`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for bsc_past
-- ----------------------------
DROP TABLE IF EXISTS `bsc_past`;
CREATE TABLE `bsc_past`  (
  `pairAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapPrice` double NULL DEFAULT NULL,
  `swapAmount0` double NULL DEFAULT NULL,
  `swapAmount1` double NULL DEFAULT NULL,
  `swapMaker` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapTransactionHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapAt` timestamp(0) NULL DEFAULT NULL,
  `isBuy` tinyint(4) NULL DEFAULT 0
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for bsc_tokens
-- ----------------------------
DROP TABLE IF EXISTS `bsc_tokens`;
CREATE TABLE `bsc_tokens`  (
  `tokenAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tokenSymbol` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tokenName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tokenDecimals` int(255) NULL DEFAULT NULL,
  `sourceCode` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `otherInfos` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `createdAt` timestamp(0) NULL DEFAULT NULL,
  `totalSupply` double NULL DEFAULT NULL,
  `totalHolders` int(11) NULL DEFAULT NULL,
  `holders` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `links` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  PRIMARY KEY (`tokenAddress`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for eth_changes
-- ----------------------------
DROP TABLE IF EXISTS `eth_changes`;
CREATE TABLE `eth_changes`  (
  `tokenAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `price24h` double NULL DEFAULT 0,
  `price12h` double NULL DEFAULT 0,
  `price6h` double NULL DEFAULT 0,
  `price2h` double NULL DEFAULT 0,
  `price1h` double NULL DEFAULT 0,
  `price30m` double NULL DEFAULT 0,
  `price5m` double NULL DEFAULT 0,
  `trans24h` int(11) NULL DEFAULT 0,
  `trans12h` int(11) NULL DEFAULT 0,
  `trans6h` int(11) NULL DEFAULT 0,
  `trans2h` int(11) NULL DEFAULT 0,
  `trans1h` int(11) NULL DEFAULT 0,
  `trans30m` int(11) NULL DEFAULT 0,
  `trans5m` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`tokenAddress`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for eth_daily
-- ----------------------------
DROP TABLE IF EXISTS `eth_daily`;
CREATE TABLE `eth_daily`  (
  `PAIRADDRESS` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `SWAPAT` timestamp(0) NULL DEFAULT NULL,
  `AVGPRICE` double NULL DEFAULT NULL,
  `MAXPRICE` double NULL DEFAULT NULL,
  `MINPRICE` double NULL DEFAULT NULL,
  `VOLUME0` double NULL DEFAULT NULL,
  `VOLUME1` double NULL DEFAULT NULL,
  `TOTALVOLUME0` double NULL DEFAULT NULL,
  `TOTALVOLUME1` double NULL DEFAULT NULL,
  `SWAPCOUNT` int(11) NULL DEFAULT NULL,
  INDEX `PAIRADDRESS`(`PAIRADDRESS`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for eth_live
-- ----------------------------
DROP TABLE IF EXISTS `eth_live`;
CREATE TABLE `eth_live`  (
  `pairAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapPrice` double NULL DEFAULT NULL,
  `swapAmount0` double NULL DEFAULT NULL,
  `swapAmount1` double NULL DEFAULT NULL,
  `swapMaker` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapTransactionHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapAt` timestamp(0) NULL DEFAULT NULL,
  `isBuy` tinyint(4) NULL DEFAULT 0
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for eth_pairs
-- ----------------------------
DROP TABLE IF EXISTS `eth_pairs`;
CREATE TABLE `eth_pairs`  (
  `token0Address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `token1Address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `factoryAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `pairAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `lastPrice` double NULL DEFAULT 0,
  `createdAt` timestamp(0) NULL DEFAULT NULL,
  `blockNumber` int(20) NULL DEFAULT 0,
  `transactionID` int(20) NULL DEFAULT 0,
  `baseToken` tinyint(255) NULL DEFAULT 0,
  `decimals` int(255) NULL DEFAULT NULL,
  PRIMARY KEY (`pairAddress`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for eth_past
-- ----------------------------
DROP TABLE IF EXISTS `eth_past`;
CREATE TABLE `eth_past`  (
  `pairAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapPrice` double NULL DEFAULT NULL,
  `swapAmount0` double NULL DEFAULT NULL,
  `swapAmount1` double NULL DEFAULT NULL,
  `swapMaker` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapTransactionHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `swapAt` timestamp(0) NULL DEFAULT NULL,
  `isBuy` tinyint(4) NULL DEFAULT 0
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for eth_token_daily
-- ----------------------------
DROP TABLE IF EXISTS `eth_token_daily`;
CREATE TABLE `eth_token_daily`  (
  `TOKENADDRESS` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `SWAPAT` timestamp(0) NULL DEFAULT NULL,
  `AVGPRICE` double NULL DEFAULT NULL,
  `MAXPRICE` double NULL DEFAULT NULL,
  `MINPRICE` double NULL DEFAULT NULL,
  `VOLUME` double NULL DEFAULT NULL,
  `SWAPCOUNT` int(11) NULL DEFAULT NULL
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
  `sourceCode` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `otherInfos` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `createdAt` timestamp(0) NULL DEFAULT NULL,
  `totalSupply` double NULL DEFAULT NULL,
  `totalHolders` int(11) NULL DEFAULT NULL,
  `holders` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `links` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  PRIMARY KEY (`tokenAddress`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;

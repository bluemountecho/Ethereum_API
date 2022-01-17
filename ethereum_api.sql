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

 Date: 17/01/2022 11:09:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
  `createdAt` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`tokenAddress`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

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
-- Table structure for eth_tokens
-- ----------------------------
DROP TABLE IF EXISTS `eth_tokens`;
CREATE TABLE `eth_tokens`  (
  `tokenAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tokenSymbol` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tokenName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tokenDecimals` int(255) NULL DEFAULT NULL,
  `createdAt` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`tokenAddress`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;

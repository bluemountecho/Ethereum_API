-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 09, 2022 at 08:17 AM
-- Server version: 10.6.5-MariaDB-1:10.6.5+maria~focal
-- PHP Version: 8.0.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `admin_ethereum_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `arbitrum_changes`
--

CREATE TABLE `arbitrum_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `arbitrum_daily`
--

CREATE TABLE `arbitrum_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `arbitrum_live`
--

CREATE TABLE `arbitrum_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `arbitrum_pairs`
--

CREATE TABLE `arbitrum_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `arbitrum_past`
--

CREATE TABLE `arbitrum_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `arbitrum_tokens`
--

CREATE TABLE `arbitrum_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `arbitrum_token_daily`
--

CREATE TABLE `arbitrum_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `arbitrum_token_live`
--

CREATE TABLE `arbitrum_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `aurora_changes`
--

CREATE TABLE `aurora_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `aurora_daily`
--

CREATE TABLE `aurora_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `aurora_live`
--

CREATE TABLE `aurora_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `aurora_pairs`
--

CREATE TABLE `aurora_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `aurora_past`
--

CREATE TABLE `aurora_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `aurora_tokens`
--

CREATE TABLE `aurora_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `aurora_token_daily`
--

CREATE TABLE `aurora_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `aurora_token_live`
--

CREATE TABLE `aurora_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `avalanche_changes`
--

CREATE TABLE `avalanche_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `avalanche_daily`
--

CREATE TABLE `avalanche_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `avalanche_live`
--

CREATE TABLE `avalanche_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `avalanche_pairs`
--

CREATE TABLE `avalanche_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `avalanche_past`
--

CREATE TABLE `avalanche_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `avalanche_tokens`
--

CREATE TABLE `avalanche_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `avalanche_token_daily`
--

CREATE TABLE `avalanche_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `avalanche_token_live`
--

CREATE TABLE `avalanche_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `boba_changes`
--

CREATE TABLE `boba_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `boba_daily`
--

CREATE TABLE `boba_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `boba_live`
--

CREATE TABLE `boba_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `boba_pairs`
--

CREATE TABLE `boba_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `boba_past`
--

CREATE TABLE `boba_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `boba_tokens`
--

CREATE TABLE `boba_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `boba_token_daily`
--

CREATE TABLE `boba_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `boba_token_live`
--

CREATE TABLE `boba_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `bsc_changes`
--

CREATE TABLE `bsc_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `bsc_daily`
--

CREATE TABLE `bsc_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `bsc_live`
--

CREATE TABLE `bsc_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `bsc_pairs`
--

CREATE TABLE `bsc_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `bsc_past`
--

CREATE TABLE `bsc_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `bsc_tokens`
--

CREATE TABLE `bsc_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `bsc_token_daily`
--

CREATE TABLE `bsc_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `bsc_token_live`
--

CREATE TABLE `bsc_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `celo_changes`
--

CREATE TABLE `celo_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `celo_daily`
--

CREATE TABLE `celo_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `celo_live`
--

CREATE TABLE `celo_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `celo_pairs`
--

CREATE TABLE `celo_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `celo_past`
--

CREATE TABLE `celo_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `celo_tokens`
--

CREATE TABLE `celo_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `celo_token_daily`
--

CREATE TABLE `celo_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `celo_token_live`
--

CREATE TABLE `celo_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `cronos_changes`
--

CREATE TABLE `cronos_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `cronos_daily`
--

CREATE TABLE `cronos_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `cronos_live`
--

CREATE TABLE `cronos_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `cronos_pairs`
--

CREATE TABLE `cronos_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `cronos_past`
--

CREATE TABLE `cronos_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `cronos_tokens`
--

CREATE TABLE `cronos_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `cronos_token_daily`
--

CREATE TABLE `cronos_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `cronos_token_live`
--

CREATE TABLE `cronos_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `elastos_changes`
--

CREATE TABLE `elastos_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `elastos_daily`
--

CREATE TABLE `elastos_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `elastos_live`
--

CREATE TABLE `elastos_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `elastos_pairs`
--

CREATE TABLE `elastos_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `elastos_past`
--

CREATE TABLE `elastos_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `elastos_tokens`
--

CREATE TABLE `elastos_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `elastos_token_daily`
--

CREATE TABLE `elastos_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `elastos_token_live`
--

CREATE TABLE `elastos_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `emerald_changes`
--

CREATE TABLE `emerald_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `emerald_daily`
--

CREATE TABLE `emerald_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `emerald_live`
--

CREATE TABLE `emerald_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `emerald_pairs`
--

CREATE TABLE `emerald_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `emerald_past`
--

CREATE TABLE `emerald_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `emerald_tokens`
--

CREATE TABLE `emerald_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `emerald_token_daily`
--

CREATE TABLE `emerald_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `emerald_token_live`
--

CREATE TABLE `emerald_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `eth_changes`
--

CREATE TABLE `eth_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `eth_daily`
--

CREATE TABLE `eth_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `eth_live`
--

CREATE TABLE `eth_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) NOT NULL DEFAULT '',
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double NOT NULL DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `eth_pairs`
--

CREATE TABLE `eth_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `eth_past`
--

CREATE TABLE `eth_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `eth_tokens`
--

CREATE TABLE `eth_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT '',
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `eth_token_daily`
--

CREATE TABLE `eth_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `eth_token_live`
--

CREATE TABLE `eth_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fantom_changes`
--

CREATE TABLE `fantom_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fantom_daily`
--

CREATE TABLE `fantom_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fantom_live`
--

CREATE TABLE `fantom_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fantom_pairs`
--

CREATE TABLE `fantom_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fantom_past`
--

CREATE TABLE `fantom_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fantom_tokens`
--

CREATE TABLE `fantom_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fantom_token_daily`
--

CREATE TABLE `fantom_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fantom_token_live`
--

CREATE TABLE `fantom_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fuse_changes`
--

CREATE TABLE `fuse_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fuse_daily`
--

CREATE TABLE `fuse_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fuse_live`
--

CREATE TABLE `fuse_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fuse_pairs`
--

CREATE TABLE `fuse_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fuse_past`
--

CREATE TABLE `fuse_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fuse_tokens`
--

CREATE TABLE `fuse_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fuse_token_daily`
--

CREATE TABLE `fuse_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fuse_token_live`
--

CREATE TABLE `fuse_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `harmony_changes`
--

CREATE TABLE `harmony_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `harmony_daily`
--

CREATE TABLE `harmony_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `harmony_live`
--

CREATE TABLE `harmony_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `harmony_pairs`
--

CREATE TABLE `harmony_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `harmony_past`
--

CREATE TABLE `harmony_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `harmony_tokens`
--

CREATE TABLE `harmony_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `harmony_token_daily`
--

CREATE TABLE `harmony_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `harmony_token_live`
--

CREATE TABLE `harmony_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `heco_changes`
--

CREATE TABLE `heco_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `heco_daily`
--

CREATE TABLE `heco_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `heco_live`
--

CREATE TABLE `heco_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `heco_pairs`
--

CREATE TABLE `heco_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `heco_past`
--

CREATE TABLE `heco_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `heco_tokens`
--

CREATE TABLE `heco_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `heco_token_daily`
--

CREATE TABLE `heco_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `heco_token_live`
--

CREATE TABLE `heco_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `hsc_changes`
--

CREATE TABLE `hsc_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `hsc_daily`
--

CREATE TABLE `hsc_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `hsc_live`
--

CREATE TABLE `hsc_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `hsc_pairs`
--

CREATE TABLE `hsc_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `hsc_past`
--

CREATE TABLE `hsc_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `hsc_tokens`
--

CREATE TABLE `hsc_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `hsc_token_daily`
--

CREATE TABLE `hsc_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `hsc_token_live`
--

CREATE TABLE `hsc_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `iotex_changes`
--

CREATE TABLE `iotex_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `iotex_daily`
--

CREATE TABLE `iotex_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `iotex_live`
--

CREATE TABLE `iotex_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `iotex_pairs`
--

CREATE TABLE `iotex_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `iotex_past`
--

CREATE TABLE `iotex_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `iotex_tokens`
--

CREATE TABLE `iotex_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `iotex_token_daily`
--

CREATE TABLE `iotex_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `iotex_token_live`
--

CREATE TABLE `iotex_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kardia_changes`
--

CREATE TABLE `kardia_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kardia_daily`
--

CREATE TABLE `kardia_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kardia_live`
--

CREATE TABLE `kardia_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kardia_pairs`
--

CREATE TABLE `kardia_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kardia_past`
--

CREATE TABLE `kardia_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kardia_tokens`
--

CREATE TABLE `kardia_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kardia_token_daily`
--

CREATE TABLE `kardia_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kardia_token_live`
--

CREATE TABLE `kardia_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kcc_changes`
--

CREATE TABLE `kcc_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kcc_daily`
--

CREATE TABLE `kcc_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kcc_live`
--

CREATE TABLE `kcc_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kcc_pairs`
--

CREATE TABLE `kcc_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kcc_past`
--

CREATE TABLE `kcc_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kcc_tokens`
--

CREATE TABLE `kcc_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kcc_token_daily`
--

CREATE TABLE `kcc_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `kcc_token_live`
--

CREATE TABLE `kcc_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `main_coins`
--

CREATE TABLE `main_coins` (
  `coin_id` int(11) NOT NULL,
  `coin_symbol` varchar(255) DEFAULT NULL,
  `coin_name` varchar(255) DEFAULT NULL,
  `coin_net` varchar(255) DEFAULT NULL,
  `coin_total_supply` double DEFAULT NULL,
  `coin_token_address` varchar(255) DEFAULT NULL,
  `coin_geckoInfo` longtext DEFAULT NULL,
  `coin_totalHolders` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `main_coin_list`
--

CREATE TABLE `main_coin_list` (
  `ranking` int(11) NOT NULL DEFAULT 0,
  `tokenAddress` varchar(255) NOT NULL,
  `network` varchar(255) DEFAULT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `pricenow` double DEFAULT NULL,
  `trans24h` int(11) DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0,
  `marketcap` double DEFAULT NULL,
  `coinName` varchar(255) DEFAULT NULL,
  `coinSymbol` varchar(255) DEFAULT NULL,
  `coinImage` text DEFAULT NULL,
  `localImage` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `main_daily`
--

CREATE TABLE `main_daily` (
  `coin_id` int(11) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `volume` double DEFAULT NULL,
  `volumeUSD` double DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `transactions` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `main_live`
--

CREATE TABLE `main_live` (
  `coin_id` int(11) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapAmountUSD` double DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `metis_changes`
--

CREATE TABLE `metis_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `metis_daily`
--

CREATE TABLE `metis_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `metis_live`
--

CREATE TABLE `metis_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `metis_pairs`
--

CREATE TABLE `metis_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `metis_past`
--

CREATE TABLE `metis_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `metis_tokens`
--

CREATE TABLE `metis_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `metis_token_daily`
--

CREATE TABLE `metis_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `metis_token_live`
--

CREATE TABLE `metis_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonbeam_changes`
--

CREATE TABLE `moonbeam_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonbeam_daily`
--

CREATE TABLE `moonbeam_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonbeam_live`
--

CREATE TABLE `moonbeam_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonbeam_pairs`
--

CREATE TABLE `moonbeam_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonbeam_past`
--

CREATE TABLE `moonbeam_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonbeam_tokens`
--

CREATE TABLE `moonbeam_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonbeam_token_daily`
--

CREATE TABLE `moonbeam_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonbeam_token_live`
--

CREATE TABLE `moonbeam_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonriver_changes`
--

CREATE TABLE `moonriver_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonriver_daily`
--

CREATE TABLE `moonriver_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonriver_live`
--

CREATE TABLE `moonriver_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonriver_pairs`
--

CREATE TABLE `moonriver_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonriver_past`
--

CREATE TABLE `moonriver_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonriver_tokens`
--

CREATE TABLE `moonriver_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonriver_token_daily`
--

CREATE TABLE `moonriver_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `moonriver_token_live`
--

CREATE TABLE `moonriver_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `okc_changes`
--

CREATE TABLE `okc_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `okc_daily`
--

CREATE TABLE `okc_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `okc_live`
--

CREATE TABLE `okc_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `okc_pairs`
--

CREATE TABLE `okc_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `okc_past`
--

CREATE TABLE `okc_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `okc_tokens`
--

CREATE TABLE `okc_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `okc_token_daily`
--

CREATE TABLE `okc_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `okc_token_live`
--

CREATE TABLE `okc_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `optimism_changes`
--

CREATE TABLE `optimism_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `optimism_daily`
--

CREATE TABLE `optimism_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `optimism_live`
--

CREATE TABLE `optimism_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `optimism_pairs`
--

CREATE TABLE `optimism_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `optimism_past`
--

CREATE TABLE `optimism_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `optimism_tokens`
--

CREATE TABLE `optimism_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `optimism_token_daily`
--

CREATE TABLE `optimism_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `optimism_token_live`
--

CREATE TABLE `optimism_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polis_changes`
--

CREATE TABLE `polis_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polis_daily`
--

CREATE TABLE `polis_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polis_live`
--

CREATE TABLE `polis_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polis_pairs`
--

CREATE TABLE `polis_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polis_past`
--

CREATE TABLE `polis_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polis_tokens`
--

CREATE TABLE `polis_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polis_token_daily`
--

CREATE TABLE `polis_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polis_token_live`
--

CREATE TABLE `polis_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polygon_changes`
--

CREATE TABLE `polygon_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polygon_daily`
--

CREATE TABLE `polygon_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polygon_live`
--

CREATE TABLE `polygon_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polygon_pairs`
--

CREATE TABLE `polygon_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polygon_past`
--

CREATE TABLE `polygon_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polygon_tokens`
--

CREATE TABLE `polygon_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polygon_token_daily`
--

CREATE TABLE `polygon_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `polygon_token_live`
--

CREATE TABLE `polygon_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `smartbch_changes`
--

CREATE TABLE `smartbch_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `smartbch_daily`
--

CREATE TABLE `smartbch_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `smartbch_live`
--

CREATE TABLE `smartbch_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `smartbch_pairs`
--

CREATE TABLE `smartbch_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `smartbch_past`
--

CREATE TABLE `smartbch_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `smartbch_tokens`
--

CREATE TABLE `smartbch_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `smartbch_token_daily`
--

CREATE TABLE `smartbch_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `smartbch_token_live`
--

CREATE TABLE `smartbch_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `velas_changes`
--

CREATE TABLE `velas_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `velas_daily`
--

CREATE TABLE `velas_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `velas_live`
--

CREATE TABLE `velas_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `velas_pairs`
--

CREATE TABLE `velas_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `velas_past`
--

CREATE TABLE `velas_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `velas_tokens`
--

CREATE TABLE `velas_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `velas_token_daily`
--

CREATE TABLE `velas_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `velas_token_live`
--

CREATE TABLE `velas_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `wan_changes`
--

CREATE TABLE `wan_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `wan_daily`
--

CREATE TABLE `wan_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `wan_live`
--

CREATE TABLE `wan_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `wan_pairs`
--

CREATE TABLE `wan_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `wan_past`
--

CREATE TABLE `wan_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `wan_tokens`
--

CREATE TABLE `wan_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `wan_token_daily`
--

CREATE TABLE `wan_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `wan_token_live`
--

CREATE TABLE `wan_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `xdai_changes`
--

CREATE TABLE `xdai_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `xdai_daily`
--

CREATE TABLE `xdai_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `xdai_live`
--

CREATE TABLE `xdai_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `xdai_pairs`
--

CREATE TABLE `xdai_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `xdai_past`
--

CREATE TABLE `xdai_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `xdai_tokens`
--

CREATE TABLE `xdai_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `xdai_token_daily`
--

CREATE TABLE `xdai_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `xdai_token_live`
--

CREATE TABLE `xdai_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `zyx_changes`
--

CREATE TABLE `zyx_changes` (
  `tokenAddress` varchar(255) NOT NULL,
  `price24h` double DEFAULT 0,
  `price12h` double DEFAULT 0,
  `price6h` double DEFAULT 0,
  `price2h` double DEFAULT 0,
  `price1h` double DEFAULT 0,
  `price30m` double DEFAULT 0,
  `price5m` double DEFAULT 0,
  `trans24h` int(11) DEFAULT 0,
  `trans12h` int(11) DEFAULT 0,
  `trans6h` int(11) DEFAULT 0,
  `trans2h` int(11) DEFAULT 0,
  `trans1h` int(11) DEFAULT 0,
  `trans30m` int(11) DEFAULT 0,
  `trans5m` int(11) DEFAULT 0,
  `transToday` int(11) NOT NULL DEFAULT 0,
  `volume24h` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `zyx_daily`
--

CREATE TABLE `zyx_daily` (
  `PAIRADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME0` double DEFAULT NULL,
  `VOLUME1` double DEFAULT NULL,
  `TOTALVOLUME0` double DEFAULT NULL,
  `TOTALVOLUME1` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `zyx_live`
--

CREATE TABLE `zyx_live` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `priceUSD` double DEFAULT 0,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `zyx_pairs`
--

CREATE TABLE `zyx_pairs` (
  `token0Address` varchar(255) DEFAULT NULL,
  `token1Address` varchar(255) DEFAULT NULL,
  `factoryAddress` varchar(255) DEFAULT NULL,
  `pairAddress` varchar(255) NOT NULL,
  `lastPrice` double DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `baseToken` tinyint(255) DEFAULT 0,
  `decimals` int(255) DEFAULT NULL,
  `liquidity` double NOT NULL DEFAULT 0,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `zyx_past`
--

CREATE TABLE `zyx_past` (
  `pairAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount0` double DEFAULT NULL,
  `swapAmount1` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL,
  `isBuy` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `zyx_tokens`
--

CREATE TABLE `zyx_tokens` (
  `tokenAddress` varchar(255) NOT NULL,
  `tokenSymbol` varchar(255) DEFAULT NULL,
  `tokenName` text DEFAULT NULL,
  `tokenDecimals` int(255) DEFAULT NULL,
  `sourceCode` longtext DEFAULT NULL,
  `coingeckoInfos` longtext DEFAULT NULL,
  `totalSupply` double DEFAULT NULL,
  `totalHolders` int(11) DEFAULT NULL,
  `holders` longtext DEFAULT NULL,
  `links` longtext DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `lastPrice` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `zyx_token_daily`
--

CREATE TABLE `zyx_token_daily` (
  `TOKENADDRESS` varchar(255) DEFAULT NULL,
  `SWAPAT` timestamp NULL DEFAULT NULL,
  `AVGPRICE` double DEFAULT NULL,
  `MAXPRICE` double DEFAULT NULL,
  `MINPRICE` double DEFAULT NULL,
  `VOLUME` double DEFAULT NULL,
  `SWAPCOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `zyx_token_live`
--

CREATE TABLE `zyx_token_live` (
  `tokenAddress` varchar(255) DEFAULT NULL,
  `swapPrice` double DEFAULT NULL,
  `swapAmount` double DEFAULT NULL,
  `swapMaker` varchar(255) DEFAULT NULL,
  `swapTransactionHash` varchar(255) DEFAULT NULL,
  `swapAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `arbitrum_changes`
--
ALTER TABLE `arbitrum_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `arbitrum_daily`
--
ALTER TABLE `arbitrum_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `arbitrum_pairs`
--
ALTER TABLE `arbitrum_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `arbitrum_tokens`
--
ALTER TABLE `arbitrum_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `arbitrum_token_daily`
--
ALTER TABLE `arbitrum_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `arbitrum_token_live`
--
ALTER TABLE `arbitrum_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `aurora_changes`
--
ALTER TABLE `aurora_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `aurora_daily`
--
ALTER TABLE `aurora_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `aurora_live`
--
ALTER TABLE `aurora_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `aurora_pairs`
--
ALTER TABLE `aurora_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `aurora_tokens`
--
ALTER TABLE `aurora_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `aurora_token_daily`
--
ALTER TABLE `aurora_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `aurora_token_live`
--
ALTER TABLE `aurora_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `avalanche_changes`
--
ALTER TABLE `avalanche_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `avalanche_daily`
--
ALTER TABLE `avalanche_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `avalanche_live`
--
ALTER TABLE `avalanche_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `avalanche_pairs`
--
ALTER TABLE `avalanche_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `avalanche_tokens`
--
ALTER TABLE `avalanche_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `avalanche_token_daily`
--
ALTER TABLE `avalanche_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `avalanche_token_live`
--
ALTER TABLE `avalanche_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `boba_changes`
--
ALTER TABLE `boba_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `boba_daily`
--
ALTER TABLE `boba_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `boba_live`
--
ALTER TABLE `boba_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `boba_pairs`
--
ALTER TABLE `boba_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `boba_tokens`
--
ALTER TABLE `boba_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `boba_token_daily`
--
ALTER TABLE `boba_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `boba_token_live`
--
ALTER TABLE `boba_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `bsc_changes`
--
ALTER TABLE `bsc_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `bsc_daily`
--
ALTER TABLE `bsc_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `bsc_live`
--
ALTER TABLE `bsc_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `bsc_pairs`
--
ALTER TABLE `bsc_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `bsc_tokens`
--
ALTER TABLE `bsc_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `bsc_token_daily`
--
ALTER TABLE `bsc_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `bsc_token_live`
--
ALTER TABLE `bsc_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `celo_changes`
--
ALTER TABLE `celo_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `celo_daily`
--
ALTER TABLE `celo_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `celo_live`
--
ALTER TABLE `celo_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `celo_pairs`
--
ALTER TABLE `celo_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `celo_tokens`
--
ALTER TABLE `celo_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `celo_token_daily`
--
ALTER TABLE `celo_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `celo_token_live`
--
ALTER TABLE `celo_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `cronos_changes`
--
ALTER TABLE `cronos_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `cronos_daily`
--
ALTER TABLE `cronos_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `cronos_live`
--
ALTER TABLE `cronos_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `cronos_pairs`
--
ALTER TABLE `cronos_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `cronos_tokens`
--
ALTER TABLE `cronos_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `cronos_token_daily`
--
ALTER TABLE `cronos_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `cronos_token_live`
--
ALTER TABLE `cronos_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `elastos_changes`
--
ALTER TABLE `elastos_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `elastos_daily`
--
ALTER TABLE `elastos_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `elastos_live`
--
ALTER TABLE `elastos_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `elastos_pairs`
--
ALTER TABLE `elastos_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `elastos_tokens`
--
ALTER TABLE `elastos_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `elastos_token_daily`
--
ALTER TABLE `elastos_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `elastos_token_live`
--
ALTER TABLE `elastos_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `emerald_changes`
--
ALTER TABLE `emerald_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `emerald_daily`
--
ALTER TABLE `emerald_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `emerald_live`
--
ALTER TABLE `emerald_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `emerald_pairs`
--
ALTER TABLE `emerald_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `emerald_tokens`
--
ALTER TABLE `emerald_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `emerald_token_daily`
--
ALTER TABLE `emerald_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `emerald_token_live`
--
ALTER TABLE `emerald_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `eth_changes`
--
ALTER TABLE `eth_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `eth_daily`
--
ALTER TABLE `eth_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `eth_live`
--
ALTER TABLE `eth_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `eth_pairs`
--
ALTER TABLE `eth_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `eth_tokens`
--
ALTER TABLE `eth_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `eth_token_daily`
--
ALTER TABLE `eth_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `eth_token_live`
--
ALTER TABLE `eth_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `fantom_changes`
--
ALTER TABLE `fantom_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `fantom_daily`
--
ALTER TABLE `fantom_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `fantom_live`
--
ALTER TABLE `fantom_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `fantom_pairs`
--
ALTER TABLE `fantom_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `fantom_tokens`
--
ALTER TABLE `fantom_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `fantom_token_daily`
--
ALTER TABLE `fantom_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `fantom_token_live`
--
ALTER TABLE `fantom_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `fuse_changes`
--
ALTER TABLE `fuse_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `fuse_daily`
--
ALTER TABLE `fuse_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `fuse_live`
--
ALTER TABLE `fuse_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `fuse_pairs`
--
ALTER TABLE `fuse_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `fuse_tokens`
--
ALTER TABLE `fuse_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `fuse_token_daily`
--
ALTER TABLE `fuse_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `fuse_token_live`
--
ALTER TABLE `fuse_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `harmony_changes`
--
ALTER TABLE `harmony_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `harmony_daily`
--
ALTER TABLE `harmony_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `harmony_live`
--
ALTER TABLE `harmony_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `harmony_pairs`
--
ALTER TABLE `harmony_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `harmony_tokens`
--
ALTER TABLE `harmony_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `harmony_token_daily`
--
ALTER TABLE `harmony_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `harmony_token_live`
--
ALTER TABLE `harmony_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `heco_changes`
--
ALTER TABLE `heco_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `heco_daily`
--
ALTER TABLE `heco_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `heco_live`
--
ALTER TABLE `heco_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `heco_pairs`
--
ALTER TABLE `heco_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `heco_tokens`
--
ALTER TABLE `heco_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `heco_token_daily`
--
ALTER TABLE `heco_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `heco_token_live`
--
ALTER TABLE `heco_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `hsc_changes`
--
ALTER TABLE `hsc_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `hsc_daily`
--
ALTER TABLE `hsc_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `hsc_live`
--
ALTER TABLE `hsc_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `hsc_pairs`
--
ALTER TABLE `hsc_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `hsc_tokens`
--
ALTER TABLE `hsc_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `hsc_token_daily`
--
ALTER TABLE `hsc_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `hsc_token_live`
--
ALTER TABLE `hsc_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `iotex_changes`
--
ALTER TABLE `iotex_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `iotex_daily`
--
ALTER TABLE `iotex_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `iotex_live`
--
ALTER TABLE `iotex_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `iotex_pairs`
--
ALTER TABLE `iotex_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `iotex_tokens`
--
ALTER TABLE `iotex_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `iotex_token_daily`
--
ALTER TABLE `iotex_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `iotex_token_live`
--
ALTER TABLE `iotex_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `kardia_changes`
--
ALTER TABLE `kardia_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `kardia_daily`
--
ALTER TABLE `kardia_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `kardia_live`
--
ALTER TABLE `kardia_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `kardia_pairs`
--
ALTER TABLE `kardia_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `kardia_tokens`
--
ALTER TABLE `kardia_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `kardia_token_daily`
--
ALTER TABLE `kardia_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `kardia_token_live`
--
ALTER TABLE `kardia_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `kcc_changes`
--
ALTER TABLE `kcc_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `kcc_daily`
--
ALTER TABLE `kcc_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `kcc_live`
--
ALTER TABLE `kcc_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `kcc_pairs`
--
ALTER TABLE `kcc_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `kcc_tokens`
--
ALTER TABLE `kcc_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `kcc_token_daily`
--
ALTER TABLE `kcc_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `kcc_token_live`
--
ALTER TABLE `kcc_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `main_coins`
--
ALTER TABLE `main_coins`
  ADD PRIMARY KEY (`coin_id`) USING BTREE;

--
-- Indexes for table `main_coin_list`
--
ALTER TABLE `main_coin_list`
  ADD KEY `tokenAddress` (`tokenAddress`,`network`);

--
-- Indexes for table `main_live`
--
ALTER TABLE `main_live`
  ADD KEY `coin_id` (`coin_id`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `metis_changes`
--
ALTER TABLE `metis_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `metis_daily`
--
ALTER TABLE `metis_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `metis_live`
--
ALTER TABLE `metis_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `metis_pairs`
--
ALTER TABLE `metis_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `metis_tokens`
--
ALTER TABLE `metis_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `metis_token_daily`
--
ALTER TABLE `metis_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `metis_token_live`
--
ALTER TABLE `metis_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `moonbeam_changes`
--
ALTER TABLE `moonbeam_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `moonbeam_daily`
--
ALTER TABLE `moonbeam_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `moonbeam_live`
--
ALTER TABLE `moonbeam_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `moonbeam_pairs`
--
ALTER TABLE `moonbeam_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `moonbeam_tokens`
--
ALTER TABLE `moonbeam_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `moonbeam_token_daily`
--
ALTER TABLE `moonbeam_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `moonbeam_token_live`
--
ALTER TABLE `moonbeam_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `moonriver_changes`
--
ALTER TABLE `moonriver_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `moonriver_daily`
--
ALTER TABLE `moonriver_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `moonriver_live`
--
ALTER TABLE `moonriver_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `moonriver_pairs`
--
ALTER TABLE `moonriver_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `moonriver_tokens`
--
ALTER TABLE `moonriver_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `moonriver_token_daily`
--
ALTER TABLE `moonriver_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `moonriver_token_live`
--
ALTER TABLE `moonriver_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `okc_changes`
--
ALTER TABLE `okc_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `okc_daily`
--
ALTER TABLE `okc_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `okc_live`
--
ALTER TABLE `okc_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `okc_pairs`
--
ALTER TABLE `okc_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `okc_tokens`
--
ALTER TABLE `okc_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `okc_token_daily`
--
ALTER TABLE `okc_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `okc_token_live`
--
ALTER TABLE `okc_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `optimism_changes`
--
ALTER TABLE `optimism_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `optimism_daily`
--
ALTER TABLE `optimism_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `optimism_live`
--
ALTER TABLE `optimism_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `optimism_pairs`
--
ALTER TABLE `optimism_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `optimism_tokens`
--
ALTER TABLE `optimism_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `optimism_token_daily`
--
ALTER TABLE `optimism_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `optimism_token_live`
--
ALTER TABLE `optimism_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `polis_changes`
--
ALTER TABLE `polis_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `polis_daily`
--
ALTER TABLE `polis_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `polis_live`
--
ALTER TABLE `polis_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `polis_pairs`
--
ALTER TABLE `polis_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `polis_tokens`
--
ALTER TABLE `polis_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `polis_token_daily`
--
ALTER TABLE `polis_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `polis_token_live`
--
ALTER TABLE `polis_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `polygon_changes`
--
ALTER TABLE `polygon_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `polygon_daily`
--
ALTER TABLE `polygon_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `polygon_live`
--
ALTER TABLE `polygon_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `polygon_pairs`
--
ALTER TABLE `polygon_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `polygon_tokens`
--
ALTER TABLE `polygon_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `polygon_token_daily`
--
ALTER TABLE `polygon_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `polygon_token_live`
--
ALTER TABLE `polygon_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `smartbch_changes`
--
ALTER TABLE `smartbch_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `smartbch_daily`
--
ALTER TABLE `smartbch_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `smartbch_live`
--
ALTER TABLE `smartbch_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `smartbch_pairs`
--
ALTER TABLE `smartbch_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `smartbch_tokens`
--
ALTER TABLE `smartbch_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `smartbch_token_daily`
--
ALTER TABLE `smartbch_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `smartbch_token_live`
--
ALTER TABLE `smartbch_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `velas_changes`
--
ALTER TABLE `velas_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `velas_daily`
--
ALTER TABLE `velas_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `velas_live`
--
ALTER TABLE `velas_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `velas_pairs`
--
ALTER TABLE `velas_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `velas_tokens`
--
ALTER TABLE `velas_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `velas_token_daily`
--
ALTER TABLE `velas_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `velas_token_live`
--
ALTER TABLE `velas_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `wan_changes`
--
ALTER TABLE `wan_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `wan_daily`
--
ALTER TABLE `wan_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `wan_live`
--
ALTER TABLE `wan_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `wan_pairs`
--
ALTER TABLE `wan_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `wan_tokens`
--
ALTER TABLE `wan_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `wan_token_daily`
--
ALTER TABLE `wan_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `wan_token_live`
--
ALTER TABLE `wan_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `xdai_changes`
--
ALTER TABLE `xdai_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `xdai_daily`
--
ALTER TABLE `xdai_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `xdai_live`
--
ALTER TABLE `xdai_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `xdai_pairs`
--
ALTER TABLE `xdai_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `xdai_tokens`
--
ALTER TABLE `xdai_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `xdai_token_daily`
--
ALTER TABLE `xdai_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `xdai_token_live`
--
ALTER TABLE `xdai_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- Indexes for table `zyx_changes`
--
ALTER TABLE `zyx_changes`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `zyx_daily`
--
ALTER TABLE `zyx_daily`
  ADD KEY `PAIRADDRESS` (`PAIRADDRESS`);

--
-- Indexes for table `zyx_live`
--
ALTER TABLE `zyx_live`
  ADD KEY `pairAddress` (`pairAddress`,`tokenAddress`),
  ADD KEY `swapAt` (`swapAt`);

--
-- Indexes for table `zyx_pairs`
--
ALTER TABLE `zyx_pairs`
  ADD PRIMARY KEY (`pairAddress`) USING BTREE;

--
-- Indexes for table `zyx_tokens`
--
ALTER TABLE `zyx_tokens`
  ADD PRIMARY KEY (`tokenAddress`) USING BTREE;

--
-- Indexes for table `zyx_token_daily`
--
ALTER TABLE `zyx_token_daily`
  ADD KEY `TOKENADDRESS` (`TOKENADDRESS`);

--
-- Indexes for table `zyx_token_live`
--
ALTER TABLE `zyx_token_live`
  ADD KEY `tokenAddress` (`tokenAddress`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `main_coins`
--
ALTER TABLE `main_coins`
  MODIFY `coin_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

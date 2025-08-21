import { Address, BigDecimal, BigInt, ethereum, log } from '@graphprotocol/graph-ts';
import { OracleContract } from "../../generated/templates/VaultListener/OracleContract";
import {
  BD_18,
  BD_ONE,
  BD_ONE_TRILLION,
  BD_TEN,
  BI_18, CURVE_FRAX_ALCX,
  DEFAULT_DECIMAL,
  DEFAULT_PRICE,
  ETH_BALANCER_POOL,
  getFarmToken,
  getOracleAddress,
  I_FARM_TOKEN,
  isEth,
  isPsAddress,
  isStableCoin,
  LV_USD_3_CRV,
  NOTIONAL_ORACLE_ADDRESS,
  NULL_ADDRESS,
  PETH_CRV,
  UNI_V3_WBTC_WETH,
  UNISWAP_V3_CNG_ETH,
  UNISWAP_V3_DAI_USDC,
  UNISWAP_V3_STETH_WETH,
  USD_BALANCER_POOL,
  WETH,
} from './Constant';
import { Token, Vault } from "../../generated/schema";
import { UniswapV2PairContract } from "../../generated/ExclusiveRewardPoolListener/UniswapV2PairContract";
import { WeightedPool2TokensContract } from "../../generated/templates/VaultListener/WeightedPool2TokensContract";
import { BalancerVaultContract } from "../../generated/templates/VaultListener/BalancerVaultContract";
import { CurveVaultContract } from "../../generated/templates/VaultListener/CurveVaultContract";
import { CurveMinterContract } from "../../generated/templates/VaultListener/CurveMinterContract";
import { getUniswapPoolV3ByVault } from "./UniswapV3PoolUtils";
import { UniswapV3PoolContract } from "../../generated/ExclusiveRewardPoolListener/UniswapV3PoolContract";
import { fetchContractDecimal } from "./ERC20Utils";
import { pow, powBI } from "./MathUtils";
import { NotionalToken } from "../../generated/templates/VaultListener/NotionalToken";
import { NotionalOracle } from "../../generated/templates/VaultListener/NotionalOracle";
import {
  isBalancer,
  isBalancerContract,
  isCurve,
  isLpUniPair,
  isNotional,
  isPendle,
  isUniswapV3,
} from './PlatformUtils';
import { ERC20 } from '../../generated/Storage/ERC20';
import { createPriceFeed } from '../types/PriceFeed';
import { fetchPricePerFullShare } from './VaultUtils';
import { PendlePoolContract } from '../../generated/Storage/PendlePoolContract';


export function getPriceForCoin(address: Address, block: number): BigInt {
  if (isStableCoin(address.toHex())) {
    return BI_18
  }
  const oracleAddress = getOracleAddress(block)
  if (oracleAddress != NULL_ADDRESS) {
    const oracle = OracleContract.bind(oracleAddress)
    let tryGetPrice = oracle.try_getPrice(address)
    if (tryGetPrice.reverted) {
      log.log(log.Level.WARNING, `Can not get price on block ${block} for address ${address.toHex()}`)
      return DEFAULT_PRICE
    }
    return tryGetPrice.value;
  }
  return DEFAULT_PRICE
}

export function getPriceByVault(vault: Vault, block: ethereum.Block): BigDecimal {
  let tempPrice = BigDecimal.zero();

  if (vault.id == I_FARM_TOKEN.toHexString()) {
    const price = getPriceForCoin(getFarmToken(), block.number.toI32())
    if (!price.isZero()) {
      tempPrice = price.divDecimal(BD_18)
      // const tempSP = fetchPricePerFullShare(Address.fromString(vault.id)).divDecimal(BD_18);
      // tempPrice = tempPrice.times(tempSP);
      // createPriceFeed(vault, tempPrice, block);
      // return tempPrice;
      return tempPrice;
    }
  } else if (isPsAddress(vault.id)) {
    const price = getPriceForCoin(getFarmToken(), block.number.toI32())
    if (!price.isZero()) {
      tempPrice = price.divDecimal(BD_18)
      createPriceFeed(vault, tempPrice, block);
      return tempPrice;
    }
    return BigDecimal.zero()
  }
  const underlyingAddress = vault.underlying

  if (underlyingAddress == NULL_ADDRESS.toHex()) {
    let price = getPriceForCoin(Address.fromString(vault.id), block.number.toI32())
    if (!price.isZero()) {
      tempPrice = price.divDecimal(BD_18)
      createPriceFeed(vault, tempPrice, block);
      return tempPrice;
    }
  }

  let price = getPriceForCoin(Address.fromString(underlyingAddress), block.number.toI32())
  if (!price.isZero()) {
    tempPrice = price.divDecimal(BD_18)
    createPriceFeed(vault, tempPrice, block);
    return tempPrice;
  }

  // is from uniSwapV3 pools
  if (isUniswapV3(vault.name)) {
    tempPrice = getPriceForUniswapV3(vault, block.number.toI32())
    createPriceFeed(vault, tempPrice, block);
    return tempPrice;
  }

  if (vault.id.toLowerCase() == LV_USD_3_CRV || vault.id.toLowerCase() == USD_BALANCER_POOL) {
    createPriceFeed(vault, BD_ONE, block);
    return BD_ONE;
  }

  if (isEth(vault.id.toLowerCase())) {
    tempPrice = getPriceForCoin(WETH, block.number.toI32()).divDecimal(BD_18);
    createPriceFeed(vault, tempPrice, block);
    return tempPrice;
  }

  const underlying = Token.load(underlyingAddress)
  if (underlying != null) {
    if (isEth(underlying.id.toLowerCase())) {
      tempPrice = getPriceForCoin(WETH, block.number.toI32()).divDecimal(BD_18);
      createPriceFeed(vault, tempPrice, block);
      return tempPrice;
    }
    if (isLpUniPair(underlying.name)) {
      const tempInPrice = getPriceForCoin(Address.fromString(underlyingAddress), block.number.toI32())
      if (tempInPrice.gt(DEFAULT_PRICE)) {
        tempPrice = tempInPrice.divDecimal(BD_18)
        createPriceFeed(vault, tempPrice, block);
        return tempPrice;
      }
      tempPrice = getPriceLpUniPair(underlying.id, block.number.toI32())
      createPriceFeed(vault, tempPrice, block);
      return tempPrice;
    }

    if (isCurve(underlying.name)) {
      const tempInPrice = getPriceForCoin(Address.fromString(underlying.id), block.number.toI32())
      if (!tempInPrice.isZero()) {
        tempPrice = tempInPrice.divDecimal(BD_18)
        createPriceFeed(vault, tempPrice, block);
        return tempPrice;
      }

      tempPrice = getPriceForCurve(underlyingAddress, block.number.toI32())
      createPriceFeed(vault, tempPrice, block);
      return tempPrice;
    }

    if (isNotional(underlying.name)) {
      tempPrice = getPriceForNotional(underlying, block.number.toI32())
      createPriceFeed(vault, tempPrice, block);
      return tempPrice;
    }

    if (isBalancer(underlying.name) || isBalancerContract(Address.fromString(underlying.id))) {
      tempPrice = getPriceForBalancer(underlying.id, block.number.toI32())
      createPriceFeed(vault, tempPrice, block);
      return tempPrice;
    }

    if (isPendle(underlying.name)) {
      tempPrice = getPriceForPendle(underlying, block.number.toI32())
      createPriceFeed(vault, tempPrice, block);
      return tempPrice;
    }
  }

  return BigDecimal.zero()
}

function getPriceForPendle(underlying: Token, block: number): BigDecimal {
  const pendleAddress = Address.fromString(underlying.id);
  const pendleContract = PendlePoolContract.bind(pendleAddress);

  const tryReadTokens = pendleContract.try_readTokens();
  if (tryReadTokens.reverted) {
    log.log(log.Level.WARNING, `Failed to read tokens from Pendle pool at ${pendleAddress.toHexString()}`);
    return BigDecimal.zero();
  }

  const tryReadState = pendleContract.try_readState(pendleAddress);
  if (tryReadState.reverted) {
    log.log(log.Level.WARNING, `Failed to read state from Pendle pool at ${pendleAddress.toHexString()}`);
    return BigDecimal.zero();
  }

  const state = tryReadState.value;
  const totalPt = state.totalPt.toBigDecimal();
  const totalSy = state.totalSy.toBigDecimal();

  if (totalPt.equals(BigDecimal.zero()) || totalSy.equals(BigDecimal.zero())) {
    log.log(log.Level.WARNING, `Total PT or SY in Pendle pool is zero at ${pendleAddress.toHexString()}`);
    return BigDecimal.zero();
  }

  const tokens = tryReadTokens.value;
  const pricePt = getPriceForCoin(tokens.get_PT(), block);
  const priceSy = getPriceForCoin(tokens.get_SY(), block);

  if (pricePt.isZero()) {
    log.log(log.Level.WARNING, `Price for PT token is zero`);
  }
  if (priceSy.isZero()) {
    log.log(log.Level.WARNING, `Price for SY token is zero`);
  }
  if (pricePt.isZero() || priceSy.isZero()) {
    return BigDecimal.zero();
  }

  return pricePt
    .divDecimal(BD_18)
    .times(totalPt)
    .plus(priceSy.divDecimal(BD_18).times(totalSy));
}

function getPriceForNotional(underlying: Token, block: number): BigDecimal {
  const notionalContract = NotionalToken.bind(Address.fromString(underlying.id))
  const tryCurrencyId = notionalContract.try_currencyId()
  if (tryCurrencyId.reverted) {
    return BigDecimal.zero()
  }

  const notionalOracle = NotionalOracle.bind(NOTIONAL_ORACLE_ADDRESS)
  const cToken = notionalOracle.getTokenConfig(BigInt.fromI32(tryCurrencyId.value)).cToken

  const price = getPriceForCoin(cToken, block)

  if (price.gt(BigInt.zero())) {
    return price.divDecimal(BD_18)
  }

  return BigDecimal.zero()
}

// ((token0Balance * token0Price) + (token1Balance * token1Price)) / (liquidity / 10 ** 18)
export function getPriceForUniswapV3(vault: Vault, block: number): BigDecimal {
  const poolAddress = getUniswapPoolV3ByVault(vault);
  if (!poolAddress.equals(NULL_ADDRESS)) {
    const pool = UniswapV3PoolContract.bind(poolAddress);
    const liquidity = pool.liquidity();
    const token0 = ERC20.bind(pool.token0());
    const token1 = ERC20.bind(pool.token1());
    const balanceToken0 = token0.balanceOf(poolAddress);
    const balanceToken1 = token1.balanceOf(poolAddress);
    const priceToken0 = getPriceForCoin(token0._address, block);
    const priceToken1 = getPriceForCoin(token1._address, block);

    const token0Decimals = token0.decimals();
    const token1Decimals = token1.decimals();

    if (
      priceToken0.isZero() ||
      liquidity.isZero() ||
      token0Decimals == 0 ||
      token1Decimals == 0 ||
      priceToken1.isZero() ||
      balanceToken1.isZero() ||
      balanceToken0.isZero()
    ) {
      return BigDecimal.zero();
    }

    const balance = priceToken0
      .divDecimal(BD_18)
      .times(balanceToken0.divDecimal(pow(BD_TEN, token0Decimals)))
      .plus(
        priceToken1
          .divDecimal(BD_18)
          .times(balanceToken1.divDecimal(pow(BD_TEN, token1Decimals)))
      );

    let price = balance.div(liquidity.divDecimal(BD_18));

    if (
      price.gt(BD_ONE_TRILLION) &&
      vault.id.toLowerCase() == UNI_V3_WBTC_WETH
    ) {
      return price.div(pow(BD_TEN, 3));
    }

    if (vault.id.toLowerCase() == UNISWAP_V3_CNG_ETH.toLowerCase()) {
      return price.div(BigDecimal.fromString('2'));
    }

    if (vault.id.toLowerCase() == UNISWAP_V3_DAI_USDC.toLowerCase()) {
      return price.div(BigDecimal.fromString('80'));
    }

    if (vault.id.toLowerCase() == UNISWAP_V3_STETH_WETH.toLowerCase()) {
      return price.times(BigDecimal.fromString('2'));
    }

    return price;
  }
  return BigDecimal.zero();
}

export function getPriceForCurve(underlyingAddress: string, block: number): BigDecimal {
  const curveContract = CurveVaultContract.bind(Address.fromString(underlyingAddress))
  const tryMinter = curveContract.try_minter()

  let minter = CurveMinterContract.bind(Address.fromString(underlyingAddress))
  if (!tryMinter.reverted) {
    minter = CurveMinterContract.bind(tryMinter.value)
  }

  let index = 0
  let tryCoins = minter.try_coins(BigInt.fromI32(index))
  while (!tryCoins.reverted) {
    const coin = tryCoins.value
    if (coin.equals(Address.zero())) {
      index = index - 1
      break
    }
    index = index + 1
    tryCoins = minter.try_coins(BigInt.fromI32(index))
  }
  const tryDecimals = curveContract.try_decimals()
  let decimal = DEFAULT_DECIMAL
  if (!tryDecimals.reverted) {
    decimal = tryDecimals.value.toI32()
  } else {
    log.log(log.Level.WARNING, `Can not get decimals for ${underlyingAddress}`)
  }
  const size = index + 1
  if (size < 1) {
    return BigDecimal.zero()
  }

  let value = BigDecimal.zero()

  for (let i=0;i<size;i++) {
    const index = BigInt.fromI32(i)
    const tryCoins1 = minter.try_coins(index)
    if (tryCoins1.reverted) {
      break
    }
    const token = tryCoins1.value
    const tokenPrice = getPriceForCoin(token, block).divDecimal(BD_18)
    const balance = minter.balances(index)
    const tryDecimalsTemp = ERC20.bind(token).try_decimals()
    let decimalsTemp = DEFAULT_DECIMAL
    if (!tryDecimalsTemp.reverted) {
      decimalsTemp = tryDecimalsTemp.value
    } else {
      log.log(log.Level.WARNING, `Can not get decimals for ${token}`)
    }
    const tempBalance = balance.toBigDecimal().div(pow(BD_TEN, decimalsTemp))

    value = value.plus(tokenPrice.times(tempBalance))
  }
  const totalSupply = curveContract.totalSupply().toBigDecimal();
  const multiplier = CURVE_FRAX_ALCX == underlyingAddress.toLowerCase() ? BigDecimal.fromString('2') : BigDecimal.fromString('1')
  if (totalSupply.gt(BigDecimal.zero())) {
    return value.times(BD_18).div(totalSupply).times(multiplier);
  }
  return BigDecimal.zero();
}

// amount / (10 ^ 18 / 10 ^ decimal)
function normalizePrecision(amount: BigInt, decimal: number): BigInt {
  return amount.div(BI_18.div(powBI(BigInt.fromI32(10), decimal)))
}

export function getPriceLpUniPair(underlyingAddress: string, block: number): BigDecimal {
  const uniswapV2Pair = UniswapV2PairContract.bind(Address.fromString(underlyingAddress))
  const tryGetReserves = uniswapV2Pair.try_getReserves()
  if (tryGetReserves.reverted) {
    log.log(log.Level.WARNING, `Can not get reserves for underlyingAddress = ${underlyingAddress}, try get price for coin`)

    return getPriceForCoin(Address.fromString(underlyingAddress), block).divDecimal(BD_18)
  }
  const reserves = tryGetReserves.value
  const totalSupply = uniswapV2Pair.totalSupply()
  const positionFraction = BD_ONE.div(totalSupply.toBigDecimal().div(BD_18))

  const token0 = uniswapV2Pair.token0()
  const token1 = uniswapV2Pair.token1()

  const firstCoin = reserves.get_reserve0().toBigDecimal().times(positionFraction)
    .div(pow(BD_TEN, fetchContractDecimal(token0).toI32()))
  const secondCoin = reserves.get_reserve1().toBigDecimal().times(positionFraction)
    .div(pow(BD_TEN, fetchContractDecimal(token1).toI32()))


  const token0Price = getPriceForCoin(token0, block)
  const token1Price = getPriceForCoin(token1, block)

  if (token0Price.isZero() || token1Price.isZero()) {
    return BigDecimal.zero()
  }

  return token0Price
    .divDecimal(BD_18)
    .times(firstCoin)
    .plus(
      token1Price
        .divDecimal(BD_18)
        .times(secondCoin)
    )
}

export function getPriceForBalancer(underlying: string, block: number): BigDecimal {
  const balancer = WeightedPool2TokensContract.bind(Address.fromString(underlying))
  const poolId = balancer.getPoolId()
  const totalSupply = balancer.totalSupply().divDecimal(BD_18)
  const vault = BalancerVaultContract.bind(balancer.getVault())
  const tokenInfo = vault.getPoolTokens(poolId)

  let price = BigDecimal.zero()
  for (let i=0;i<tokenInfo.getTokens().length;i++) {
    const token = tokenInfo.getTokens()[i]
    // TODO add recursive price
    const tokenPrice = getPriceForCoin(token, block)
    const tokenPriceAfterDiv = tokenPrice.divDecimal(BD_18)
    const tryDecimals = ERC20.bind(token).try_decimals()
    let decimal = DEFAULT_DECIMAL
    if (!tryDecimals.reverted) {
      decimal = tryDecimals.value
    }
    // const balance = normalizePrecision(tokenInfo.getBalances()[i], decimal).toBigDecimal()
    const balance = tokenInfo.getBalances()[i].divDecimal(pow(BD_TEN, decimal))

    price = price.plus(balance.times(tokenPriceAfterDiv))
  }

  if (price.le(BigDecimal.zero())) {
    return price
  }
  return price.div(totalSupply)
}

import { RewardAdded, RewardPaid } from "../generated/PotNotifyHelperListener/PotPoolContract";
import { PotPoolContract } from "../generated/templates/PotPoolListener/PotPoolContract";
import { saveReward } from "./types/Reward";
import { saveApyReward } from "./types/Apy";
import { handlerLogic } from './debug/HandlerCalculator';
import { Address, BigDecimal, BigInt, Bytes, store } from '@graphprotocol/graph-ts';
import { RewardPaidEntity, TokenPrice } from '../generated/schema';
import { loadOrCreatePotPool } from './types/PotPool';
import { loadOrCreateERC20Token } from './types/Token';
import { getPriceForCoin } from './utils/PriceUtils';
import { pow } from './utils/MathUtils';
import { BD_TEN, BI_EVERY_24_HOURS, FARM_TOKEN_MAINNET, I_FARM_TOKEN } from './utils/Constant';
import { VaultFarmContract } from '../generated/templates/StrategyListener/VaultFarmContract';

export function handleRewardAdded(event: RewardAdded): void {
  // handlerLogic(event.address.toHexString(), 'RewardAdded', event.transaction, event.block);
  const poolAddress = event.address
  const poolContract = PotPoolContract.bind(poolAddress)
  const rewardToken = poolContract.rewardToken()
  const rewardAmount = event.params.reward
  const rewardRate = poolContract.rewardRate()
  const periodFinish = poolContract.periodFinish()

  saveReward(poolAddress, rewardToken, rewardRate, periodFinish, rewardAmount, event.transaction, event.block)
  saveApyReward(poolAddress, rewardToken, rewardRate, periodFinish, rewardAmount, event.transaction, event.block)
}

export function handleRewardPaid(event: RewardPaid): void {
  const rewardPaid = new RewardPaidEntity(Bytes.fromUTF8(`${event.transaction.hash.toHex()}-${event.logIndex.toString()}`));
  rewardPaid.userAddress = event.params.user.toHexString();
  rewardPaid.pool = loadOrCreatePotPool(event.address, event.block).id;
  rewardPaid.value = event.params.reward;
  // price
  const rewardToken = loadOrCreateERC20Token(event.params.rewardToken);
  // TODO move logic token price for all project
  const tokenPriceId = event.params.rewardToken.toHexString();
  let tokenPrice = TokenPrice.load(tokenPriceId);
  if (tokenPrice == null) {
    tokenPrice = new TokenPrice(tokenPriceId);
    let tokenAdr = Address.fromString(tokenPriceId);
    let multi = BigDecimal.fromString('1');
    if (tokenPriceId.toLowerCase() == I_FARM_TOKEN.toHexString().toLowerCase()) {
      tokenAdr = FARM_TOKEN_MAINNET;
      multi = VaultFarmContract.bind(I_FARM_TOKEN).getPricePerFullShare().divDecimal(pow(BD_TEN, 18));
    }
    const price = getPriceForCoin(tokenAdr, event.block.number.toI32());
    let priceBD = BigDecimal.zero();

    if (price.gt(BigInt.zero())) {
      priceBD = price.divDecimal(pow(BD_TEN, rewardToken.decimals));
    }

    tokenPrice.price = priceBD.times(multi);
    tokenPrice.timestamp = event.block.timestamp;
    tokenPrice.save();
  }

  rewardPaid.price = tokenPrice.price;
  rewardPaid.token = rewardToken.id;
  rewardPaid.timestamp = event.block.timestamp;
  rewardPaid.createAtBlock = event.block.number;
  rewardPaid.save();

  if (tokenPrice.timestamp.plus(BI_EVERY_24_HOURS).lt(event.block.timestamp)) {
    store.remove('TokenPrice', tokenPriceId);
  }
}
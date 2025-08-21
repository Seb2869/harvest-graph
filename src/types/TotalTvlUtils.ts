import { PlasmaVault, TotalTvlCount, TotalTvlUtil } from '../../generated/schema';
import { Address, BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { BI_EVERY_7_DAYS, canCalculateTotalTvl, CONST_ID, EVERY_7_DAYS } from '../utils/Constant';
import { createTvl, createTvlV2 } from './Tvl';
import { loadOrCreateVault } from './Vault';

export function pushVault(address: string, block: ethereum.Block): void {
  const vaultUtils = getTvlUtils(block);

  let array = vaultUtils.vaults
  array.push(address)
  vaultUtils.vaults = array
  vaultUtils.save()
}

export function pushPlasmaVault(address: string, block: ethereum.Block): void {
  const vaultUtils = getTvlUtils(block);

  let array = vaultUtils.plasmaVaults
  if (array == null) {
    array = []
  }
  array.push(address)
  vaultUtils.plasmaVaults = array
  vaultUtils.save()
}

export function getTvlUtils(block: ethereum.Block): TotalTvlUtil {
  let vaultUtils = TotalTvlUtil.load(CONST_ID);
  if (vaultUtils == null) {
    vaultUtils = new TotalTvlUtil(CONST_ID)
    vaultUtils.vaults = [];
    vaultUtils.plasmaVaults = [];
    vaultUtils.lastTimestampUpdate = block.timestamp
    vaultUtils.timestamp = block.timestamp
    vaultUtils.createAtBlock = block.number
    vaultUtils.lastBlockUpdate = BigInt.zero();
    vaultUtils.save()
  }

  return vaultUtils;
}

export function canCalculateTotalTvlV2(block: ethereum.Block): void {
  const tvlUtil = getTvlUtils(block);

  if (tvlUtil.lastTimestampUpdate.plus(BI_EVERY_7_DAYS) > block.timestamp || tvlUtil.lastTimestampUpdate.isZero()) {
    createTotalTvl(block);
  }
}

export function createTotalTvl(block: ethereum.Block): void {
  const tvlUtils = getTvlUtils(block)
  let totalTvl = BigDecimal.zero()
  const array = tvlUtils.vaults
  for (let i = 0; i < array.length; i++) {
    const vault = Address.fromString(array[i]);
    if (canCalculateTotalTvl(vault.toHexString())) {
      const tvl = loadOrCreateVault(vault, block).tvl
      totalTvl = totalTvl.plus(tvl)
    }
  }

  // plasma vault logic
  const plasmaVaultsArray = tvlUtils.plasmaVaults
  if (plasmaVaultsArray) {
    for (let i = 0; i < plasmaVaultsArray.length; i++) {
      const plasma = PlasmaVault.load(plasmaVaultsArray[i])
      if (plasma) {
        totalTvl = totalTvl.plus(plasma.tvl)
      }
    }
  }

  createTvlV2(totalTvl, block);
  tvlUtils.lastTimestampUpdate = block.timestamp
  tvlUtils.lastBlockUpdate = block.number
  tvlUtils.save()
}


export function totalTvlUp(): BigInt {
  let totalCount = TotalTvlCount.load('1')
  if (!totalCount) {
    totalCount = new TotalTvlCount('1');
    totalCount.length = BigInt.zero();
  }

  totalCount.length = totalCount.length.plus(BigInt.fromString('1'));
  totalCount.save();
  return totalCount.length;
}
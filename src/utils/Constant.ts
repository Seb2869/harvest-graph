import { Address, BigDecimal, BigInt, dataSource, log } from '@graphprotocol/graph-ts';
import { pow } from "./MathUtils";

export const UNKNOWN = 'unknown';

export const EXCLUSIVE_REWARD_POOL = Address.fromString('0x8f5adC58b32D4e5Ca02EAC0E293D35855999436C')
export const UNISWAP_V3_VALUE = pow(pow(BigDecimal.fromString('2'), 96), 2)
export const SECONDS_OF_YEAR = BigDecimal.fromString('31557600');
export const DEFAULT_DECIMAL = 18;
export const DEFAULT_PRICE = BigInt.fromI32(0);
export const YEAR_PERIOD = BigDecimal.fromString('365')
export const BI_TEN = BigInt.fromI64(10)
export const BI_18 = BigInt.fromString('1000000000000000000')
export const BD_18 = BigDecimal.fromString('1000000000000000000')
export const BD_ZERO = BigDecimal.fromString('0')
export const BD_ONE = BigDecimal.fromString('1')
export const BD_TEN = BigDecimal.fromString('10')
export const BD_ONE_HUNDRED = BigDecimal.fromString('100')
export const CONST_ID = '1';
export const TWO_WEEKS_IN_SECONDS = BigInt.fromString('1209600');
// export const TWO_WEEKS_IN_SECONDS = BigInt.fromString('1209600');


export const TOTAL_TVL_FROM = BigInt.fromString('14522503')

export const TVL_WARN = BigDecimal.fromString('1000000000');
export const BD_ONE_TRILLION = BigDecimal.fromString('1000000000')

export const EVERY_24_HOURS = 86400;
export const BI_EVERY_24_HOURS = BigInt.fromString('86400');
export const EVERY_7_DAYS = 604800;
export const BI_EVERY_7_DAYS = BigInt.fromString('604800');
export const BI_EVERY_21_DAYS = BigInt.fromString('1814400');

export const MODULE_RESULT = 75600;
export const MODULE_RESULT_V2 = 518400;

export const STABLE_COIN_ARRAY_MAINNET = [
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'.toLowerCase(),
  '0xdAC17F958D2ee523a2206206994597C13D831ec7'.toLowerCase(),
  '0x0000000000085d4780B73119b644AE5ecd22b376'.toLowerCase(),
  '0x6B175474E89094C44Da98b954EedeAC495271d0F'.toLowerCase(),
  '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f'.toLowerCase(),
  '0x2F7350Cb5e434C2d177922110c7e314953B84Afc'.toLowerCase(),
  '0x91553BAD9Fbc8bD69Ff5d5678Cbf7D514d00De0b'.toLowerCase(),
  '0x2920f9fc667e780c0cb5a78a104d21413377f97e'.toLowerCase(),
  '0x0da210f60a179ee3364123943930dadbab8b210e'.toLowerCase(),
  '0xc2b021133d1b0cf07dba696fd5dd89338428225b'.toLowerCase(),
  // plasma usdc
  '0x3151cee0cdb517c0e7db2b55ff5085e7d1809d90'.toLowerCase(),
  // reUSD x sfrxUSD
  '0xed785Af60bEd688baa8990cD5c4166221599A441'.toLowerCase(),
  // reUSD x scrvUSD
  '0xc522A6606BBA746d7960404F22a3DB936B6F4F50'.toLowerCase(),
  // sUSD x sUSDe
  '0x4b5E827F4C0a1042272a11857a355dA1F4Ceebae'.toLowerCase(),
  '0x59a06b97b2d566B9Dee2a368EaC8787Cfa57f95D'.toLowerCase(),
]

export const STABLE_COIN_ARRAY_MATIC = [
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'.toLowerCase(),
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'.toLowerCase(),
  '0xE840B73E5287865EEc17d250bFb1536704B43B21'.toLowerCase(),
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'.toLowerCase(),
]

export const PS_ADDRESSES_MAINNET = [
  '0x1571ed0bed4d987fe2b498ddbae7dfa19519f651'.toLowerCase(),
  '0xd3093e3efbe00f010e8f5efe3f1cb5d9b7fe0eb1'.toLowerCase(),
  '0x8f5adc58b32d4e5ca02eac0e293d35855999436c'.toLowerCase(),
  '0xa0246c9032bc3a600820415ae600c6388619a14d'.toLowerCase(),
  '0x25550cccbd68533fa04bfd3e3ac4d09f9e00fc50'.toLowerCase(),
  '0x59258f4e15a5fc74a7284055a8094f58108dbd4f'.toLowerCase(),
]

export const PS_ADDRESSES_MATIC = [
  '0xab0b2ddb9c7e440fac8e140a89c0dbcbf2d7bbff'.toLowerCase(),
]

export const SKIP_APY_REWARD_MAINNET = [
  // FARMStead USDC-24
  '0xf6bd560131c1bb8591cf864cdd51817fd5657061'.toLowerCase(),
  // FARM/GRAIN
  '0xb9fa44b0911f6d777faab2fa9d8ef103f25ddf49'.toLowerCase()
]

export const VAULT_UNI_V3_CNG_WETH = '0xc3426599Ec933FbF657ee44b53e7f01d83Be1f63'.toLowerCase()
export const CNG = Address.fromString('0x5C1d9aA868a30795F92fAe903eDc9eFF269044bf')

export const UNI_V3_WBTC_WETH = '0x2357685b07469ee80a389819c7a41edcd70cd88c'.toLowerCase()
export const FARM_DAI = '0xe85c8581e60d7cd32bbfd86303d2a4fa6a951dac'.toLowerCase()
export const FARM_USDC = '0xc3f7ffb5d5869b3ade9448d094d81b0521e8326f'.toLowerCase()
export const FARM_USDT = '0xc7ee21406bb581e741fbb8b21f213188433d9f2f'.toLowerCase()
export const FARM_WBTC = '0xc07eb91961662d275e2d285bdc21885a4db136b0'.toLowerCase()
export const FARM_renBTC = '0xfbe122d0ba3c75e1f7c80bd27613c9f35b81feec'.toLowerCase()
export const FARM_crvRenWBTC = '0x192e9d29d43db385063799bc239e772c3b6888f3'.toLowerCase()
export const FARM_WETH = '0x8e298734681adbfc41ee5d17ff8b0d6d803e7098'.toLowerCase()
export const FARM_UNI_V2_FIRST = '0xb19ebfb37a936cce783142955d39ca70aa29d43c'.toLowerCase()
export const FARM_UNI_V2_SECOND = '0x1a9f22b4c385f78650e7874d64e442839dc32327'.toLowerCase()
export const FARM_UNI_V2_THIRD = '0x63671425ef4d25ec2b12c7d05de855c143f16e3b'.toLowerCase()
export const FARM_UNI_V2_FOURTH = '0xb1feb6ab4ef7d0f41363da33868e85eb0f3a57ee'.toLowerCase()
export const FARM_UNI_V2_FIVE = '0x25550cccbd68533fa04bfd3e3ac4d09f9e00fc50'.toLowerCase()
export const CURVE_FRAX_ALCX = '0xf985005a3793DbA4cCe241B3C19ddcd3Fe069ff4'.toLowerCase()

export const SKIP_TOTAL_TVL = [
  UNI_V3_WBTC_WETH,
  FARM_DAI,
  FARM_USDC,
  FARM_USDT,
  FARM_WBTC,
  FARM_renBTC,
  FARM_crvRenWBTC,
  FARM_WETH,
  FARM_UNI_V2_FIRST,
  FARM_UNI_V2_SECOND,
  FARM_UNI_V2_THIRD,
  FARM_UNI_V2_FOURTH,
  FARM_UNI_V2_FIVE,
  "0x2ce57694b635f6ea0087a341654543e12b082538",
  "0xe29385f6b90f25082972b75ccbc69900ce8a176a",
  "0xd3093e3efbe00f010e8f5efe3f1cb5d9b7fe0eb1",
  // iFarm
  "0x1571ed0bed4d987fe2b498ddbae7dfa19519f651",
  "0xfb387177ff9db15294f7aebb1ea1e941f55695bc",
  "0xd7b17297b9884aa73bf5e6e39e3cec107ffe6b17",
  "0x12db4a4c442944a10ed153db64c500beb006039f",
  "0x29ec64560ab14d3166222bf07c3f29c4916e0027",
  // fUniV3_USDC_WETH
  "0x0b4c4ea418cd596b1204c0dd07e419707149c7c6",
  // fUniV3_WETH_USDT
  '0x5c49e0386215077d1a3ecc425cc30ce34ec08b60',
  // FARM_crvRenWBTC
  '0x9aa8f427a17d6b0d91b6262989edc7d45d6aedf8',
  // fUniV3_DAI_WETH
  '0x970cc1e0bdb3b29a6a12bde1954a8509acbc9158',
  // fUniV3_WETH_sETH2
  '0x65383abd40f9f831018df243287f7ae3612c62ac'
]

export const LP_UNI_PAIR_CONTRACT_NAME = [
  '1inch'.toLowerCase(),
  'SushiSwap'.toLowerCase(),
  // only uniswap v2
  'Uniswap'.toLowerCase(),
  'Pancake'.toLowerCase(),
  'Kyber'.toLowerCase(),
  'Verse Exchange'.toLowerCase(),
]
export const BALANCER_CONTRACT_NAME = 'Balancer'.toLowerCase()
export const PENDLE_CONTRACT_NAME = 'Pendle'.toLowerCase()
export const CURVE_CONTRACT_NAME = 'Curve'.toLowerCase()
export const F_UNI_V3_CONTRACT_NAME = 'fUniV3'.toLowerCase()
export const NOTIONAL_CONTRACT_NAME = 'nToken'.toLowerCase()
export const I_FARM_NAME = 'iFARM'.toLowerCase()
export const UNISWAP_V3_CNG_ETH = '0xc3426599Ec933FbF657ee44b53e7f01d83Be1f63'.toLowerCase();
export const UNISWAP_V3_DAI_USDC = '0xFb387177fF9Db15294F7Aebb1ea1e941f55695bc'.toLowerCase();
export const UNISWAP_V3_STETH_WETH = '0x65383Abd40f9f831018dF243287F7AE3612c62AC'.toLowerCase();
export const UNISWAP_V3_FEES = [
  '3000',
  '5000',
  '8000',
  '10000'
]

export const BIG_APY_BD = BigDecimal.fromString('1000');

export const FARM_CONTRACTS = [
  // iFarm
  '0xa0246c9032bc3a600820415ae600c6388619a14d',
  // FARM
  '0x1571ed0bed4d987fe2b498ddbae7dfa19519f651',
  // Autostake
  '0x25550cccbd68533fa04bfd3e3ac4d09f9e00fc50',
]


export const I_FARM_TOKEN = Address.fromString('0x1571ed0bed4d987fe2b498ddbae7dfa19519f651')
export const FARM_TOKEN_MAINNET = Address.fromString('0xa0246c9032bc3a600820415ae600c6388619a14d')
export const FARM_TOKEN_MATIC = Address.fromString('0xab0b2ddb9c7e440fac8e140a89c0dbcbf2d7bbff')

export const ORACLE_ADDRESS_MAINNET_FIRST = Address.fromString('0x48DC32eCA58106f06b41dE514F29780FFA59c279');
export const ORACLE_ADDRESS_MAINNET_SECOND = Address.fromString('0x1358c91D5b25D3eDAc2b7B26A619163d78f1717d');
export const ORACLE_ADDRESS_MATIC = Address.fromString('0x0E74303d0D18884Ce2CEb3670e72686645c4f38B');

export const NOTIONAL_ORACLE_ADDRESS = Address.fromString('0x65c816077C29b557BEE980ae3cC2dCE80204A0C5')
export const MEGA_FACTORY_ADDRESS = Address.fromString('0xe1ec9151eb8d9a3451b8f623ce8b62632a6d4f4d')

export const NULL_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000');

export const LV_USD_3_CRV = '0xD86B672D1FcaE8667d2be188dB02846Cb3D7F8ae'.toLowerCase()
export const PETH_CRV = '0x4cf4f433e359a343648c480b2f3952fd64616a9a'.toLowerCase();
export const ETH_BALANCER_POOL = '0x80ef5ef7099c69bc9fcf952217240331f96bdf5f'.toLowerCase();
export const OETH_ETH = '0x924e022Ef8636FfA5971215e6Aac2652f7e9606e'.toLowerCase();
export const USD_BALANCER_POOL = '0x85472c764Ca52B189eB09497B683B2FD9cD79213'.toLowerCase();

export const WETH = Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');

export const ETH_LIST = [
  PETH_CRV,
  ETH_BALANCER_POOL,
  OETH_ETH,
  '0x06325440d014e39736583c165c2963ba99faf14e'.toLowerCase(),
  '0x3410463726a7a22ce0809367a4418fe82fc31fd3'.toLowerCase(),
  // Restaked LST eth
  '0x8c9532a60e0e7c6bbd2b2c1303f63ace1c3e9811'.toLowerCase()
]

export function isEth(address: string): boolean {
  for (let i=0;i<ETH_LIST.length;i++) {
    if (address.toLowerCase() == ETH_LIST[i]) {
      return true;
    }
  }
  return false;
}

export function isStableCoin(address: string): boolean {
  if (dataSource.network() == 'mainnet') {
    log.log(log.Level.INFO, `is isStableCoin`)
    return STABLE_COIN_ARRAY_MAINNET.join(' ').includes(address) == true
  } else if (dataSource.network() == 'matic') {
    return STABLE_COIN_ARRAY_MATIC.join(' ').includes(address) == true
  }
  return false
}

export function isPsAddress(address: string): boolean {
  if (dataSource.network() == 'mainnet') {
    return PS_ADDRESSES_MAINNET.join(' ').includes(address) == true
  } else if (dataSource.network() == 'matic') {
    return PS_ADDRESSES_MATIC.join(' ').includes(address) == true
  }
  return false
}

export function getOracleAddress(block: number): Address {
  if (dataSource.network() == 'mainnet') {
    if (block >= 12820106) {
      return ORACLE_ADDRESS_MAINNET_SECOND
    } else if (block >= 12015724) {
      return ORACLE_ADDRESS_MAINNET_FIRST
    }
  } else if (dataSource.network() == 'matic') {
    if (block >= 16841617) {
      return ORACLE_ADDRESS_MATIC
    }
  }

  return NULL_ADDRESS
}

export function getFarmToken(): Address {
  if (dataSource.network() == 'mainnet') {
    return FARM_TOKEN_MAINNET
  }
  if (dataSource.network() == 'matic') {
    return FARM_TOKEN_MATIC
  }
  return NULL_ADDRESS
}

export function skipCalculateApyReward(address: string): boolean {
  if (dataSource.network() == 'mainnet') {
    return SKIP_APY_REWARD_MAINNET.join(' ').includes(address) == true
  }
  return false
}

export function canCalculateTotalTvl(address: string): boolean {
  for (let i=0;i<SKIP_TOTAL_TVL.length;i++) {
    if (address.toLowerCase() == SKIP_TOTAL_TVL[i]) {
      return false;
    }
  }
  return true;
}
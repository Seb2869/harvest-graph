import { Bytes } from '@graphprotocol/graph-ts';

export function ensureEvenLength(hexString: string): string {
  return hexString.length % 2 === 0 ? hexString : '0' + hexString;
}

export function stringIdToBytes(value: string): Bytes {
  return Bytes.fromHexString(ensureEvenLength(value));
}
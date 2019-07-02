/**
 * @module index
 */
import { TRANSACTION_TYPE, IExchangeTransaction, WithId, WithSender } from '../transactions'
import { binary } from '@waves/marshall'
import { signBytes, blake2b } from '@waves/waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee } from '../generic'
import { TSeedTypes } from '../types'

/* @echo DOCS */
export function exchange(tx: IExchangeTransaction, seed?: TSeedTypes): IExchangeTransaction & WithId {

  const seedsAndIndexes = convertToPairs(seed)

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))

  return {...tx, id: blake2b(bytes)}
}
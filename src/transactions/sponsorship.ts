/**
 * @module index
 */
import { WithSender, ISponsorshipParams, } from '../transactions'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import { TRANSACTION_TYPE, TSponsorshipTransaction, TSponsorshipTransactionWithId  } from '@waves/ts-types'
import { addProof, getSenderPublicKey, convertToPairs, fee, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'


/* @echo DOCS */
export function sponsorship(params: ISponsorshipParams, seed: TSeedTypes): TSponsorshipTransactionWithId
export function sponsorship(paramsOrTx: ISponsorshipParams & WithSender | TSponsorshipTransaction, seed?: TSeedTypes): TSponsorshipTransactionWithId
export function sponsorship(paramsOrTx: any, seed?: TSeedTypes): TSponsorshipTransactionWithId {
  const type = TRANSACTION_TYPE.SPONSORSHIP
  const version = paramsOrTx.version || 2
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: TSponsorshipTransactionWithId = {
    type,
    version,
    senderPublicKey,
    minSponsoredAssetFee: paramsOrTx.minSponsoredAssetFee,
    assetId: paramsOrTx.assetId,
    fee: fee(paramsOrTx, 100000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  validate.sponsorship(tx)

  const bytes = version > 1 ? txToProtoBytes(tx) : binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}

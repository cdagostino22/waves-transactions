import { TRANSACTION_TYPE } from '@waves/ts-types'
import {
    isEq,
    orEq,
    isNumber,
    isNumberLike,
    isArray,
    getError,
    validateByShema,
    ifElse,
    isValidAliasName,
    defaultValue, isPublicKey
} from './validators'


const aliasScheme = {
    type: isEq(TRANSACTION_TYPE.ALIAS),
    version: orEq([undefined, 2, 3]),
    senderPublicKey: isPublicKey,
    alias: isValidAliasName,
    fee: isNumberLike,
    chainId: isNumber,
    timestamp: isNumber,
    proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
 };


export const aliasValidator = validateByShema(aliasScheme, getError)

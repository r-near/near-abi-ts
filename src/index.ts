/**
 * NEAR ABI TypeScript Inference System
 *
 * A pure TypeScript type inference system that generates fully typed NEAR smart contract
 * interfaces from ABI definitions at compile time - no codegen required.
 */

import type { Account } from "@near-js/accounts"
import { TypedContract } from "./runtime/index.js"
import type { ExtractFunctionNames } from "./types/index.js"

export function createContract<T extends { body: { functions: readonly any[] } }>(
  abi: T,
  account: Account,
  contractId: string,
) {
  return new TypedContract(abi, account, contractId) as TypedContract & ExtractFunctionNames<T>
}

export { TypedContract } from "./runtime/index.js"
export type {
  ExtractDefinitions,
  ExtractFunctionNames,
  ExtractParamNames,
  ExtractReturnType,
  JsonSchemaToType,
} from "./types/index.js"

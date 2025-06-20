/**
 * Legacy index.ts - now re-exports from src/
 * @deprecated Import from 'near-abi-ts' or 'near-abi-ts/src' instead
 */

export type {
  ExtractDefinitions,
  ExtractFunctionNames,
  ExtractParamNames,
  ExtractReturnType,
  JsonSchemaToType,
} from "./src/index.js"
export { createContract } from "./src/index.js"

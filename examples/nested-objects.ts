/**
 * Example demonstrating deeply nested object type inference
 */

import { Account } from "@near-js/accounts"
import { JsonRpcProvider } from "@near-js/providers"
import { KeyPairSigner } from "@near-js/signers"
import { createContract } from "../src/index.js"
import { nestedObjectsAbi } from "./abis/nested-objects-abi.js"

export async function testNestedObjects() {
  // Setup NEAR connection (you would provide real values)
  const provider = new JsonRpcProvider({ url: "https://test.rpc.fastnear.com" })
  const signer = KeyPairSigner.fromSecretKey("ed25519:your-private-key")
  const account = new Account("your-account.testnet", provider, signer)
  
  // Create typed contract
  const nestedContract = createContract(nestedObjectsAbi, account, "your-contract.testnet")

  const result = await nestedContract.processDeepNesting({
    args: {
      data: {
        level1: {
          level2: {
            level3: {
              deepValue: "nested string",
              deepArray: [{ nested: true }, { nested: false }],
            },
            level2Value: 42,
          },
        },
        topLevel: "top level string",
      },
    },
  })

  console.log(result.processed.summary.count)
  console.log(result.processed.summary.status)
}
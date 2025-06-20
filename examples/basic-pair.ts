/**
 * Example demonstrating basic ABI with $ref resolution
 */

import { Account } from "@near-js/accounts"
import { JsonRpcProvider } from "@near-js/providers"
import { KeyPairSigner } from "@near-js/signers"
import { createContract } from "../src/index.js"
import { basicPairAbi } from "./abis/basic-pair-abi.js"

export async function testContract() {
  // Setup NEAR connection (you would provide real values)
  const provider = new JsonRpcProvider({ url: "https://test.rpc.fastnear.com" })
  const signer = KeyPairSigner.fromSecretKey("ed25519:your-private-key")
  const account = new Account("your-account.testnet", provider, signer)
  
  // Create typed contract
  const contract = createContract(basicPairAbi, account, "your-contract.testnet")

  // Call contract methods with full type safety
  const result = await contract.add({ args: { a: [1, 2], b: [3, 4] } })
  console.log("Result:", result)
  
  // Call with additional parameters
  const resultWithDeposit = await contract.add_call({
    args: { a: [1, 2], b: [3, 4] },
    deposit: "1000000000000000000000000", // 1 NEAR
    gas: "300000000000000", // 300 TGas
  })
  console.log("Result with deposit:", resultWithDeposit)
}

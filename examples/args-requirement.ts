/**
 * Example demonstrating required vs optional args behavior
 */

import type { Account } from "@near-js/accounts"
import { createContract } from "../src/index.js"
import { argsRequirementAbi } from "./abis/args-requirement-abi.js"

// Mock account for demonstration
declare const account: Account

// Create typed contract
const contract = createContract(argsRequirementAbi, account, "contract.near")

// ✅ Functions with NO parameters - args are optional
async function demonstrateNoParamsFunction() {
  // All of these work:
  await contract.getBalance()
  await contract.getBalance({})
  await contract.getBalance({ gas: "300000000000000" })
}

// ✅ Functions WITH parameters - args are required
async function demonstrateWithParamsFunction() {
  // ✅ This works - args provided
  await contract.transfer({
    args: {
      receiver_id: "alice.near",
      amount: "1000000000000000000000000", // 1 NEAR
    },
  })

  // ✅ This works - args + other options
  await contract.transfer({
    args: {
      receiver_id: "alice.near",
      amount: "1000000000000000000000000",
    },
    deposit: "1", // 1 yoctoNEAR
    gas: "300000000000000", // 300 TGas
  })

  // ❌ This would be a TypeScript error:
  // await contract.transfer() // Error: args required
  // await contract.transfer({}) // Error: args required
  // await contract.transfer({ gas: "300000000000000" }) // Error: args required
}

// ✅ Functions with optional properties work correctly
async function demonstrateOptionalProperties() {
  // ✅ Only required field
  await contract.updateProfile({
    args: {
      profile: {
        name: "Alice",
        // bio and avatar_url are optional
      },
    },
  })

  // ✅ All fields
  await contract.updateProfile({
    args: {
      profile: {
        name: "Alice",
        bio: "Software engineer",
        avatar_url: "https://example.com/avatar.png",
      },
    },
  })

  // ❌ This would be a TypeScript error:
  // await contract.updateProfile({
  //   args: {
  //     profile: {
  //       bio: "Missing required name field"
  //     }
  //   }
  // })
}

export { demonstrateNoParamsFunction, demonstrateWithParamsFunction, demonstrateOptionalProperties }

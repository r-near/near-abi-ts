/**
 * Example demonstrating basic ABI with $ref resolution
 */

import { createContract } from "../src/index.js"
import { basicPairAbi } from "./abis/basic-pair-abi.js"

const contract = createContract(basicPairAbi)

export async function testContract() {
  const result = await contract.add({ a: [1, 2], b: [3, 4] })
  console.log("Result:", result)
}

testContract()

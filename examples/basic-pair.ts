/**
 * Example demonstrating basic ABI with $ref resolution
 */

import { createContract } from "../src/index.js"
import basicPairAbi from "./abis/basic-pair.json" with { type: "json" }

const contract = createContract(basicPairAbi as any as const)

export async function testContract() {
  const result = await contract.add({ a: [1, 2], b: [3, 4] })
  console.log("Result:", result)
}

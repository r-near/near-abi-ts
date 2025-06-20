/**
 * Runtime behavior tests
 */

import { describe, expect, it } from "vitest"
import { createContract } from "../src/index.js"

describe("Contract Runtime", () => {
  const testAbi = {
    schema_version: "0.3.0",
    metadata: {},
    body: {
      functions: [
        {
          name: "add",
          kind: "view",
          params: {
            serialization_type: "json",
            args: [
              {
                name: "a",
                type_schema: {
                  $ref: "#/definitions/Pair",
                },
              },
              {
                name: "b",
                type_schema: {
                  $ref: "#/definitions/Pair",
                },
              },
            ],
          },
          result: {
            serialization_type: "json",
            type_schema: {
              $ref: "#/definitions/Pair",
            },
          },
        },
      ],
      root_schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        definitions: {
          Pair: {
            type: "array",
            items: [
              { type: "integer", format: "uint32", minimum: 0.0 },
              { type: "integer", format: "uint32", minimum: 0.0 },
            ],
            maxItems: 2,
            minItems: 2,
          },
        },
      },
    },
  } as const

  it("should create contract with methods", () => {
    const contract = createContract(testAbi)
    expect(contract).toBeDefined()
    expect(typeof contract.add).toBe("function")
  })

  it("should call methods and return mock results", async () => {
    const contract = createContract(testAbi)
    const result = await contract.add({ a: [1, 2], b: [3, 4] })
    expect(result).toEqual([5, 6])
  })
})

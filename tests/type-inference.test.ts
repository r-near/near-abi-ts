/**
 * Type inference tests using Vitest
 */

import { describe, expectTypeOf, it } from "vitest"
import type { ExtractFunctionNames, JsonSchemaToType } from "../src/index.js"

describe("Type Inference", () => {
  describe("JsonSchemaToType", () => {
    it("should convert basic types correctly", () => {
      expectTypeOf<JsonSchemaToType<{ type: "string" }>>().toBeString()
      expectTypeOf<JsonSchemaToType<{ type: "integer" }>>().toBeNumber()
      expectTypeOf<JsonSchemaToType<{ type: "boolean" }>>().toBeBoolean()
      expectTypeOf<JsonSchemaToType<{ type: "null" }>>().toBeNull()
    })

    it("should handle arrays correctly", () => {
      expectTypeOf<JsonSchemaToType<{ type: "array"; items: { type: "string" } }>>().toBeArray()
      expectTypeOf<
        JsonSchemaToType<{ type: "array"; items: { type: "string" } }>
      >().items.toBeString()

      expectTypeOf<
        JsonSchemaToType<{ type: "array"; items: [{ type: "integer" }, { type: "string" }] }>
      >().toEqualTypeOf<[number, string]>()
    })

    it("should handle objects correctly", () => {
      type TestObject = JsonSchemaToType<{
        type: "object"
        properties: {
          name: { type: "string" }
          age: { type: "integer" }
        }
      }>

      expectTypeOf<TestObject>().toBeObject()
      expectTypeOf<TestObject>().toHaveProperty("name")
      expectTypeOf<TestObject>().toHaveProperty("age")
      expectTypeOf<TestObject>().toHaveProperty("name").toBeString()
      expectTypeOf<TestObject>().toHaveProperty("age").toBeNumber()
    })

    it("should handle enums correctly as string literals", () => {
      expectTypeOf<JsonSchemaToType<{ enum: ["success", "failure"] }>>().toEqualTypeOf<
        "success" | "failure"
      >()
    })

    it("should handle deeply nested objects", () => {
      type NestedType = JsonSchemaToType<{
        type: "object"
        properties: {
          level1: {
            type: "object"
            properties: {
              level2: {
                type: "object"
                properties: {
                  deepValue: { type: "string" }
                }
              }
            }
          }
        }
      }>

      expectTypeOf<NestedType>().toBeObject()
      expectTypeOf<NestedType>().toHaveProperty("level1")
      expectTypeOf<NestedType>().toHaveProperty("level1").toHaveProperty("level2")
      expectTypeOf<NestedType>()
        .toHaveProperty("level1")
        .toHaveProperty("level2")
        .toHaveProperty("deepValue")
        .toBeString()
    })

    it("should handle $ref resolution", () => {
      type TestDefinitions = {
        Pair: {
          type: "array"
          items: [{ type: "integer" }, { type: "integer" }]
        }
      }

      expectTypeOf<
        JsonSchemaToType<{ $ref: "#/definitions/Pair" }, TestDefinitions>
      >().toEqualTypeOf<[number, number]>()
    })
  })

  describe("ExtractFunctionNames", () => {
    const testAbi = {
      body: {
        functions: [
          {
            name: "testFunction",
            params: {
              serialization_type: "json",
              args: [
                {
                  name: "param1",
                  type_schema: { type: "string" },
                },
                {
                  name: "param2",
                  type_schema: { type: "integer" },
                },
              ],
            },
            result: {
              serialization_type: "json",
              type_schema: { type: "boolean" },
            },
          },
        ],
        root_schema: {
          definitions: {},
        },
      },
    } as const

    it("should extract function signatures correctly", () => {
      type ExtractedFunctions = ExtractFunctionNames<typeof testAbi>

      expectTypeOf<ExtractedFunctions>().toBeObject()
      expectTypeOf<ExtractedFunctions>().toHaveProperty("testFunction")
      expectTypeOf<ExtractedFunctions>().toHaveProperty("testFunction").toBeFunction()

      expectTypeOf<ExtractedFunctions>()
        .toHaveProperty("testFunction")
        .toBeCallableWith({ param1: "test", param2: 42 })

      expectTypeOf<ExtractedFunctions>()
        .toHaveProperty("testFunction")
        .returns.resolves.toBeBoolean()
    })

    it("should handle functions without parameters", () => {
      const emptyParamsAbi = {
        body: {
          functions: [
            {
              name: "noParams",
              result: {
                serialization_type: "json",
                type_schema: { type: "string" },
              },
            },
          ],
          root_schema: { definitions: {} },
        },
      } as const

      type EmptyFunctions = ExtractFunctionNames<typeof emptyParamsAbi>

      expectTypeOf<EmptyFunctions>().toHaveProperty("noParams").toBeCallableWith({})

      expectTypeOf<EmptyFunctions>().toHaveProperty("noParams").returns.resolves.toBeString()
    })

    it("should handle functions without return type", () => {
      const noReturnAbi = {
        body: {
          functions: [
            {
              name: "voidFunction",
              params: {
                serialization_type: "json",
                args: [
                  {
                    name: "input",
                    type_schema: { type: "string" },
                  },
                ],
              },
            },
          ],
          root_schema: { definitions: {} },
        },
      } as const

      type VoidFunctions = ExtractFunctionNames<typeof noReturnAbi>

      expectTypeOf<VoidFunctions>().toHaveProperty("voidFunction").returns.resolves.toBeVoid()
    })
  })
})

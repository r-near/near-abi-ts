/**
 * Utility types and helper functions tests
 */

import { describe, expectTypeOf, it } from "vitest"
import type {
  Constrain,
  Debug,
  ExtractSchemaType,
  FormatToType,
  GetFunctionByName,
  GetFunctionNames,
  GetOptionalProperties,
  GetRequiredProperties,
  IsNearAbi,
  IsValidSchema,
  NonNullable,
  Nullable,
  Optional,
  Pretty,
  Required,
  ValidateNearAbi,
  ValidateSchema,
} from "../src/utils/index.js"

describe("Utility Types", () => {
  describe("Schema Validation", () => {
    it("should validate correct schemas", () => {
      expectTypeOf<IsValidSchema<{ type: "string" }>>().toEqualTypeOf<true>()
      expectTypeOf<IsValidSchema<{ $ref: "#/definitions/Test" }>>().toEqualTypeOf<true>()
      expectTypeOf<IsValidSchema<{ enum: ["a", "b"] }>>().toEqualTypeOf<true>()
      expectTypeOf<IsValidSchema<{ const: "literal" }>>().toEqualTypeOf<true>()
      expectTypeOf<
        IsValidSchema<{ oneOf: [{ type: "string" }, { type: "number" }] }>
      >().toEqualTypeOf<true>()
    })

    it("should validate schema and return validated type", () => {
      type ValidSchema = ValidateSchema<{ type: "string" }>
      expectTypeOf<ValidSchema>().toEqualTypeOf<{ type: "string" }>()
    })
  })

  describe("Schema Type Extraction", () => {
    it("should extract schema types correctly", () => {
      expectTypeOf<ExtractSchemaType<{ type: "string" }>>().toEqualTypeOf<"string">()
      expectTypeOf<
        ExtractSchemaType<{ $ref: "#/definitions/Test" }>
      >().toEqualTypeOf<"#/definitions/Test">()
      expectTypeOf<ExtractSchemaType<{ enum: ["a", "b"] }>>().toEqualTypeOf<"enum">()
      expectTypeOf<ExtractSchemaType<{ const: "literal" }>>().toEqualTypeOf<"const">()
    })
  })

  describe("Property Utilities", () => {
    it("should extract required properties", () => {
      type RequiredProps = GetRequiredProperties<{
        type: "object"
        properties: {
          name: { type: "string" }
          age: { type: "number" }
          email: { type: "string" }
        }
        required: ["name", "age"]
      }>

      expectTypeOf<RequiredProps>().toEqualTypeOf<"name" | "age">()
    })

    it("should extract optional properties", () => {
      type OptionalProps = GetOptionalProperties<{
        type: "object"
        properties: {
          name: { type: "string" }
          age: { type: "number" }
          email: { type: "string" }
        }
        required: ["name", "age"]
      }>

      expectTypeOf<OptionalProps>().toEqualTypeOf<"email">()
    })
  })

  describe("NEAR ABI Validation", () => {
    const validAbi = {
      schema_version: "0.3.0",
      metadata: {},
      body: {
        functions: [
          {
            name: "test",
            kind: "view",
            params: {
              serialization_type: "json",
              args: [],
            },
          },
        ],
        root_schema: {
          definitions: {},
        },
      },
    } as const

    it("should validate NEAR ABI structure", () => {
      expectTypeOf<IsNearAbi<typeof validAbi>>().toEqualTypeOf<true>()
    })

    it("should validate and return NEAR ABI", () => {
      type ValidAbi = ValidateNearAbi<typeof validAbi>
      expectTypeOf<ValidAbi>().toEqualTypeOf<typeof validAbi>()
    })
  })

  describe("Function Utilities", () => {
    const testAbi = {
      body: {
        functions: [
          { name: "function1", kind: "view" },
          { name: "function2", kind: "call" },
          { name: "function3", kind: "view" },
        ],
      },
    } as const

    it("should extract function names", () => {
      type FunctionNames = GetFunctionNames<typeof testAbi>
      expectTypeOf<FunctionNames>().toEqualTypeOf<"function1" | "function2" | "function3">()
    })

    it("should get function by name", () => {
      type Function1 = GetFunctionByName<typeof testAbi, "function1">
      expectTypeOf<Function1>().toEqualTypeOf<{ name: "function1"; kind: "view" }>()
    })
  })

  describe("Format Utilities", () => {
    it("should map formats to types", () => {
      expectTypeOf<FormatToType<"date">>().toEqualTypeOf<string>()
      expectTypeOf<FormatToType<"email">>().toEqualTypeOf<string>()
      expectTypeOf<FormatToType<"uri">>().toEqualTypeOf<string>()
      expectTypeOf<FormatToType<"uuid">>().toEqualTypeOf<string>()
    })
  })

  describe("General Utilities", () => {
    it("should handle optional types", () => {
      type OptionalType = Optional<{ name: string; age: number }>
      expectTypeOf<OptionalType>().toEqualTypeOf<{ name?: string; age?: number }>()
    })

    it("should handle required types", () => {
      type RequiredType = Required<{ name?: string; age?: number }>
      expectTypeOf<RequiredType>().toEqualTypeOf<{ name: string; age: number }>()
    })

    it("should handle nullable types", () => {
      expectTypeOf<Nullable<string>>().toEqualTypeOf<string | null>()
      expectTypeOf<NonNullable<string | null>>().toEqualTypeOf<string>()
    })

    it("should handle type constraints", () => {
      type StringOrNumber = Constrain<string | number | boolean, string | number>
      expectTypeOf<StringOrNumber>().toEqualTypeOf<string | number>()
    })

    it("should handle debug types", () => {
      type DebugType = Debug<{ name: string; age: number }>
      expectTypeOf<DebugType>().toEqualTypeOf<{ name: string; age: number }>()

      type PrettyType = Pretty<{ name: string; age: number }>
      expectTypeOf<PrettyType>().toEqualTypeOf<{ name: string; age: number }>()
    })
  })
})

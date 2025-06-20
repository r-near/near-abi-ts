// ===== Step 1: Basic Contract with Method Name Inference =====

// Simple runtime contract
class SimpleContract {
  constructor(private abi: any) {
    // Create methods dynamically from ABI functions
    this.abi.body.functions.forEach((func: any) => {
      ;(this as any)[func.name] = async (params: any) => {
        console.log(`Calling ${func.name}:`, params)
        console.log(`Function kind: ${func.kind}`)
        // Your actual contract call logic would go here
        return this.mockCall(func)
      }
    })
  }

  private mockCall(func: any) {
    // Mock responses for testing
    if (func.name === "add" || func.name === "add_call") return [5, 6]
    if (func.name === "multiply") return 42
    return undefined
  }
}

// ===== Type magic to extract function names, parameters, and return types =====

// Extract definitions from root schema
type ExtractDefinitions<T> = T extends {
  body: {
    root_schema: {
      definitions: infer D
    }
  }
}
  ? D
  : {}

// Convert basic JSON schema types to TypeScript types
type JsonSchemaToType<Schema, Definitions = {}> = Schema extends { $ref: infer Ref } // Handle $ref references
  ? Ref extends `#/definitions/${infer DefName}`
    ? DefName extends keyof Definitions
      ? JsonSchemaToType<Definitions[DefName], Definitions>
      : any
    : any
  : // Handle enums FIRST (before basic string type)
    Schema extends { enum: infer E }
    ? E extends readonly (infer U)[]
      ? U
      : any
    : // Handle objects with properties
      Schema extends { type: "object"; properties: infer Props }
      ? {
          -readonly [K in keyof Props]: Props[K] extends object
            ? JsonSchemaToType<Props[K], Definitions>
            : any
        }
      : // Handle arrays with multiple tuple elements [A, B, C, ...]
        Schema extends { type: "array"; items: readonly [infer A, infer B, infer C] }
        ? [
            JsonSchemaToType<A, Definitions>,
            JsonSchemaToType<B, Definitions>,
            JsonSchemaToType<C, Definitions>,
          ]
        : // Handle arrays with tuple items (like Pair) [A, B]
          Schema extends { type: "array"; items: readonly [infer A, infer B] }
          ? [JsonSchemaToType<A, Definitions>, JsonSchemaToType<B, Definitions>]
          : // Handle arrays with single tuple element [A]
            Schema extends { type: "array"; items: readonly [infer A] }
            ? [JsonSchemaToType<A, Definitions>]
            : // Handle arrays with single item type (like string[], number[])
              Schema extends { type: "array"; items: infer Item }
              ? JsonSchemaToType<Item, Definitions>[]
              : // Handle arrays without items specified
                Schema extends { type: "array" }
                ? any[]
                : // Handle basic types
                  Schema extends { type: "string" }
                  ? string
                  : Schema extends { type: "integer" }
                    ? number
                    : Schema extends { type: "number" }
                      ? number
                      : Schema extends { type: "boolean" }
                        ? boolean
                        : // Handle null type
                          Schema extends { type: "null" }
                          ? null
                          : // Handle unions with oneOf
                            Schema extends { oneOf: infer Union }
                            ? Union extends readonly any[]
                              ? JsonSchemaToType<Union[number], Definitions>
                              : any
                            : // Handle unions with anyOf (similar to oneOf for simplicity)
                              Schema extends { anyOf: infer Union }
                              ? Union extends readonly any[]
                                ? JsonSchemaToType<Union[number], Definitions>
                                : any
                              : any // Fallback for complex types

// Extract parameter names and types from a function's params
type ExtractParamNames<F, Definitions = {}> = F extends {
  params: {
    serialization_type: "json"
    args: readonly (infer A)[]
  }
}
  ? {
      [K in A as K extends { name: infer N extends string } ? N : never]: K extends {
        type_schema: infer Schema
      }
        ? JsonSchemaToType<Schema, Definitions>
        : any
    }
  : {}

// Extract return type from a function's result
type ExtractReturnType<F, Definitions = {}> = F extends {
  result: {
    serialization_type: "json"
    type_schema: infer Schema
  }
}
  ? JsonSchemaToType<Schema, Definitions> // Now uses proper type conversion!
  : void // If no result, return void

// Extract function names with their parameter shapes and return types
type ExtractFunctionNames<T> = T extends {
  body: {
    functions: readonly (infer F)[]
  }
}
  ? ExtractDefinitions<T> extends infer Definitions
    ? {
        [K in F as K extends { name: infer N extends string } ? N : never]: (
          params: ExtractParamNames<K, Definitions>,
        ) => Promise<ExtractReturnType<K, Definitions>>
      }
    : never
  : {}

// Factory function with type inference
export function createContract<T extends { body: { functions: readonly any[] } }>(abi: T) {
  return new SimpleContract(abi) as SimpleContract & ExtractFunctionNames<T>
}

// ===== Test with deeply nested objects =====

const nestedObjectsAbi = {
  schema_version: "0.3.0",
  metadata: {},
  body: {
    functions: [
      {
        name: "processDeepNesting",
        kind: "call",
        params: {
          serialization_type: "json",
          args: [
            {
              name: "data",
              type_schema: {
                type: "object",
                properties: {
                  level1: {
                    type: "object",
                    properties: {
                      level2: {
                        type: "object",
                        properties: {
                          level3: {
                            type: "object",
                            properties: {
                              deepValue: {
                                type: "string",
                              },
                              deepArray: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    nested: {
                                      type: "boolean",
                                    },
                                  },
                                },
                              },
                            },
                          },
                          level2Value: {
                            type: "integer",
                          },
                        },
                      },
                    },
                  },
                  topLevel: {
                    type: "string",
                  },
                },
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            type: "object",
            properties: {
              processed: {
                type: "object",
                properties: {
                  summary: {
                    type: "object",
                    properties: {
                      count: {
                        type: "integer",
                      },
                      status: {
                        enum: ["success", "failure"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
    root_schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      definitions: {},
    },
  },
} as const

const originalAbi = {
  schema_version: "0.3.0",
  metadata: {},
  body: {
    functions: [
      {
        name: "add",
        doc: " Adds two pairs point-wise.",
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
      {
        name: "add_call",
        doc: " Adds two pairs point-wise.",
        kind: "call",
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
      {
        name: "empty_call",
        kind: "call",
      },
    ],
    root_schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "String",
      type: "string",
      definitions: {
        Pair: {
          type: "array",
          items: [
            {
              type: "integer",
              format: "uint32",
              minimum: 0.0,
            },
            {
              type: "integer",
              format: "uint32",
              minimum: 0.0,
            },
          ],
          maxItems: 2,
          minItems: 2,
        },
      },
    },
  },
} as const // <-- Important: `as const` for type inference

// ===== Test deeply nested objects =====

const nestedContract = createContract(nestedObjectsAbi)

async function testNestedObjects() {
  // ✅ Deep nesting should work with full type safety
  const result = await nestedContract.processDeepNesting({
    data: {
      level1: {
        level2: {
          level3: {
            deepValue: "nested string", // <- string type
            deepArray: [
              { nested: true }, // <- object in array
              { nested: false },
            ],
          },
          level2Value: 42, // <- number type
        },
      },
      topLevel: "top level string", // <- string type
    },
  })

  // result should have deeply nested return type
  console.log(result.processed.summary.count) // <- number
  console.log(result.processed.summary.status) // <- "success" | "failure"

  // ❌ These should give TypeScript errors:
  // data: {
  //   level1: {
  //     level2: {
  //       level3: {
  //         deepValue: 123,        // Error: number not assignable to string
  //         deepArray: [
  //           { nested: "not bool" } // Error: string not assignable to boolean
  //         ]
  //       }
  //     }
  //   }
  // }
}

// ===== Debug: Test nested object type resolution =====

// Test deeply nested object types
type DebugNestedContract = ExtractFunctionNames<typeof nestedObjectsAbi>
// Should show deep nesting like:
// {
//   processDeepNesting: (params: {
//     data: {
//       level1: {
//         level2: {
//           level3: {
//             deepValue: string;
//             deepArray: { nested: boolean }[];
//           };
//           level2Value: number;
//         };
//       };
//       topLevel: string;
//     }
//   }) => Promise<{
//     processed: {
//       summary: {
//         count: number;
//         status: "success" | "failure";
//       };
//     };
//   }>;
// }

// Test the nested object conversion step by step
type DebugLevel3 = JsonSchemaToType<{
  type: "object"
  properties: {
    deepValue: { type: "string" }
    deepArray: {
      type: "array"
      items: {
        type: "object"
        properties: {
          nested: { type: "boolean" }
        }
      }
    }
  }
}>
// Should be: { deepValue: string; deepArray: { nested: boolean }[] }

type DebugLevel2 = JsonSchemaToType<{
  type: "object"
  properties: {
    level3: {
      type: "object"
      properties: {
        deepValue: { type: "string" }
      }
    }
    level2Value: { type: "integer" }
  }
}>
// Should be: { level3: { deepValue: string }; level2Value: number }

type DebugReturnNested = JsonSchemaToType<{
  type: "object"
  properties: {
    processed: {
      type: "object"
      properties: {
        summary: {
          type: "object"
          properties: {
            count: { type: "integer" }
            status: { enum: ["success", "failure"] }
          }
        }
      }
    }
  }
}>
// Should be: { processed: { summary: { count: number; status: "success" | "failure" } } }

console.log("Contract created successfully!")
console.log(
  "Available methods:",
  originalAbi.body.functions.map((f) => f.name),
)

export { contract, testContract }

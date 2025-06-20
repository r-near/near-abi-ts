/**
 * NEAR ABI specific type extraction utilities
 */

import type { ExtractDefinitions, JsonSchemaToType } from "./schema.js"

export type ExtractParamNames<F, Definitions = {}> = F extends {
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

export type ExtractReturnType<F, Definitions = {}> = F extends {
  result: {
    serialization_type: "json"
    type_schema: infer Schema
  }
}
  ? JsonSchemaToType<Schema, Definitions>
  : void

export type ExtractFunctionNames<T> = T extends {
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

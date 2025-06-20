/**
 * Core JSON Schema to TypeScript type conversion utilities
 */

export type ExtractDefinitions<T> = T extends {
  body: {
    root_schema: {
      definitions: infer D
    }
  }
}
  ? D
  : {}

export type JsonSchemaToType<Schema, Definitions = {}> = Schema extends { $ref: infer Ref }
  ? Ref extends `#/definitions/${infer DefName}`
    ? DefName extends keyof Definitions
      ? JsonSchemaToType<Definitions[DefName], Definitions>
      : any
    : any
  : Schema extends { const: infer C }
    ? C
    : Schema extends { enum: infer E }
      ? E extends readonly (infer U)[]
        ? U
        : any
      : Schema extends { allOf: infer AllOf }
        ? AllOf extends readonly any[]
          ? IntersectionOf<{
              [K in keyof AllOf]: JsonSchemaToType<AllOf[K], Definitions>
            }>
          : any
        : Schema extends { type: readonly (infer Types)[] }
          ? Types extends "string"
            ? string
            : Types extends "number"
              ? number
              : Types extends "integer"
                ? number
                : Types extends "boolean"
                  ? boolean
                  : Types extends "null"
                    ? null
                    : Types extends "object"
                      ? object
                      : Types extends "array"
                        ? any[]
                        : JsonSchemaToType<{ type: Types }, Definitions>
          : Schema extends { type: "object"; properties: infer Props; required: infer Required }
            ? Required extends readonly string[]
              ? {
                  -readonly [K in keyof Props as K extends Required[number]
                    ? K
                    : never]: Props[K] extends object
                    ? JsonSchemaToType<Props[K], Definitions>
                    : any
                } & {
                  -readonly [K in keyof Props as K extends Required[number]
                    ? never
                    : K]?: Props[K] extends object ? JsonSchemaToType<Props[K], Definitions> : any
                }
              : {
                  -readonly [K in keyof Props]: Props[K] extends object
                    ? JsonSchemaToType<Props[K], Definitions>
                    : any
                }
            : Schema extends {
                  type: "object"
                  properties: infer Props
                  additionalProperties: infer Additional
                }
              ? Additional extends false
                ? {
                    -readonly [K in keyof Props]: Props[K] extends object
                      ? JsonSchemaToType<Props[K], Definitions>
                      : any
                  }
                : {
                    -readonly [K in keyof Props]: Props[K] extends object
                      ? JsonSchemaToType<Props[K], Definitions>
                      : any
                  } & {
                    [key: string]: Additional extends object
                      ? JsonSchemaToType<Additional, Definitions>
                      : any
                  }
              : Schema extends { type: "object"; properties: infer Props }
                ? {
                    -readonly [K in keyof Props]: Props[K] extends object
                      ? JsonSchemaToType<Props[K], Definitions>
                      : any
                  }
                : Schema extends { type: "array"; items: readonly [infer A, infer B, infer C] }
                  ? [
                      JsonSchemaToType<A, Definitions>,
                      JsonSchemaToType<B, Definitions>,
                      JsonSchemaToType<C, Definitions>,
                    ]
                  : Schema extends { type: "array"; items: readonly [infer A, infer B] }
                    ? [JsonSchemaToType<A, Definitions>, JsonSchemaToType<B, Definitions>]
                    : Schema extends { type: "array"; items: readonly [infer A] }
                      ? [JsonSchemaToType<A, Definitions>]
                      : Schema extends { type: "array"; items: infer Item }
                        ? JsonSchemaToType<Item, Definitions>[]
                        : Schema extends { type: "array" }
                          ? any[]
                          : Schema extends { type: "string" }
                            ? string
                            : Schema extends { type: "integer" }
                              ? number
                              : Schema extends { type: "number" }
                                ? number
                                : Schema extends { type: "boolean" }
                                  ? boolean
                                  : Schema extends { type: "null" }
                                    ? null
                                    : Schema extends { oneOf: infer Union }
                                      ? Union extends readonly any[]
                                        ? JsonSchemaToType<Union[number], Definitions>
                                        : any
                                      : Schema extends { anyOf: infer Union }
                                        ? Union extends readonly any[]
                                          ? JsonSchemaToType<Union[number], Definitions>
                                          : any
                                        : any

type IntersectionOf<T> = T extends readonly [infer First, ...infer Rest]
  ? First & IntersectionOf<Rest>
  : T extends readonly [infer Only]
    ? Only
    : T extends readonly []
      ? {}
      : T extends Record<string | number, any>
        ? {
            [K in keyof T]: T[K]
          } extends Record<string | number, infer U>
          ? U
          : never
        : never

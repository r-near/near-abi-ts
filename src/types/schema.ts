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
  : Schema extends { enum: infer E }
    ? E extends readonly (infer U)[]
      ? U
      : any
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

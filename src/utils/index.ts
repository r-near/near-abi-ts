/**
 * Utility types and helper functions for NEAR ABI TypeScript inference
 */

// Schema validation utilities
export type IsValidSchema<T> = T extends
  | { type: string }
  | { $ref: string }
  | { enum: readonly any[] }
  | { const: any }
  | { oneOf: readonly any[] }
  | { anyOf: readonly any[] }
  | { allOf: readonly any[] }
  ? true
  : false

export type ValidateSchema<T> = IsValidSchema<T> extends true ? T : never

// Type extraction utilities
export type ExtractSchemaType<T> = T extends { type: infer U }
  ? U
  : T extends { $ref: infer R }
    ? R
    : T extends { enum: readonly any[] }
      ? "enum"
      : T extends { const: any }
        ? "const"
        : "unknown"

// Property utilities
export type GetRequiredProperties<T> = T extends { required: infer R }
  ? R extends readonly string[]
    ? R[number]
    : never
  : never

export type GetOptionalProperties<
  T,
  AllProps = keyof T extends "properties" ? T["properties"] : {},
> = T extends { required: infer R }
  ? R extends readonly string[]
    ? Exclude<keyof AllProps, R[number]>
    : keyof AllProps
  : keyof AllProps

// Schema composition utilities
export type MergeSchemas<T, U> = T & U

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

// ABI utilities
export type IsNearAbi<T> = T extends {
  body: {
    functions: readonly any[]
    root_schema: any
  }
  metadata: any
  schema_version: string
}
  ? true
  : false

export type ValidateNearAbi<T> = IsNearAbi<T> extends true ? T : never

// Function utilities
export type GetFunctionNames<T> = T extends {
  body: {
    functions: readonly (infer F)[]
  }
}
  ? F extends { name: infer N }
    ? N
    : never
  : never

export type GetFunctionByName<T, Name extends string> = T extends {
  body: {
    functions: readonly (infer F)[]
  }
}
  ? F extends { name: Name }
    ? F
    : never
  : never

// JSON Schema format helpers
export type SupportedFormats =
  | "date"
  | "date-time"
  | "email"
  | "hostname"
  | "ipv4"
  | "ipv6"
  | "uri"
  | "uuid"

export type FormatToType<F extends SupportedFormats> = F extends "date" | "date-time"
  ? string
  : F extends "email" | "hostname" | "ipv4" | "ipv6" | "uri" | "uuid"
    ? string
    : string

// Debugging utilities
export type Debug<T> = {
  [K in keyof T]: T[K]
} & {}

export type Pretty<T> = {
  [K in keyof T]: T[K]
} & {}

// Type constraints utilities
export type Constrain<T, U> = T extends U ? T : never

export type Optional<T> = {
  [K in keyof T]?: T[K]
}

export type Required<T> = {
  [K in keyof T]-?: T[K]
}

export type Nullable<T> = T | null

export type NonNullable<T> = T extends null | undefined ? never : T

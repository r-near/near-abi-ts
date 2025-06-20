# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# NEAR ABI TypeScript Inference System

This repository contains a pure TypeScript type inference system that generates fully typed NEAR smart contract interfaces from ABI (Application Binary Interface) definitions at compile time - no codegen required.

## Development Commands

- **Install dependencies**: `bun install`
- **Run the main file**: `bun index.ts` or `bun start`
- **Build**: `bun run build` (TypeScript compilation to dist/)
- **Run tests**: `bun run test` (uses Vitest)
- **Format/Lint**: Uses Biome for formatting and linting
  - Automatic formatting on save with 100-char line width
  - Space indentation, double quotes, semicolons as needed
  - Strict rules for unused imports and variables

## Core Architecture

The system uses advanced TypeScript conditional types for compile-time NEAR ABI parsing:

### Type System (`src/types/`)
- **`JsonSchemaToType<Schema, Definitions>`**: Core recursive type converter that transforms JSON Schema to TypeScript types
  - Handles `$ref` resolution, enums, objects, arrays, tuples, unions (`oneOf`/`anyOf`)
  - ✅ **NEW**: Optional properties via `required` array support
  - ✅ **NEW**: `const` values for literal types
  - ✅ **NEW**: `allOf` for intersection types
  - ✅ **NEW**: Union types with `type: ["string", "null"]` syntax
  - ✅ **NEW**: `additionalProperties` for index signatures
  - Supports deep nesting and complex type structures
- **`ExtractFunctionNames<T>`**: Extracts NEAR contract method signatures with full parameter and return type inference
- **`ExtractDefinitions<T>`**: Extracts type definitions from ABI root schema
- **`ExtractParamNames<F, Definitions>`**: Maps function parameters to typed objects
- **`ExtractReturnType<F, Definitions>`**: Infers return types from function result schemas

### Utility Types (`src/utils/`)
- **Schema Validation**: `IsValidSchema`, `ValidateSchema`, `ExtractSchemaType`
- **Property Utilities**: `GetRequiredProperties`, `GetOptionalProperties`
- **ABI Utilities**: `IsNearAbi`, `ValidateNearAbi`, `GetFunctionNames`, `GetFunctionByName`
- **Type Composition**: `MergeSchemas`, `UnionToIntersection`
- **General Utilities**: `Optional`, `Required`, `Nullable`, `NonNullable`, `Constrain`
- **Debugging**: `Debug`, `Pretty` for type inspection

### Runtime Layer
- **`TypedContract`**: Runtime class that dynamically creates methods from NEAR ABI functions with full NEAR.js integration
- **`createContract(abi, account, contractId)`**: Factory function that combines runtime behavior with compile-time typing
- Returns typed NEAR contract instances with full autocomplete, type safety, and direct NEAR blockchain interaction

## Key Features

- ✅ Method name autocomplete from NEAR ABI functions
- ✅ Parameter name and type inference (primitives, arrays, objects, tuples)
- ✅ Return type inference with proper typing
- ✅ `$ref` resolution for custom types and definitions
- ✅ String enums, union types, and null handling
- ✅ **NEW**: Optional properties with `required` array support
- ✅ **NEW**: Literal types with `const` values
- ✅ **NEW**: Intersection types with `allOf`
- ✅ **NEW**: Union primitive types (`type: ["string", "null"]`)
- ✅ **NEW**: Index signatures with `additionalProperties`
- ✅ Deep object nesting with full type safety
- ✅ Full NEAR.js integration with Account objects
- ✅ Support for deposit, gas, and waitUntil transaction parameters
- ✅ Automatic view vs call function handling based on ABI kind
- ✅ **NEW**: Comprehensive utility types for schema validation and manipulation

## Usage Pattern

```typescript
import { Account } from "@near-js/accounts"
import { JsonRpcProvider } from "@near-js/providers"
import { KeyPairSigner } from "@near-js/signers"
import { createContract } from "near-abi-ts"

// Setup NEAR connection
const provider = new JsonRpcProvider({ url: "https://rpc.mainnet.near.org" })
const signer = KeyPairSigner.fromSecretKey("ed25519:your-private-key")
const account = new Account("your-account.near", provider, signer)

// For exported TypeScript ABI definitions (recommended)
import { myContractAbi } from "./my-contract-abi.js"
const contract = createContract(myContractAbi, account, "contract.near")

// Call contract methods with full type safety and additional options
await contract.methodName({ 
  args: { param: "value" },
  deposit: "1000000000000000000000000", // 1 NEAR (optional)
  gas: "300000000000000", // 300 TGas (optional)
  waitUntil: "INCLUDED_FINAL" // Transaction finality (optional)
})
```

## Development Environment

- **Runtime**: Bun (preferred over Node.js)
- **TypeScript**: Strict mode with modern ESNext target
- **Testing**: Vitest
- **Formatting**: Biome with consistent style rules
- **Schema**: Uses `near-abi-current-schema.json` for NEAR ABI validation and structure

## Important Notes

- **ABI Definition Requirements**: ABIs must be defined in TypeScript files with `as const` assertion for proper type inference
  - ✅ **Recommended**: `export const myAbi = {...} as const` in TypeScript files
  - ✅ **Works**: Inline ABI objects with `as const` assertion
  - ❌ **Not supported**: Importing JSON files (TypeScript cannot infer literal types from JSON imports)
- The system works entirely at compile-time - no build tools or code generation required
- Type inference relies on TypeScript's conditional types and mapped types

## Git Workflow

- **Always commit when tasks are complete**: After completing any development task, create a commit with semantic/conventional commit messages
- **Commit message format**: Use conventional commits (feat:, fix:, docs:, refactor:, test:, chore:, etc.)
- **Example**: `feat: add type inference for NEAR ABI functions` or `fix: resolve $ref resolution in nested schemas`
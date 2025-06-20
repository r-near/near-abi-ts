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

### Type System (`index.ts`)
- **`JsonSchemaToType<Schema, Definitions>`**: Core recursive type converter that transforms JSON Schema to TypeScript types
  - Handles `$ref` resolution, enums, objects, arrays, tuples, unions (`oneOf`/`anyOf`)
  - Supports deep nesting and complex type structures
- **`ExtractFunctionNames<T>`**: Extracts NEAR contract method signatures with full parameter and return type inference
- **`ExtractDefinitions<T>`**: Extracts type definitions from ABI root schema
- **`ExtractParamNames<F, Definitions>`**: Maps function parameters to typed objects
- **`ExtractReturnType<F, Definitions>`**: Infers return types from function result schemas

### Runtime Layer
- **`SimpleContract`**: Runtime class that dynamically creates methods from NEAR ABI functions
- **`createContract(abi)`**: Factory function that combines runtime behavior with compile-time typing
- Returns typed NEAR contract instances with full autocomplete and type safety

## Key Features

- ✅ Method name autocomplete from NEAR ABI functions
- ✅ Parameter name and type inference (primitives, arrays, objects, tuples)
- ✅ Return type inference with proper typing
- ✅ `$ref` resolution for custom types and definitions
- ✅ String enums, union types, and null handling
- ✅ Deep object nesting with full type safety

## Usage Pattern

```typescript
const contract = createContract(nearAbi as const); // `as const` is crucial for type inference
await contract.methodName({ param: "value" }); // Full autocomplete + type checking for NEAR contract calls
```

## Development Environment

- **Runtime**: Bun (preferred over Node.js)
- **TypeScript**: Strict mode with modern ESNext target
- **Testing**: Vitest
- **Formatting**: Biome with consistent style rules
- **Schema**: Uses `near-abi-current-schema.json` for NEAR ABI validation and structure

## Important Notes

- Always use `as const` assertion when passing NEAR ABIs to `createContract()` for proper type inference
- The system works entirely at compile-time - no build tools or code generation required
- Type inference relies on TypeScript's conditional types and mapped types

## Git Workflow

- **Always commit when tasks are complete**: After completing any development task, create a commit with semantic/conventional commit messages
- **Commit message format**: Use conventional commits (feat:, fix:, docs:, refactor:, test:, chore:, etc.)
- **Example**: `feat: add type inference for NEAR ABI functions` or `fix: resolve $ref resolution in nested schemas`
# NEAR ABI TypeScript

A pure TypeScript type inference system that generates fully typed NEAR smart contract interfaces from ABI (Application Binary Interface) definitions at compile time - **no code generation required**.

## Features

🚀 **Zero Runtime Overhead** - Pure compile-time type inference  
🔧 **No Build Tools** - Works directly with TypeScript compiler  
📝 **Full Type Safety** - Complete autocomplete and type checking  
🎯 **Smart Args Handling** - Args required only when functions have parameters  
🌐 **NEAR.js Integration** - Direct integration with `@near-js` packages  

### Supported JSON Schema Features

- ✅ **Basic Types** - `string`, `number`, `integer`, `boolean`, `null`
- ✅ **Objects & Arrays** - Complex nested structures
- ✅ **Optional Properties** - Via `required` array support
- ✅ **Literal Types** - `const` values for exact type inference
- ✅ **Union Types** - `oneOf`, `anyOf`, and `type: ["string", "null"]`
- ✅ **Intersection Types** - `allOf` for combining schemas
- ✅ **References** - `$ref` resolution with custom definitions
- ✅ **Index Signatures** - `additionalProperties` support
- ✅ **Enums** - String literal unions
- ✅ **Tuples** - Fixed-length arrays with typed elements

## Installation

```bash
npm install near-abi-ts @near-js/accounts @near-js/providers @near-js/signers
```

## Quick Start

### 1. Define Your Contract ABI

Create a TypeScript file with your NEAR contract ABI using `as const`:

```typescript
// my-contract-abi.ts
export const myContractAbi = {
  schema_version: "0.3.0",
  metadata: {},
  body: {
    functions: [
      {
        name: "get_balance",
        kind: "view",
        params: {
          serialization_type: "json",
          args: [
            {
              name: "account_id",
              type_schema: { type: "string" }
            }
          ]
        },
        result: {
          serialization_type: "json",
          type_schema: { type: "string" }
        }
      },
      {
        name: "transfer",
        kind: "call",
        params: {
          serialization_type: "json",
          args: [
            {
              name: "receiver_id", 
              type_schema: { type: "string" }
            },
            {
              name: "amount",
              type_schema: { type: "string" }
            }
          ]
        }
      }
    ],
    root_schema: {
      definitions: {}
    }
  }
} as const // ← Important: as const for type inference
```

### 2. Create Typed Contract Instance

```typescript
import { Account } from "@near-js/accounts"
import { JsonRpcProvider } from "@near-js/providers"
import { KeyPairSigner } from "@near-js/signers"
import { createContract } from "near-abi-ts"
import { myContractAbi } from "./my-contract-abi.js"

// Setup NEAR connection
const provider = new JsonRpcProvider({ url: "https://rpc.mainnet.near.org" })
const signer = KeyPairSigner.fromSecretKey("ed25519:your-private-key")
const account = new Account("your-account.near", provider, signer)

// Create typed contract - full autocomplete and type safety!
const contract = createContract(myContractAbi, account, "contract.near")
```

### 3. Call Contract Methods with Full Type Safety

```typescript
// ✅ Functions WITH parameters - args are required
await contract.transfer({
  args: {
    receiver_id: "alice.near",
    amount: "1000000000000000000000000" // 1 NEAR
  },
  deposit: "1", // Optional: yoctoNEAR
  gas: "300000000000000" // Optional: gas limit
})

// ✅ Functions WITHOUT parameters - args not required
const balance = await contract.get_balance({
  args: { account_id: "alice.near" }
})

// ❌ TypeScript errors for invalid calls:
// await contract.transfer() // Error: args required
// await contract.transfer({ args: { wrong_param: "value" } }) // Error: invalid parameter
```

## Advanced Examples

### Optional Properties

```typescript
const userAbi = {
  body: {
    functions: [{
      name: "update_profile",
      params: {
        serialization_type: "json",
        args: [{
          name: "profile",
          type_schema: {
            type: "object",
            properties: {
              name: { type: "string" },
              bio: { type: "string" },
              avatar_url: { type: "string" }
            },
            required: ["name"] // Only name is required
          }
        }]
      }
    }]
  }
} as const

// ✅ Valid - only required field
await contract.update_profile({
  args: {
    profile: {
      name: "Alice"
      // bio and avatar_url are optional
    }
  }
})
```

### Custom Types with References

```typescript
const nftAbi = {
  body: {
    functions: [{
      name: "nft_mint",
      params: {
        serialization_type: "json",
        args: [{
          name: "token_metadata",
          type_schema: { $ref: "#/definitions/TokenMetadata" }
        }]
      }
    }],
    root_schema: {
      definitions: {
        TokenMetadata: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            media: { type: "string" }
          },
          required: ["title"]
        }
      }
    }
  }
} as const

// Full type safety with custom definitions
await contract.nft_mint({
  args: {
    token_metadata: {
      title: "My NFT",
      description: "An awesome NFT", // optional
      media: "https://example.com/image.png" // optional
    }
  }
})
```

### Union and Intersection Types

```typescript
const advancedAbi = {
  body: {
    functions: [{
      name: "process_data",
      params: {
        serialization_type: "json",
        args: [{
          name: "data",
          type_schema: {
            allOf: [ // Intersection type
              { 
                type: "object",
                properties: { id: { type: "string" } }
              },
              {
                oneOf: [ // Union type
                  {
                    type: "object", 
                    properties: { type: { const: "user" }, name: { type: "string" } }
                  },
                  {
                    type: "object",
                    properties: { type: { const: "admin" }, permissions: { type: "array", items: { type: "string" } } }
                  }
                ]
              }
            ]
          }
        }]
      }
    }]
  }
} as const

// TypeScript infers: { id: string } & ({ type: "user", name: string } | { type: "admin", permissions: string[] })
await contract.process_data({
  args: {
    data: {
      id: "123",
      type: "user",
      name: "Alice"
    }
  }
})
```

## Function Call Options

All contract functions support these optional parameters:

```typescript
await contract.my_function({
  args: { /* function parameters */ },
  deposit: "1000000000000000000000000", // yoctoNEAR (1 NEAR)
  gas: "300000000000000", // Gas limit (300 TGas)
  waitUntil: "INCLUDED_FINAL" // Transaction finality level
})
```

## Type System Details

The type inference system uses advanced TypeScript conditional types to parse JSON Schema at compile time:

- **`JsonSchemaToType<Schema, Definitions>`** - Core schema-to-type converter
- **`ExtractFunctionNames<ABI>`** - Extracts typed function signatures
- **`ExtractParamNames<Function, Definitions>`** - Maps parameters to typed objects
- **`ExtractReturnType<Function, Definitions>`** - Infers return types

## Requirements

- **TypeScript 5.0+** - Required for advanced conditional types
- **`as const` assertions** - Required for literal type inference
- **ESM imports** - ABI definitions must be in TypeScript files, not JSON

## Examples

Check out the `/examples` directory for complete examples:

- [`basic-pair.ts`](./examples/basic-pair.ts) - Simple pair arithmetic contract
- [`nested-objects.ts`](./examples/nested-objects.ts) - Complex nested object handling
- [`args-requirement.ts`](./examples/args-requirement.ts) - Args requirement behavior

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Type checking
bun typecheck

# Build
bun run build
```

## License

MIT

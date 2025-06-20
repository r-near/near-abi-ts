/**
 * Example ABI demonstrating args requirement behavior
 */

export const argsRequirementAbi = {
  schema_version: "0.3.0",
  metadata: {},
  body: {
    functions: [
      // Function with NO parameters - args not required
      {
        name: "getBalance",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: { type: "string" },
        },
      },
      // Function with parameters - args ARE required
      {
        name: "transfer",
        kind: "call",
        params: {
          serialization_type: "json",
          args: [
            {
              name: "receiver_id",
              type_schema: { type: "string" },
            },
            {
              name: "amount",
              type_schema: { type: "string" },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: { type: "boolean" },
        },
      },
      // Function with optional properties (using required array)
      {
        name: "updateProfile",
        kind: "call",
        params: {
          serialization_type: "json",
          args: [
            {
              name: "profile",
              type_schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  bio: { type: "string" },
                  avatar_url: { type: "string" },
                },
                required: ["name"], // Only name is required
              },
            },
          ],
        },
      },
    ],
    root_schema: {
      definitions: {},
    },
  },
} as const

export const nestedObjectsAbi = {
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

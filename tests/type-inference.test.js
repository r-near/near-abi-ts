/**
 * Type inference tests using Vitest
 */
import { describe, it, expectTypeOf } from "vitest";
describe("Type Inference", () => {
    describe("JsonSchemaToType", () => {
        it("should convert basic types correctly", () => {
            expectTypeOf().toBeString();
            expectTypeOf().toBeNumber();
            expectTypeOf().toBeBoolean();
            expectTypeOf().toBeNull();
        });
        it("should handle arrays correctly", () => {
            expectTypeOf().toBeArray();
            expectTypeOf()
                .items.toBeString();
            expectTypeOf().toEqualTypeOf();
        });
        it("should handle objects correctly", () => {
            expectTypeOf().toBeObject();
            expectTypeOf().toHaveProperty("name");
            expectTypeOf().toHaveProperty("age");
            expectTypeOf().toHaveProperty("name").toBeString();
            expectTypeOf().toHaveProperty("age").toBeNumber();
        });
        it("should handle enums correctly as string literals", () => {
            expectTypeOf()
                .toEqualTypeOf();
        });
        it("should handle deeply nested objects", () => {
            expectTypeOf().toBeObject();
            expectTypeOf().toHaveProperty("level1");
            expectTypeOf().toHaveProperty("level1").toHaveProperty("level2");
            expectTypeOf()
                .toHaveProperty("level1")
                .toHaveProperty("level2")
                .toHaveProperty("deepValue")
                .toBeString();
        });
        it("should handle $ref resolution", () => {
            expectTypeOf()
                .toEqualTypeOf();
        });
    });
    describe("ExtractFunctionNames", () => {
        const testAbi = {
            body: {
                functions: [
                    {
                        name: "testFunction",
                        params: {
                            serialization_type: "json",
                            args: [
                                {
                                    name: "param1",
                                    type_schema: { type: "string" },
                                },
                                {
                                    name: "param2",
                                    type_schema: { type: "integer" },
                                },
                            ],
                        },
                        result: {
                            serialization_type: "json",
                            type_schema: { type: "boolean" },
                        },
                    },
                ],
                root_schema: {
                    definitions: {},
                },
            },
        };
        it("should extract function signatures correctly", () => {
            expectTypeOf().toBeObject();
            expectTypeOf().toHaveProperty("testFunction");
            expectTypeOf().toHaveProperty("testFunction").toBeFunction();
            expectTypeOf()
                .toHaveProperty("testFunction")
                .toBeCallableWith({ param1: "test", param2: 42 });
            expectTypeOf()
                .toHaveProperty("testFunction")
                .returns.resolves.toBeBoolean();
        });
        it("should handle functions without parameters", () => {
            const emptyParamsAbi = {
                body: {
                    functions: [
                        {
                            name: "noParams",
                            result: {
                                serialization_type: "json",
                                type_schema: { type: "string" },
                            },
                        },
                    ],
                    root_schema: { definitions: {} },
                },
            };
            expectTypeOf()
                .toHaveProperty("noParams")
                .toBeCallableWith({});
            expectTypeOf()
                .toHaveProperty("noParams")
                .returns.resolves.toBeString();
        });
        it("should handle functions without return type", () => {
            const noReturnAbi = {
                body: {
                    functions: [
                        {
                            name: "voidFunction",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "input",
                                        type_schema: { type: "string" },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: { definitions: {} },
                },
            };
            expectTypeOf()
                .toHaveProperty("voidFunction")
                .returns.resolves.toBeVoid();
        });
    });
});
//# sourceMappingURL=type-inference.test.js.map
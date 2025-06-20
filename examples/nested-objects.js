/**
 * Example demonstrating deeply nested object type inference
 */
import { createContract } from "../src/index.js";
import nestedObjectsAbi from "./abis/nested-objects.json" with { type: "json" };
const nestedContract = createContract(nestedObjectsAbi);
export async function testNestedObjects() {
    const result = await nestedContract.processDeepNesting({
        data: {
            level1: {
                level2: {
                    level3: {
                        deepValue: "nested string",
                        deepArray: [{ nested: true }, { nested: false }],
                    },
                    level2Value: 42,
                },
            },
            topLevel: "top level string",
        },
    });
    console.log(result.processed.summary.count);
    console.log(result.processed.summary.status);
}
//# sourceMappingURL=nested-objects.js.map
/**
 * Runtime contract implementation
 */

export class SimpleContract {
  constructor(private abi: any) {
    this.abi.body.functions.forEach((func: any) => {
      (this as any)[func.name] = async (params: any) => {
        console.log(`Calling ${func.name}:`, params);
        console.log(`Function kind: ${func.kind}`);
        return this.mockCall(func);
      };
    });
  }

  private mockCall(func: any) {
    if (func.name === "add" || func.name === "add_call") return [5, 6];
    if (func.name === "multiply") return 42;
    return undefined;
  }
}
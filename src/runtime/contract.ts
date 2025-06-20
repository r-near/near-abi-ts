/**
 * Runtime contract implementation
 */

import type { Account } from "@near-js/accounts"
import type { TxExecutionStatus } from "@near-js/types"

export class TypedContract {
  constructor(
    private abi: any,
    private account: Account,
    private contractId: string,
  ) {
    this.abi.body.functions.forEach((func: any) => {
      ;(this as any)[func.name] = async (
        options: {
          args?: any
          deposit?: bigint | string | number
          gas?: bigint | string | number
          waitUntil?: TxExecutionStatus
        } = {},
      ) => {
        const { args = {}, deposit, gas, waitUntil } = options

        if (func.kind === "view") {
          return await this.account.provider.callFunction(this.contractId, func.name, args)
        } else {
          return await this.account.callFunction({
            contractId: this.contractId,
            methodName: func.name,
            args,
            deposit,
            gas,
            waitUntil,
          })
        }
      }
    })
  }
}

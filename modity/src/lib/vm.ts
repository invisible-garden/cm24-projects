import { Chain, Common } from "@ethereumjs/common";
import { VM } from "@ethereumjs/vm";
import { Address, Account } from "@ethereumjs/util";
import { ExecResult } from "@ethereumjs/evm";
import { fromBytes } from "viem";
import { Source } from "./source";

export const VM_ADDRESS = Address.fromString("0xffffffffffffffffffff00000000000000000000");

export class EthVM {

  vm!: VM;
  protected constructor() { }

  static async create() {
    const vm = new EthVM();
    vm.vm = await VM.create({
      common: new Common({ chain: Chain.Mainnet }),
      
    })
    return vm;
  }

  async shadowClone() {
    const vm = new EthVM();
    vm.vm = await this.vm.shallowCopy();
    return vm;
  }

  async createMockAddr() {
    const account = Account.fromPartialAccountData({
      balance: 10n ** 18n,
    })
    const address = Address.fromString("0x1000000000000000000000000000000000000000");
    await this.vm.stateManager.putAccount(address, account);
    return address;
  }

  async deployContract(bytecode: Buffer, address: Address = VM_ADDRESS) {
    const result = await this.vm.evm.runCode({
      code: bytecode,
      gasLimit: 0x10000000000000000n,
    })

    if (result.exceptionError) {
      throw new Error(`Failed to deploy contract: ${result.exceptionError}`);
    }
    await this.vm.stateManager.putContractCode(address, result.returnValue);

    return address;
  }

  /**
   * Run the code with the given address and data
   * @param address 
   * @param data default is run()
   */
  async runCode(source: Source, withStop: boolean = true) {
    // this.vm.evm.events!.on('step', function (data) {
    //   console.log(data)
    //   console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`)
    //   throw new Error("stop")
    // })

    const result = await this.vm.evm.runCode({
      code: withStop ? await source.getBytecodeWithStop() : await source.getBytecode(),
      data:Buffer.from("c0406226","hex"),
      gasLimit: 0x10000000000000000n,
      value: 0n,
    })

    if (result.exceptionError) {
      throw result.exceptionError;
    }

    return result
  }
}

export function getStack(result: ExecResult) {
  return result.runState?.stack
}

export function getLastStackValue(result: ExecResult) {
  const offset = Number(getStack(result)?.getStack().pop())
  if (!offset) {
    throw new Error("stack is empty")
  }
  const memory = result.runState?.memory
  if (!memory) {
    throw new Error("memory is empty")
  }

  const lenData = memory.read(offset, 32)
  const len = fromBytes(lenData!, "bigint")
  const realData = memory.read(offset + 32, Number(len))
  return realData
}
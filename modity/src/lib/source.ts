import { FragmentCodeDetail } from "@/components/CodeContent";
import { ExecResult } from "@ethereumjs/evm";
import { cloneDeep } from "lodash";
import { VariableDeclaration } from "solidity-ast";
import { decodeAbiParameters } from "viem";
import { solidityCompiler } from "./compiler";
import { defaultTemplate } from "./contract";
import { getOpcodeKey } from "./contract/opcodes";
import { decodeInstructions, Instruction } from "./contract/source_map";
import { CodeType, CompiledContract, SourceType } from "./types";
import { getContractNode, searchInspectorType, searchRunVariables } from "./utils";
import { getLastStackValue } from "./vm";
const VERSION = "soljson-v0.8.20+commit.a1b79de6.js"

export type CompileResult = {
  type: CodeType,
  code: string[],
  source: Source,
  displayExpression?: string
}

export type VariableMeta = {
  name: string
}

export type CompiledResult = {
  type: SourceType,
  source: Source,
  variableMeta?: VariableMeta
}

export class Source {
  private source: string = '';
  private compiled: CompiledContract | null = null;
  private code: string[] = [];
  private topLevelCode: string[] = [];
  private globalCode: string[] = [];
  private imports: string[] = [];
  private dry = false;
  private sourceType: SourceType = SourceType.Normal;
  private appendCode: string[] = [];

  private variables: Map<string, VariableDeclaration> = new Map()
  private sourceMap: Instruction[] | null = null

  private setDry(dry: boolean) {
    this.dry = dry;
    if (dry) {
      this.compiled = null;
      this.sourceMap = null
    }
  }

  getBytecode(name = "MoldityBox") {
    return Buffer.from(this.compiled!.contracts["Compiled_Contracts"][name].evm.bytecode.object, "hex")
  }

  getDeployedBytecode(name = "MoldityBox") {
    return Buffer.from(
      this.compiled!.contracts["Compiled_Contracts"][name].evm.deployedBytecode.object, "hex"
    )
  }

  rawClone() {
    return cloneDeep(this)
  }
  clone() {
    const clone = this.rawClone()
    clone.appendCode = []
    return clone
  }

  addCode(detailCode: FragmentCodeDetail) {
    if (detailCode.runnableCode) {
      this.pushExecCode(detailCode.runnableCode.split("\n"))
    }
    if (detailCode.topLevelCode) {
      this.pushTopLevelCode(detailCode.topLevelCode.split("\n"))
    }
    if (detailCode.globalCode) {
      this.pushGlobalCode(detailCode.globalCode.split("\n"))
    }
  }

  pushExecCode(input: string[]) {
    this.code.push(...input);
    this.setDry(true);
  }

  pushGlobalCode(input: string[]) {
    this.globalCode.push(...input);
    this.setDry(true);
  }

  pushTopLevelCode(input: string[]) {
    this.topLevelCode.push(...input);
    this.setDry(true);
  }

  pushImport(input: string[]) {
    this.imports.push(...input);
    this.setDry(true);
  }

  setAppendCode(input: string[]) {
    this.appendCode = input;
    this.setDry(true);
  }

  toContractSource(useAppendCode = false) {
    if (!this.dry) {
      return this.source;
    }

    this.setDry(false);
    this.source = defaultTemplate({
      contractName: "MoldityBox",
      scriptImport: this.imports.join("\n"),
      globalCode: this.globalCode.join("\n"),
      topLevelCode: this.topLevelCode.join("\n"),
      runCode: useAppendCode ? [...this.code, ...this.appendCode].join("\n") : this.code.join("\n"),
    });
    return this.source;
  }

  async findEndRunOP() {
    // Find the run function code
    const regex = /bytes\s+memory\s+inspectoor\s*=\s*abi\.encode\s*\(\s*(.*?)\s*\)\s*;/;
    const match = regex.exec(this.toContractSource());
    if (!match) {
      throw new Error("未找到匹配的代码片段");
    }
    const functionCode = match[0];

    const start = this.source.indexOf(functionCode);
    if (start === -1) {
      throw new Error("在源代码中未找到匹配的代码片段");
    }
    const end = start + functionCode.length;
    const codeFragment = this.source.slice(start, end - 1);// end - 1 to remove the semicolon
    await this.compile();

    const instruction = this.sourceMap?.findLast((i) => i.location?.content === codeFragment);
    if (!instruction) {
      debugPrint(this.sourceMap!)
      throw new Error("未找到对应的指令");
    }
    return instruction.byteOffset + 1;
  }

  async getBytecodeWithStop() {
    const endPC = await this.findEndRunOP()
    // concat the source map with stop
    // replace with bytecode offset
    const bytecode = this.getDeployedBytecode().toString("hex")
    const offset = endPC * 2

    const result = Buffer.from(bytecode.slice(0, offset) + "00" + bytecode.slice(offset + 2), "hex")

    return result
  }

  async decodeVariable(result: ExecResult, variableMeta: VariableMeta) {
    const value = getLastStackValue(result)
    const variable = this.searchVariable(variableMeta.name)
    if (!variable) {
      throw new Error("Variable not found")
    }
    return {
      variable,
      value: decodeAbiParameters([{ name: variableMeta.name, type: variable.typeDescriptions.typeString! }], value)[0]
    }
  }

  searchVariable(name: string) {
    const variable = this.variables.get(name)
    if (variable) {
      return variable
    }
    // for case address(0).balance or others. we can search in the ast about the inspectoor initialValue
    const contract = getContractNode(this.compiled!)!
    const inspectorType = searchInspectorType(contract)

    if (inspectorType) {
      return {
        name,
        typeDescriptions: inspectorType
      }
    }
    //TODO:
    throw new Error("Variable not found")
  }

  async compile() {
    if (this.compiled) return this.compiled;
    const source = this.toContractSource(true);
    console.log(this, source)
    const compiled = (await solidityCompiler({
      version: `https://binaries.soliditylang.org/bin/${VERSION}`,
      contractBody: source,
    }));
    this.compiled = compiled as CompiledContract;
    if (this.compiled.errors && this.compiled.errors.filter((e) => e.severity === "error").length > 0) {
      throw this.compiled
    }

    this.postCompile()
    return compiled;
  }

  /**
   * Find all variables in the contract run function
   */
  async postCompile() {
    // Find all variables in the contract run function
    const contract = getContractNode(this.compiled!)!
    const variables = searchRunVariables(contract)

    for (const variable of variables) {
      const variableName = variable.name
      this.variables.set(variableName, variable)
    }

    const { object: bytecode, sourceMap } = this.compiled!.contracts["Compiled_Contracts"]["MoldityBox"].evm.deployedBytecode
    this.sourceMap = decodeInstructions(
      Buffer.from(bytecode, 'hex'), sourceMap,
      new Map([[0, this.source]]), false)
  }

  async compileWithCode() {
    const source = this.rawClone()
    await source.compile()
    return source
  }

  /**
 * Try to compile new code with the given source
 * Beacuse the source will be end with variable declaration
 * Will return the type of source and the source
 * VariableDeclaration is be modified to display the value, only need to get the data from stack
 * @param codeRaw 
 */
  async tryCompileNewCode(codeRaw: string[]): Promise<CompiledResult> {
    const result = await this.checkTypeWithCode(codeRaw)
    this.sourceType = result.type
    if (result.type === SourceType.VariableDeclaration) {
      return {
        type: SourceType.VariableDeclaration,
        source: await this.compileWithCode(),
        variableMeta: result.variableMeta
      }
    }

    return {
      type: SourceType.Normal,
      source: await this.compileWithCode(),
    }
  }

  /**
 * Try to find the code type
 * To check if the end code is a variable declaration
 * @param source 
 * @param codeRaw 
 */
  public async checkTypeWithCode(codeRaw: string[]): Promise<{
    type: SourceType,

    variableMeta?: {
      name: string
    }
  }> {

    // Import
    if (codeRaw[0].startsWith("import")) {
      this.pushImport(codeRaw)
      return {
        type: SourceType.Normal
      }
    }
    // 开头为:TopLevelCode 放在外部执行
    if (codeRaw[0].startsWith("//:TopLevelCode")) {
      this.pushTopLevelCode(codeRaw.slice(1))
      return {
        type: SourceType.Normal
      }
    }
    if (codeRaw[0].startsWith("function")){
      this.pushTopLevelCode(codeRaw)
      return {
        type: SourceType.Normal
      }
    }
    // 开头为:GlobalCode 放在顶部执行
    if (codeRaw[0].startsWith("//:GlobalCode")) {
      this.pushGlobalCode(codeRaw.slice(1))
      return {
        type: SourceType.Normal
      }
    }
    // for (const code of codeRaw) {
    //   if (code.startsWith("//")) continue
    //   if (code.startsWith("pragma"))

    // }
    // 默认为RunCode，如果结尾不是分号，自动的转换成VariableDeclaration，获取最后得到的值
    if (codeRaw[codeRaw.length - 1].endsWith(";")) {
      this.pushExecCode(codeRaw)
      return {
        type: SourceType.Normal
      }
    }

    const name = codeRaw[codeRaw.length - 1].trim()
    const appendCode = `bytes memory inspectoor = abi.encode(${name});`
    this.pushExecCode(codeRaw.slice(0, -1))
    this.setAppendCode([appendCode])

    return {
      type: SourceType.VariableDeclaration,
      variableMeta: {
        name
      }
    }
  }

  hasError() {
    return this.compiled?.errors.filter((e) => e.severity === "error").length || 0 > 0
  }

  getError() {
    return this.compiled?.errors
  }
}


function debugPrint(instructions: Instruction[]) {
  for (const instruction of instructions) {
    console.log(
      `${getOpcodeKey(instruction.opcode)} ${instruction.location?.content}`
    )
  }
}
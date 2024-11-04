import { TypeDescriptions } from "solidity-ast"
import { SolcOutput } from "solidity-ast/solc"

export enum SourceType {
  Normal,
  VariableDeclaration,
}

export enum CodeType {
  Normal,
  DisplayDeclaration,
  TopLevelDeclaration,
  GlobalDeclaration,
  ImportDeclaration,
  Empty
}


export interface CompileError {
  severity: string,
  type: string,
  message: string,
  formattedMessage: string,
  sourceLocation: {
    end: number,
    file: string,
    start: number,
  }
}

export interface CompiledContract extends SolcOutput {
  contracts: {
    [key: string]: {
      [key: string]: {
        evm: {
          bytecode: {
            object: string,
            sourceMap: string
          },
          deployedBytecode: {
            object: string,
            sourceMap: string
          }
        }
      }
    }
  }
  errors: CompileError[];
}

export type VariableMeta = {
  name: string;
  typeDescriptions: TypeDescriptions;
}

export type DecodeVariableResult = { variable: VariableMeta, value: unknown }
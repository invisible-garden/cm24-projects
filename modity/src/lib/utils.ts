import { clsx, type ClassValue } from "clsx"
import { Node } from "solidity-ast/node";
import { astDereferencer, ExtendedNodeTypeMap, findAll } from "solidity-ast/utils";
import { twMerge } from "tailwind-merge"
import { CompiledContract } from "./types";
import { FunctionCall, TypeDescriptions } from "solidity-ast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createCompileInput = (contractBody: string, options: object = {}): string => {
  const CompileInput = {
    language: 'Solidity',
    sources: {
      'Compiled_Contracts': {
        content: contractBody
      }
    },
    settings: {
      ...options,
      outputSelection: {
        '*': {
          '*': ['*'],
          "": [
            "ast"
          ]
        },
      },
    },
  };
  return JSON.stringify(CompileInput);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function as<T>(node: unknown | any): T {
  return node as T;
}

export function filterNode<T extends Node>(generator: Iterable<T>, filter: (node: T) => boolean): T | null {
  let result: T | null = null;
  for (const node of generator) {
    if (filter(node)) {
      result = node;
    }
  }
  return result;
}

export function getContractNode(compiled: CompiledContract): ExtendedNodeTypeMap["ContractDefinition"] | null {
  const deref = astDereferencer(compiled)
  const id = compiled!.sources["Compiled_Contracts"].ast.id
  const node = deref("SourceUnit", id)
  return filterNode(findAll("ContractDefinition", node), (node) => node.name === "MoldityBox")
}

export function findVariables(functionName: string, node: ExtendedNodeTypeMap["ContractDefinition"]): ExtendedNodeTypeMap["VariableDeclaration"][] {
  const functionNode = filterNode(findAll("FunctionDefinition", node), (node) => node.name === functionName)
  if (!functionNode) return []
  const variableNode = findAll("VariableDeclaration", functionNode)
  return [...variableNode]
}

export function searchRunVariables(contract: ExtendedNodeTypeMap["ContractDefinition"]): ExtendedNodeTypeMap["VariableDeclaration"][] {
  const variables = findVariables("run", contract)
  return variables
}

export function searchInspectorType(node: ExtendedNodeTypeMap["ContractDefinition"]): TypeDescriptions {
  const vds = filterNode(findAll("VariableDeclarationStatement", node),
    (variable) =>
      !!variable.declarations.find((declaration) => declaration?.name === "inspectoor")
  )
  if (!vds) throw new Error("Inspector not found")
  if (vds.initialValue?.nodeType == "FunctionCall") {
    const initialValue = vds.initialValue as FunctionCall
    const argument = initialValue.arguments?.[0]
    if (!argument) throw new Error("Inspector not found")

    return argument.typeDescriptions
  }

  console.log("variable", vds)
  throw new Error("Inspector not known")
}

/**
 * Get the run function and the contract node
 * @param compiled 
 * @returns {contractNode, functionNode}
 */
export function getRunFunction(compiled: CompiledContract) {
  const deref = astDereferencer(compiled)
  const id = compiled!.sources["Compiled_Contracts"].ast.id
  const node = deref("SourceUnit", id)
  const contract = filterNode(findAll("ContractDefinition", node), (node) => node.name === "MoldityBox")!
  const functionNode = filterNode(findAll("FunctionDefinition", contract), (node) => node.name === "run")!

  return { contractNode: node, functionNode: functionNode }
}
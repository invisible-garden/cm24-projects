export interface ContractTemplateParams {
  contractName?: string;
  scriptImport: string;
  globalCode: string;
  topLevelCode: string;
  runCode: string;
}

export function contractTemplate(strings: TemplateStringsArray, ...keys: (keyof ContractTemplateParams)[]) {
  return function(params: ContractTemplateParams): string {
    const result = [strings[0]];
    keys.forEach((key, i) => {
      if (key === 'contractName') {
        result.push(params.contractName || "MoldityBox", strings[i + 1]);
      } else {
        const value = params[key];
        result.push(value, strings[i + 1]);
      }
    });
    return result.join('');
  };
}

export const defaultTemplate = contractTemplate`// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

${'scriptImport'}
${'globalCode'}

contract ${'contractName'} {
    ${'topLevelCode'}
  
    /// @notice Script entry point
    function run() public {
        ${'runCode'}
    }
}
`
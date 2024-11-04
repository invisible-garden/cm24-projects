import { getOpcodeKey, getOpcodeLength, getPushLength, isJump, isPush, Opcode } from "./opcodes";

export enum JumpType {
  NOT_JUMP,
  INTO_FUNCTION,
  OUTOF_FUNCTION,
  INTERNAL_JUMP,
}

export interface Location{
    offset: number;
    length: number;
    content?:string
}

export class Instruction {
  constructor(
    public readonly pc: number,
    public readonly opcode: Opcode,
    public readonly jumpType: JumpType,
    public readonly byteOffset: number,
    public readonly pushData?: Buffer,
    public readonly location?: Location
  ) {}

  toBytecode(){
    return this.opcode.toString(16).padStart(2, "0") + (this.pushData ? this.pushData.toString("hex") : "")
  }
}

export interface SourceMapLocation {
  offset: number;
  length: number;
  file: number;
}

export interface SourceMap {
  location: SourceMapLocation;
  jumpType: JumpType;
}

function jumpLetterToJumpType(letter: string): JumpType {
  if (letter === "i") {
    return JumpType.INTO_FUNCTION;
  }

  if (letter === "o") {
    return JumpType.OUTOF_FUNCTION;
  }
  return JumpType.NOT_JUMP;
}

function uncompressSourcemaps(compressedSourcemap: string): SourceMap[] {
  const mappings: SourceMap[] = [];

  const compressedMappings = compressedSourcemap.split(";");

  for (let i = 0; i < compressedMappings.length; i++) {
    const parts = compressedMappings[i].split(":");

    const hasParts0 = parts[0] !== undefined && parts[0] !== "";
    const hasParts1 = parts[1] !== undefined && parts[1] !== "";
    const hasParts2 = parts[2] !== undefined && parts[2] !== "";
    const hasParts3 = parts[2] !== undefined && parts[3] !== "";

    const hasEveryPart = hasParts0 && hasParts1 && hasParts2 && hasParts3;

    // See: https://github.com/nomiclabs/hardhat/issues/593
    if (i === 0 && !hasEveryPart) {
      mappings.push({
        jumpType: JumpType.NOT_JUMP,
        location: {
          file: -1,
          offset: 0,
          length: 0,
        },
      });

      continue;
    }

    mappings.push({
      location: {
        offset: hasParts0 ? +parts[0] : mappings[i - 1].location.offset,
        length: hasParts1 ? +parts[1] : mappings[i - 1].location.length,
        file: hasParts2 ? +parts[2] : mappings[i - 1].location.file,
      },
      jumpType: hasParts3
        ? jumpLetterToJumpType(parts[3])
        : mappings[i - 1].jumpType,
    });
  }

  return mappings;
}

// function addUnmappedInstructions(
//   instructions: Instruction[],
//   bytecode: Buffer,
//   bytesIndex: number
// ) {
//   const lastInstrPc = instructions[instructions.length - 1].pc;
//   let nextPc = lastInstrPc + 1;

//   while (bytecode[nextPc] !== Opcode.INVALID) {
//     const opcode = bytecode[nextPc];
//     let pushData: Buffer | undefined;

//     let pushDataLenth = 0;
//     if (isPush(opcode)) {
//       pushDataLenth = getPushLength(opcode);
//       pushData = bytecode.slice(bytesIndex + 1, bytesIndex + 1 + pushDataLenth);
//     }

//     const jumpType = isJump(opcode)
//       ? JumpType.INTERNAL_JUMP
//       : JumpType.NOT_JUMP;

//     const instruction = new Instruction(nextPc, opcode, jumpType, pushData);
//     instructions.push(instruction);

//     nextPc += 1 + pushDataLenth;
//   }
// }

export function decodeInstructions(
  bytecode: Buffer,
  compressedSourcemaps: string,
  fileIdToSourceFile: Map<number, string>,
  isDeployment: boolean
): Instruction[] {
  const sourceMaps = uncompressSourcemaps(compressedSourcemaps);

  const instructions: Instruction[] = [];

  let bytesIndex = 0;

  // Solidity inlines some data after the contract, so we stop decoding
  // as soon as we have enough instructions as uncompressed mappings. This is
  // not very documented, but we manually tested that it works.
  while (instructions.length < sourceMaps.length) {
    const pc = bytesIndex;
    const opcode = bytecode[pc];
    const sourceMap = sourceMaps[instructions.length];
    let pushData: Buffer | undefined;
    let location: Location | undefined;

    const jumpType =
      isJump(opcode) && sourceMap.jumpType === JumpType.NOT_JUMP
        ? JumpType.INTERNAL_JUMP
        : sourceMap.jumpType;

    if (isPush(opcode)) {
      const length = getPushLength(opcode);
      pushData = bytecode.slice(bytesIndex + 1, bytesIndex + 1 + length);
    }

    if (sourceMap.location.file !== -1) {
      const file = fileIdToSourceFile.get(sourceMap.location.file);

      if (file !== undefined) {
        location = {
          offset: sourceMap.location.offset,
          length: sourceMap.location.length,
          content: file.slice(sourceMap.location.offset, sourceMap.location.offset + sourceMap.location.length)
        };
      }
    }

    const instruction = new Instruction(
      pc,
      opcode,
      jumpType,
      bytesIndex,
      pushData,
      location
    );

    instructions.push(instruction);

    bytesIndex += getOpcodeLength(opcode);
  }

  // // See: https://github.com/ethereum/solidity/issues/9133
  // if (isDeployment) {
  //   addUnmappedInstructions(instructions, bytecode, bytesIndex);
  // }

  return instructions;
}


// const result = decodeInstructions(
//   Buffer.from("6080604052348015600f57600080fd5b506004361060285760003560e01c8063c040622614602d575b600080fd5b60336035565b005b600060649050600081604051602001604c91906078565b60405160208183030381529060405290505050565b6000819050919050565b6072816061565b82525050565b6000602082019050608b6000830184606b565b9291505056fea2646970667358221220c0dadaadb725409ee407664000164edf6513caa3f9a8a4249cf760b397879f9f64736f6c63430008110033","hex"),
//   "67:163:0:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;136:92;;;:::i;:::-;;;168:6;177:3;168:12;;182:23;219:1;208:13;;;;;;;;:::i;:::-;;;;;;;;;;;;;182:39;;158:70;;136:92::o;7:77:1:-;44:7;73:5;62:16;;7:77;;;:::o;90:118::-;177:24;195:5;177:24;:::i;:::-;172:3;165:37;90:118;;:::o;214:222::-;307:4;345:2;334:9;330:18;322:26;;358:71;426:1;415:9;411:17;402:6;358:71;:::i;:::-;214:222;;;;:::o",
//   new Map([[0, 
//     `// SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.0;




// contract MoldityBox {
    
  
//     /// @notice Script entry point
//     function run() public {
//         uint x = 100;
// bytes memory inspectoor = abi.encode(x);
//     }
// }`
//   ]]),
//   false
// )

// for(const instruction of result){
//   console.log(getOpcodeKey(instruction.opcode),
//   `POS:${instruction.location?.offset}:${instruction.location?.length}: ${JSON.stringify(instruction.location?.content)}`)
// }
import { produce } from "immer";
import { FragmentData, FragmentsAtom, FragmentSnapshot, FragmentsSnapshot, getCurrentFragment, LastFragmentSnapshot, RunIndexAtom } from "@/components/CodeContent";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";
import { Source } from "../source";
import { CompiledContract, DecodeVariableResult, SourceType } from "../types";
import { EthVM } from "../vm";

function getSource(fragment?:FragmentSnapshot){
  if(!fragment) return new Source();
  return fragment.source.clone();
}

export const useRunCode = () => {
  return useAtomCallback(
    useCallback(async (get, set, uuid?: string) => {
      if (uuid === undefined) return;
      const fragments = get(FragmentsAtom);
      const lastFragment = get(LastFragmentSnapshot);
      const runIndex = get(RunIndexAtom);
      const fragment = getCurrentFragment(fragments, uuid)!;
      const updateCurrentFragment = (cb: (draft: FragmentData) => void) => {
        set(FragmentsAtom, (prev) => 
          produce(prev, (draft: FragmentData[]) => {
            const fragment = draft.find((v) => v.uuid === uuid)!;
            cb(fragment);
          })
        );
      };
      
      // 重建已经运行过的段的souce
      const source = getSource(lastFragment);

      updateCurrentFragment((draft) => {
        draft.result = undefined;
        draft.error = undefined;
      })

      const vm = await EthVM.create();

      try {
        const codes = fragment.code.trim().split("\n");

        const {
          type: type,
          source: newSource,
          variableMeta,
        } = await source.tryCompileNewCode(codes);

        const result = await vm.runCode(
          newSource,
          type === SourceType.VariableDeclaration
        );
        const {variable, value} = type === SourceType.VariableDeclaration ? await newSource.decodeVariable(
          result,
          variableMeta!
        ) : {} as DecodeVariableResult;

        updateCurrentFragment((draft) => {
          draft.result = {variable, value};

          if (!draft.detailCode) draft.detailCode = {}
          switch (type) {
            case SourceType.VariableDeclaration:
              draft.detailCode!.runnableCode = codes.slice(0, -1).join("\n");
              break;
            case SourceType.Normal:
              draft.detailCode!.runnableCode = draft.code;
              break;
          }
          draft.runIndex = runIndex;
          set(RunIndexAtom, runIndex + 1);
          set(FragmentsSnapshot, (draftSnapshots) => {
            return [...draftSnapshots, {
              ...draft,
              source: newSource
            }]
          })
          const scrollTo = draft.scrollTo;
          setTimeout(()=>{
            scrollTo?.();
          },10);
        });
      } catch (e: unknown) {
        console.log("error", e);
        if ((e as CompiledContract).errors) {
          updateCurrentFragment((draft) => {
            draft.error = (e as CompiledContract).errors;
          });
        }
      }
    }, [])
  );
};

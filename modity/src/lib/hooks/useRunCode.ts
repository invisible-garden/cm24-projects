import { FragmentData, FragmentsAtom, FragmentSnapshot, FragmentsSnapshot, LastFragmentSnapshot, RunIndexAtom, RunnedStatus } from "@/components/CodeContent";
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
    useCallback(async (get, set, index?: number) => {
      if (index === undefined) return;
      const fragments = get(FragmentsAtom);
      const lastFragment = get(LastFragmentSnapshot);
      const runIndex = get(RunIndexAtom);
      const fragment = fragments[index];
      const setFragment = (index: number, cb: (draft: FragmentData) => void) => {
        set(FragmentsAtom, (draft) => {
          cb(draft[index]);
        });
      }
      // 重建已经运行过的段的souce
      const source = getSource(lastFragment);

      setFragment(index, (draft) => {
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

        set(FragmentsAtom, (draft) => {
          const fragment = draft[index];
          fragment.result = {variable, value};

          if (!fragment.detailCode) fragment.detailCode = {}
          switch (type) {
            case SourceType.VariableDeclaration:
              fragment.detailCode!.runnableCode = codes.slice(0, -1).join("\n");
              break;
            case SourceType.Normal:
              fragment.detailCode!.runnableCode = fragment.code;
              break;
          }
          fragment.runIndex = runIndex;
          set(RunIndexAtom, runIndex + 1);
          set(FragmentsSnapshot, (draft) => {
            return [...draft, {
              ...fragment,
              source: newSource
            }]
          })
          const scrollTo = fragment.scrollTo;
          setTimeout(()=>{
            scrollTo?.();
          },10);
        });
      } catch (e: unknown) {
        console.log("error", e);
        if ((e as CompiledContract).errors) {
          set(FragmentsAtom, (draft) => {
            draft[index].error = (e as CompiledContract).errors;
          });
        }
      }
    }, [])
  );
};

import { Button } from "@/components/ui/button";
import { FastForward, Play } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { GlobalSelect } from "./CodeFragment";
import { useRunCode } from "@/lib/hooks/useRunCode";
import { getNextFragment } from "@/lib/utils";
import { FragmentsAtom } from "./CodeContent";

export default function ToolsBar() {
  const runCode = useRunCode();
  const [uuid, setUuid] = useAtom(GlobalSelect);
  const fragments = useAtomValue(FragmentsAtom);

  const run = () => {
    if (uuid === undefined) return;
    runCode(uuid);
  };

  const runNext = () => {
    if (uuid === undefined) return;
    const nextFragment = getNextFragment(fragments, uuid);
    if (!nextFragment.fragment) return;

    setUuid(nextFragment.fragment.uuid);
    runCode(nextFragment.fragment.uuid);
  };

  return (
    <div className="flex items-center p-2 bg-white border-b gap-2">
      <Button onClick={run} variant="ghost" size="sm" className="rounded-none">
        <Play className="w-3 h-3" strokeWidth={3} fill="currentColor" />
      </Button>

      <Button
        onClick={runNext}
        variant="ghost"
        size="sm"
        className="rounded-none"
      >
        <FastForward className="w-3 h-3" strokeWidth={3} fill="currentColor" />
      </Button>
    </div>
  );
}

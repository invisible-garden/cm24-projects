import { Button } from "@/components/ui/button";
import { FastForward, Play } from "lucide-react";
import { useAtom } from "jotai";
import { GlobalSelect } from "./CodeFragment";
import { useRunCode } from "@/lib/hooks/useRunCode";

export default function ToolsBar() {
  const runCode = useRunCode();
  const [index, setIndex] = useAtom(GlobalSelect);

  const run = () => {
    if (index === undefined) return;
    runCode(index);
  };

  const runNext = () => {
    if (index === undefined) return;
    const newIndex = index + 1;
    setIndex(newIndex);
    runCode(newIndex);
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

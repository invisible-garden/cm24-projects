import { CompileError, DecodeVariableResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { solidity } from "@replit/codemirror-lang-solidity";
import { tokyoNightDay } from "@uiw/codemirror-theme-tokyo-night-day";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import {
  Atom,
  atom,
  PrimitiveAtom,
  useAtom,
  useAtomValue,
  useSetAtom,
} from "jotai";
import { useImmerAtom } from "jotai-immer";
import { useEffectOnce } from "react-use";
import { FragmentData, RunnedStatus } from "./CodeContent";
import { useMemo, useRef, useState } from "react";
import { result } from "lodash";
import {
  ChevronRight,
  ChevronDown,
  UnfoldVertical,
  FoldVertical,
  ChevronsDownUp,
  ChevronsUpDown,
} from "lucide-react";

type CodeFragmentProps = {
  index: number;
  className?: string;
  fragmentAtom: PrimitiveAtom<FragmentData>;
};

type CodeFragmentType = "input" | "output" | "error";

const focusTheme = EditorView.theme({
  "&": {
    transition:
      "box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out",
  },
  "&.cm-focused": {
    outline: "none",
    boxShadow:
      "inset 0 0 0 2px #4a90e2, inset 0 0 10px rgba(74, 144, 226, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});

export const GlobalSelect = atom<number | undefined>();
GlobalSelect.debugLabel = "GlobalSelect";

export default function CodeFragment({
  index,
  className,
  fragmentAtom,
}: CodeFragmentProps) {
  const [fragment, setFragment] = useImmerAtom(fragmentAtom);
  fragmentAtom.debugLabel = "FragmentAtomsAtom:" + index;

  const domRef = useRef<HTMLDivElement>(null);
  const setActive = useSetAtom(GlobalSelect);

  const runIndex = fragment.runIndex;

  // 是否折叠
  const isCollapsedAtom = useMemo(() => atom(false), []);
  const isCollapsed = useAtomValue(isCollapsedAtom);

  const truncateCode = (code: string, maxLength: number) => {
    return code.replace(/\n/g, " ").slice(0, maxLength) + "...";
  };

  const code = useMemo(() => {
    return isCollapsed ? truncateCode(fragment.code, 100) : fragment.code;
  }, [fragment.code, isCollapsed]);

  useEffectOnce(() => {
    setFragment((draft) => {
      draft.scrollTo = (position: "code" | "result" = "result") => {
        if (domRef.current) {
          const target =
            position === "result"
              ? domRef.current.querySelector(".view-tag")
              : domRef.current;
          target?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      };
    });
  });

  const onChange = (value: string) => {
    setFragment((fragment) => {
      fragment.code = value;
    });
  };

  return (
    <div
      ref={domRef}
      onClick={() => setActive(index)}
      className={cn([className, "group"])}
    >
      <div className="fragment-code flex mb-2">
        <div className="flex w-full ">
          <CodeFragmentHeader
            index={runIndex}
            type={"input"}
            isCollapsedAtom={isCollapsedAtom}
          />
          <CodeMirror
            className="flex-grow"
            value={code}
            theme={tokyoNightDay}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
            }}
            extensions={[solidity, focusTheme]}
            onChange={onChange}
            minHeight="20px"
          />
        </div>
      </div>
      {fragment.result?.value !== undefined ? (
        <div className="fragment-result flex mt-2">
          <CodeFragmentHeader index={runIndex} type={"output"} />
          <RenderResult {...fragment.result} />
        </div>
      ) : (
        ""
      )}
      {fragment.error && (
        <div className="fragment-result flex mt-2">
          <CodeFragmentHeader index={runIndex} type={"error"} />
          <ErrorMessage error={fragment.error} />
        </div>
      )}
      <div className="view-tag" />
    </div>
  );
}

const ErrorMessageSeverityColor: Record<string, string> = {
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};

export function ErrorMessage({ error }: { error: CompileError[] }) {
  return (
    <div className="mt-1">
      {error.map((e, index) => (
        <div key={index}>
          <pre
            className={cn("text-xs", ErrorMessageSeverityColor[e.severity])}
            dangerouslySetInnerHTML={{ __html: e.formattedMessage }}
          />
        </div>
      ))}
    </div>
  );
}

function parseValue({ variable, value }: DecodeVariableResult) {
  if (typeof value === "bigint") {
    return value;
  }

  if (variable.typeDescriptions.typeString === "address") {
    return BigInt(value as string);
  }
}

export function RenderResult({ variable, value }: DecodeVariableResult) {
  if (!variable || value === undefined) return "";
  console.log(variable, value);
  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 text-sm font-mono">
      <span className="">Type</span>
      <div className="inline text-green-700">
        <span className="text-gray-700">: </span>
        {variable.typeDescriptions.typeString}
      </div>

      <span className="text-gray-700">Hex</span>
      <span className="inline text-red-700">
        <span className="text-gray-700">: </span>
        {parseValue({ variable, value })!.toString(16)}
      </span>

      <span className="text-gray-700">Decimal</span>
      <span className="inline text-red-700">
        <span className="text-gray-700">: </span>
        {parseValue({ variable, value })!.toString(10)}
      </span>

      <span className="text-gray-700">String</span>
      <span className="inline text-red-700">
        <span className="text-gray-700">: </span>
        {typeof value === "string" ? value : "Unknown"}
      </span>
    </div>
  );
}

const CodeFragmentHeaderColor: Record<CodeFragmentType, string> = {
  input: "text-blue-500",
  output: "text-green-500",
  error: "text-red-500",
};

type CodeFragmentHeaderProps = {
  index?: number;
  type: CodeFragmentType;
  isCollapsedAtom?: PrimitiveAtom<boolean>;
};

function CodeFragmentHeader({
  index,
  type,
  isCollapsedAtom,
}: CodeFragmentHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useAtom(isCollapsedAtom ?? atom(false));
  const active = useAtomValue(GlobalSelect);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div
        className={cn(
          "w-2 mr-4 h-auto transition-colors duration-500",
          active === index && !!index ? "bg-blue-500" : "bg-transparent"
        )}
      ></div>
      {isCollapsedAtom ? (
        <button
          onClick={toggleCollapse}
          className={cn(
            "top-1 opacity-0 group-hover:opacity-100 transition-opacity flex pt-1 mr-4 relative w-[15px] h-[15px]",
            isCollapsed ? "opacity-100" : "opacity-0"
          )}
        >
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              isCollapsed ? "opacity-100" : "opacity-0"
            }`}
          >
            <ChevronsUpDown size={15} />
          </div>
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            <ChevronsDownUp size={15} />
          </div>
        </button>
      ) : (
        ""
      )}
      <div
        className={cn(
          "mt-[2px] mr-4 text-xs font-mono",
          active === index ? CodeFragmentHeaderColor[type] : "text-gray-400",
          "leading-5"
        )}
      >
        [{index ?? " "}]:{" "}
      </div>
    </>
  );
}

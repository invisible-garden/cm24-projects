import { Source } from "@/lib/source";
import CodeFragment, { GlobalSelect } from "./CodeFragment";
import { atom, useAtom, useSetAtom } from "jotai";
import { splitAtom } from "jotai/utils";
import { atomWithImmer } from "jotai-immer";
import { nanoid } from "nanoid";
import { CompileError, DecodeVariableResult } from "@/lib/types";

export type FragmentCodeDetail = {
  runnableCode?: string;
  topLevelCode?: string;
  globalCode?: string;
};
export enum RunnedStatus {
  NotRunned,
  Running,
  Success,
  Error,
}
// 定义一个类型来表示每个代码段的数据
export type FragmentData = {
  uuid: string;
  code: string;
  runIndex?: number;
  detailCode?: FragmentCodeDetail;
  result?: DecodeVariableResult;
  error?: CompileError[];
  scrollTo?: (position?: "result" | "code") => void;
};

export type FragmentSnapshot = FragmentData & {
  source: Source;
};

export const RunIndexAtom = atom<number>(1);
RunIndexAtom.debugLabel = "RunIndexAtom";

export const FragmentsSnapshot = atom<FragmentSnapshot[]>([]);
FragmentsSnapshot.debugLabel = "FragmentsSnapshot";

export const LastFragmentSnapshot = atom<FragmentSnapshot | undefined>(
  (get) => {
    const fragments = get(FragmentsSnapshot);
    if (fragments.length === 0) return undefined;
    return fragments[fragments.length - 1];
  }
);

export const FragmentsAtom = atomWithImmer<FragmentData[]>([
  {
    uuid: nanoid(),
    code: "uint x = 10;\nx",
  },
  {
    uuid: nanoid(),
    code: `//:GlobalCode
abstract contract ERC20 {
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event Transfer(address indexed from, address indexed to, uint256 amount);

    event Approval(address indexed owner, address indexed spender, uint256 amount);

    /*//////////////////////////////////////////////////////////////
                            METADATA STORAGE
    //////////////////////////////////////////////////////////////*/

    string public name;

    string public symbol;

    uint8 public immutable decimals;

    /*//////////////////////////////////////////////////////////////
                              ERC20 STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    /*//////////////////////////////////////////////////////////////
                            EIP-2612 STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256 internal immutable INITIAL_CHAIN_ID;

    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;

    mapping(address => uint256) public nonces;

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;

        INITIAL_CHAIN_ID = block.chainid;
        INITIAL_DOMAIN_SEPARATOR = computeDomainSeparator();
    }

    /*//////////////////////////////////////////////////////////////
                               ERC20 LOGIC
    //////////////////////////////////////////////////////////////*/

    function approve(address spender, uint256 amount) public virtual returns (bool) {
        allowance[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);

        return true;
    }

    function transfer(address to, uint256 amount) public virtual returns (bool) {
        balanceOf[msg.sender] -= amount;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            balanceOf[to] += amount;
        }

        emit Transfer(msg.sender, to, amount);

        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual returns (bool) {
        uint256 allowed = allowance[from][msg.sender]; // Saves gas for limited approvals.

        if (allowed != type(uint256).max) allowance[from][msg.sender] = allowed - amount;

        balanceOf[from] -= amount;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            balanceOf[to] += amount;
        }

        emit Transfer(from, to, amount);

        return true;
    }

    /*//////////////////////////////////////////////////////////////
                             EIP-2612 LOGIC
    //////////////////////////////////////////////////////////////*/
    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return block.chainid == INITIAL_CHAIN_ID ? INITIAL_DOMAIN_SEPARATOR : computeDomainSeparator();
    }

    function computeDomainSeparator() internal view virtual returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                    keccak256(bytes(name)),
                    keccak256("1"),
                    block.chainid,
                    address(this)
                )
            );
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL MINT/BURN LOGIC
    //////////////////////////////////////////////////////////////*/

    function _mint(address to, uint256 amount) internal virtual {
        totalSupply += amount;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            balanceOf[to] += amount;
        }

        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal virtual {
        balanceOf[from] -= amount;

        // Cannot underflow because a user's balance
        // will never be larger than the total supply.
        unchecked {
            totalSupply -= amount;
        }

        emit Transfer(from, address(0), amount);
    }
}

contract A is ERC20{
  constructor() ERC20("A","a",18){
    _mint(msg.sender,1000 ether);
  }
}`,
  },
  {
    uuid: nanoid(),
    code: `A a = new A();
a.balanceOf(address(this))`,
  }
]);
FragmentsAtom.debugLabel = "FragmentsAtom";

export const FragmentAtomsAtom = splitAtom(FragmentsAtom);
FragmentAtomsAtom.debugLabel = "FragmentAtomsAtom";

export const getCurrentFragment = (fragments: FragmentData[],uuid: string) => {
  return fragments.find((fragment) => fragment.uuid === uuid);
}

export const AddFragment = atom(null, (_, set, index?: number) => {
  const newFragment = {
    uuid: nanoid(),
    code: "",
    runned: RunnedStatus.NotRunned,
  };
  set(FragmentsAtom, (draft) => {
    if (index === undefined) {
      index = draft.length;
    }
    draft.splice(index, 0, newFragment);
  });
});

export const MoveFragment = atom(
  null,
  (_, set, fromIndex: number, toIndex: number) => {
    set(FragmentsAtom, (draft) => {
      const [movedFragment] = draft.splice(fromIndex, 1);
      draft.splice(toIndex, 0, movedFragment);
    });
  }
);

export default function CodeContent() {
  const [fragmentAtoms] = useAtom(FragmentAtomsAtom);
  const addFragment = useSetAtom(AddFragment);

  return (
    <div className="flex-grow p-4">
      {fragmentAtoms.map((fragmentAtom, index) => (
        <CodeFragment
          className="mb-2"
          key={fragmentAtom.toString()}
          fragmentAtom={fragmentAtom}
          index={index}
        />
      ))}
      <div className="relative w-full h-8">
        <button
          className="absolute inset-0 w-full h-full hover:border hover:border-gray-300 hover:shadow-inner opacity-0 hover:opacity-100 transition-opacity duration-100 text-gray-500 text-sm text-center"
          onClick={() => addFragment()}
        >
          添加代码段
        </button>
      </div>
    </div>
  );
}

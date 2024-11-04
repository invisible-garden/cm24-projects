declare global {
  interface SolidityModule {
    cwrap: (name: string, returnType: string, argTypes: unknown[]) => (...args: unknown[]) => string;
    _solidity_compile?: unknown;
  }

  interface Worker {
    Module: SolidityModule;
    wrapper: (Module: SolidityModule) => {
      compile: (input: string, options: { import: typeof findImports }) => string;
    };
  }
}

const ctx = self as unknown as Worker
const loaded: Record<string, boolean> = {}
importScripts('./bundle_solc.js');

const fileCache: Record<string, string> = {};

function findImports(path: string) {
  console.log(`findImports ${path}`,fileCache);
  if (path in fileCache) {
    return { contents: fileCache[path] };
  }
  return { error: `文件未预加载: ${path}` };
}

ctx.addEventListener('message', async ({ data }) => {
  const { id, input, version } = data;
  if (input === 'fetch-compiler-versions') {
    fetch('https://binaries.soliditylang.org/bin/list.json')
      .then((response) => response.json())
      .then((result) => {
        postMessage({ id, result });
      })
      .catch((error) => {
        postMessage({ id, error: error.message });
      });
  } else {
    if (!loaded[version]) {
      console.log(version)
      importScripts(version)
      loaded[version] = true
    }

    const compiler = ctx.wrapper(ctx.Module)
    const output = JSON.parse(compiler.compile(input, { import: findImports }));
    postMessage({ id, result: output });
  }
});
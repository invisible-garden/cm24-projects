import { createCompileInput } from './utils';
let currentId = 0;
const worker = new Worker(
  new URL("./browser.solidity.worker.ts", import.meta.url), {
  type: 'classic'
}
  // URL.createObjectURL(
  //   new Blob([`(${browserSolidityCompiler})()`], { type: 'module' })
  // )
);
// 初始化 worker

export const solidityCompiler = async ({
  version,
  contractBody,
  options,
}: {
  version: string;
  contractBody: string;
  options?: { optimizer?: { enabled: boolean; runs: number } };
}) => {
  const input = createCompileInput(contractBody, options);
  const id = currentId++;

  return new Promise((resolve, reject) => {
    const handleMessage = ({ data }: MessageEvent) => {
      const { id: responseId, result } = data;
      if (responseId === id) {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        resolve(result);
      }
    };

    const handleError = (err: ErrorEvent) => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      reject(err);
    };

    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);

    worker.postMessage({ id, input, version });
  });
};
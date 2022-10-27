import { execa } from "execa";
import { dirname, filename, join } from "desm";
import http from "node:http";
import path from "node:path";
import fse from "fs-extra";
import gifsicle from "gifsicle";

const DIRNAME = dirname(import.meta.url);

function computeGifsicleArgs(opts) {
  if (opts.colors === undefined) {
    opts.colors = 80;
  }

  if (opts.compress === undefined) {
    opts.compress = 80;
  }
  const args = [
    "-O3",
    "--lossy=" + opts.compress,
    "--colors=" + opts.colors,
    "--no-warnings",
  ];

  if (opts.loop === false) {
    args.push("--no-loopcount");
  }

  return args;
}

async function gifCompress(opts) {
  const args = computeGifsicleArgs(opts);
  args.push(opts.inputFile);
  args.push("-o");
  args.push(opts.outputFile);
  await execa(gifsicle, args, {
    nodeOptions: ["--max-old-space-size=1000"],
  });
  return opts.outputFile;
}

const server = http.createServer(async (req, res) => {
  console.log(`开始处理请求`);
  console.time("handle");
  const inputPath = path.resolve(DIRNAME, "./assets/sy.gif");
  const outPath = path.resolve(
    DIRNAME,
    `./tmp/${Math.random().toFixed(5)}.gif`
  );

  fse.ensureFileSync(outPath);

  await gifCompress({
    inputFile: inputPath,
    outputFile: outPath,
  });
  console.timeEnd("handle");
  console.log(`处理完成`);
  return res.end("Ook!");
});
server.listen(9991);

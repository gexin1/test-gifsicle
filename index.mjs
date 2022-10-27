import { execa } from "execa";
import { dirname, filename, join } from "desm";
import http from "node:http";
import path from "node:path";
import fse from "fs-extra";
import { getCompositions, renderMedia } from "@remotion/renderer";

// import gifsicle from "gifsicle";

const DIRNAME = dirname(import.meta.url);



async function renderVideo() {
  // The composition you want to render
  const compositionId = "HelloWorld";

  // You only have to do this once, you can reuse the bundle.
  const entry = "./src/index";

  const bundleLocation = path.resolve(DIRNAME, "./bundle");

  // Extract all the compositions you have defined in your project
  // from the webpack bundle.
  const comps = await getCompositions(bundleLocation, {
    serveUrl: bundleLocation,
  });

  // Select the composition you want to render.
  const composition = comps.find((c) => c.id === compositionId);

  // Ensure the composition exists
  if (!composition) {
    throw new Error(`No composition with the ID ${compositionId} found.
  Review "${entry}" for the correct ID.`);
  }
  const outputLocation = path.resolve(DIRNAME, `out/${Math.random()}.mp4`);

  console.log("Attempting to render:", outputLocation);
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    disallowParallelEncoding: true,
  });
  console.log("Render done!");
}

const server = http.createServer(async (req, res) => {
  console.log(`开始处理请求`);
  console.time("handle");
  await renderVideo();
  console.timeEnd("handle");
  console.log(`处理完成`);
  return res.end("Ook!");
});
server.listen(9991);

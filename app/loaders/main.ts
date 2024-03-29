export interface MainOptions {
  playId: string;
  stdVersion?: string;
}

export default function main(
  { playId, stdVersion }: MainOptions,
  _req: Request,
) {
  const std = `https://denopkg.com/deco-sites/std@${stdVersion ?? "1.20.5"}`;
  const content = `
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="deno.ns" />
/// <reference lib="esnext" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts?playId=${playId}";
import decoManifest from "./manifest.gen.ts?playId=${playId}";
import plugins from "${std}/plugins/mod.ts";
import partytownPlugin from "partytown/mod.ts";
import { context } from "$live/live.ts";
import "${std}/plugins/tailwind/bundler.ts";

context.isDeploy = true;

Deno.readTextFile = (
  path: string | URL,
  options?: Parameters<typeof Deno.readTextFile>[1],
) => {
  const urlString = path.toString();
  if (urlString.endsWith("deno.json")) {
    return Promise.resolve(JSON.stringify({
      "importMap": "./import_map.json",
      "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "preact",
      },
    }));
  }
  if (urlString.startsWith("http")) {
    return fetch(urlString).then(response => response.text());
  }
  const serveFileUrl = new URL(import.meta.url).origin + "/live/invoke/play/loaders/files/serve.ts?props=";
  return fetch(serveFileUrl + (btoa(JSON.stringify({ location: urlString.split("/"), playId: "${playId}" })))).then(response => response.text());
};

await start(manifest, {
  plugins: [
    ...plugins({
      manifest: decoManifest,
      site: { namespace: "${playId}" },
    }),
    partytownPlugin(),
  ],
});
    
  `;
  return new Response(content, {
    status: 200,
    headers: { "content-type": "application/typescript" },
  });
}

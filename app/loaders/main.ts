export interface MainOptions {
  playId: string;
  stdVersion?: string;
}

export default function main(
  { playId, stdVersion }: MainOptions,
  _req: Request,
) {
  const content = `
  /// <reference no-default-lib="true"/>
  /// <reference lib="dom" />
  /// <reference lib="deno.ns" />
  /// <reference lib="esnext" />
  
  import { start } from "$fresh/server.ts";
  import manifest from "./fresh.gen.ts?playId=${playId}";
  import decoManifest from "./manifest.gen.ts?playId=${playId}";
  import plugins from "https://denopkg.com/deco-sites/std@${
    stdVersion ?? "1.20.5"
  }/plugins/mod.ts";
  import partytownPlugin from "partytown/mod.ts";
  
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

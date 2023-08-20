import { badRequest, context, Secret } from "deco/mod.ts";
import { API } from "https://denopkg.com/denoland/deployctl@1.8.0/src/utils/api.ts";
import type { AppContext as AC, App } from "../deps.ts";
import type { Manifest } from "./manifest.gen.ts";
import manifest from "./manifest.gen.ts";

export interface PlayOptions {
  playId: string;
}

export interface File {
  content: string;
  // the last item is the file name
  location: string[];
}

export interface FileSystem {
  get(location: string[]): Promise<File | null>;
  createOrEdit(location: string[], content: string): Promise<File>;
  rm(location: string[]): Promise<void>;
  /**
   * Returns the file tree
   * @param location the location that want to be listed, if omitted all files will be listed
   */
  list(location?: string[]): Promise<File[]>;
}
export interface PlayFS {
  forPlay(playId: string): FileSystem;
}
export interface DenoConfig {
  deployToken: Secret;
}
export interface Props {
  fs: PlayFS;
  deno: DenoConfig;
  playDomain?: string;
}

export interface State extends Props {
  playDomain: string;
  serveFileUrl: (playId: string, location: string[]) => string;
  denoDeployClient: () => Promise<ReturnType<typeof API["fromToken"]>>;
}

const PLAY_DOMAIN = "https://deco.cx/";
export default function App(
  state: Props,
): App<Manifest, State> {
  const playDomain = context.isDeploy ? PLAY_DOMAIN : "http://localhost:8000";
  return {
    manifest,
    state: {
      playDomain,
      denoDeployClient: async () => {
        const token = await state.deno.deployToken.get();
        if (!token) {
          badRequest({ message: "Deno deploy token is missing" });
        }
        return API.fromToken(token!);
      },
      serveFileUrl: (playId: string, location: string[]) =>
        `${playDomain}/live/invoke/play/loaders/files/serve.ts?props=${
          btoa(JSON.stringify({ location, playId }))
        }`,
      ...state,
    },
  };
}

export type AppContext = AC<ReturnType<typeof App>>;

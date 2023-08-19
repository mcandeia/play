import type { App, AppContext as AC } from "../deps.ts";
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

export interface Props {
  fs: PlayFS;
  playDomain?: string;
}

export interface State extends Props {
  playDomain: string;
  serveFileUrl: (playId: string, location: string[]) => string;
}

const PLAY_DOMAIN = "https://deco.cx/";
export default function App(
  state: Props,
): App<Manifest, State> {
  return {
    manifest,
    state: {
      playDomain: PLAY_DOMAIN,
      serveFileUrl: (playId: string, location: string[]) =>
        `${PLAY_DOMAIN}/live/invoke/play/loaders/files/serve.ts?props=${
          btoa(JSON.stringify({ location, playId }))
        }`,
      ...state,
    },
  };
}

export type AppContext = AC<ReturnType<typeof App>>;

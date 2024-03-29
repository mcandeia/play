import { AppContext, PlayOptions } from "../../mod.ts";

export interface Props extends PlayOptions {
  location: string[];
}
export default async function remove(
  { location, playId }: Props,
  _req: Request,
  { fs }: AppContext,
) {
  await fs.forPlay(playId).rm(location);
}

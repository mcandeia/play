import { AppContext, PlayOptions } from "../../mod.ts";

export interface Props extends PlayOptions {
  location: string[];
}
export default async function serveTs(
  { location, playId }: Props,
  _req: Request,
  { fs }: AppContext,
): Promise<Response> {
  const file = await fs.forPlay(playId).get(location);
  if (!file) {
    return new Response(null, { status: 404 });
  }
  return new Response(file.content, {
    status: 200,
    headers: {
      "content-type": "application/typescript",
    },
  });
}

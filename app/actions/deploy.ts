import { AppContext } from "../mod.ts";

export interface Props {
  project: string;
}

export default async function Deploy(
  _: unknown,
  _req: Request,
  _ctx: AppContext,
): Promise<void> {
}

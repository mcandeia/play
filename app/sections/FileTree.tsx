import { IS_BROWSER } from "$fresh/runtime.ts";
import { SectionProps } from "../../deps.ts";
import { PlayContext } from "../functions/context.ts";
import { AppContext } from "../mod.ts";

export default function FileTree({ files }: SectionProps<typeof loader>) {
  if (!IS_BROWSER) {
    return null;
  }
  return (
    <>
      {files.map((file) => {
        return (
          <div>
            <span>{file.location.join("/")}</span>
            <textarea>{file.content}</textarea>
          </div>
        );
      })}
    </>
  );
}

export interface Props {
  context: PlayContext;
}

export const loader = async (props: Props, _req: Request, ctx: AppContext) => {
  return {
    ...props,
    files: props.context.id
      ? await ctx.fs.forPlay(props.context.id).list()
      : [],
  };
};

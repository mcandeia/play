import { IS_BROWSER } from "$fresh/runtime.ts";
import MonacoEditor, {
  MonacoEditorBaseProps,
} from "https://esm.sh/react-monaco-editor@0.40.0";
import { SectionProps } from "../../deps.ts";
import { PlayContext } from "../functions/context.ts";
import { AppContext } from "../mod.ts";

export default function FileTree({
  editor,
  files,
}: SectionProps<typeof loader>) {
  if (!IS_BROWSER) {
    return null;
  }
  return (
    <>
      {files.map((file) => {
        return (
          <div>
            <span>{file.location.join("/")}</span>
            <MonacoEditor
              {...{
                ...editor,
                editorDidMount: (editor) => {
                  editor.setValue(file.content);
                },
              }}
            ></MonacoEditor>
          </div>
        );
      })}
    </>
  );
}

export interface Props {
  context: PlayContext;
  editor: MonacoEditorBaseProps;
}

export const loader = async (props: Props, _req: Request, ctx: AppContext) => {
  return { ...props, files: await ctx.fs.forPlay(props.context.id).list() };
};

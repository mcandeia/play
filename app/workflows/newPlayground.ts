import {
  adjectives,
  animals,
  NumberDictionary,
  uniqueNamesGenerator,
} from "https://esm.sh/unique-names-generator@4.7.1";
import { ManifestOf, WorkflowContext, WorkflowGen } from "../../deps.ts";
import { default as app } from "../mod.ts";

export interface Playground {
  id: string;
}
const numberDictionary = NumberDictionary.generate({ min: 10, max: 99 });

export default function newPlayground(_props: unknown) {
  return function* (
    ctx: WorkflowContext<ManifestOf<ReturnType<typeof app>>>,
  ): WorkflowGen<Playground> {
    const id: string = yield ctx.callLocalActivity(() => {
      return uniqueNamesGenerator({
        dictionaries: [animals, adjectives, numberDictionary],
        length: 3,
      });
    });

    yield ctx.invoke("play/actions/files/createOrEdit.ts", {
      file: {
        location: ["sections", "MySection.tsx"],
        content: `
/**
 * @title {{{myProp}}}
 * /
export interface Props {
    /**
     * @title The property
     * @description This is a property
     * /
    myProp: string;
}

export default function MySection({ myProp }: Props) {
    return <div>{myProp}</div>;
}
`,
      },
      playId: id,
    });

    yield ctx.invoke("play/actions/deploy.ts", {
      playId: id,
    });
    return {
      id,
    };
  };
}

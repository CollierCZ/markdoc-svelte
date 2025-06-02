import { markdocPreprocess } from "../src/main.ts";
import { commonMark, markdocBuiltInTags } from "./constants.ts";
import { describe, it, expect } from "vitest";
import type {Options} from "../src/types.ts";

describe("Markdown parsing", () => {
  const testOptions: Options = {
    validationLevel: "warning"
  };
  
  it("CommonMark Tags", async () => {
    expect(
      await markdocPreprocess(testOptions).markup!({ content: commonMark, filename: "test.md" }),
    ).toMatchSnapshot();
  });

  it("Markdoc Table", async () => {
    expect(
      await markdocPreprocess().markup!({
        content: markdocBuiltInTags,
        filename: "test.md",
      }),
    ).toMatchSnapshot();
  });
});

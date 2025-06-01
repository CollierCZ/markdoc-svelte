import { markdoc } from "../src/main.ts";
import { commonMark, markdocBuiltInTags } from "./constants.ts";
import { describe, it, expect } from "vitest";

describe("Markdown parsing", () => {
  it("CommonMark Tags", async () => {
    expect(
      await markdoc().markup!({ content: commonMark, filename: "test.md" }),
    ).toMatchSnapshot();
  });

  it("Markdoc Table", async () => {
    expect(
      await markdoc().markup!({
        content: markdocBuiltInTags,
        filename: "test.md",
      }),
    ).toMatchSnapshot();
  });
});

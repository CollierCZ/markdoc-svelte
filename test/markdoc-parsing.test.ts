import { markdocPreprocess } from "../src/main.ts";
import { commonMark, basicMarkdoc } from "./constants.ts";
import { describe, it, expect } from "vitest";

describe("Markdown parsing", () => {
  it("properly parses CommonMark", async () => {
    expect(
      await markdocPreprocess().markup!({
        content: commonMark,
        filename: "test.md",
      })
    ).toMatchSnapshot();
  });

  it("properly parses basic Markdoc", async () => {
    expect(
      await markdocPreprocess().markup!({
        content: basicMarkdoc,
        filename: "test.md",
      })
    ).toMatchSnapshot();
  });
});

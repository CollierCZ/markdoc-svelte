import { markdoc } from "../src/main.ts";
import { noFrontmatter, withFrontmatter, noComponents, multipleComponents, withLayoutAndFrontmatter } from "./constants.ts";
import { describe, it, expect } from "vitest";

describe("Frontmatter and Component Generation", () => {
  const testOptions = {
    schema: "./test/markdoc",
    components: "./test/components"
  };

  it("No frontmatter", async () => {
    expect(
      await markdoc(testOptions).markup!({ content: noFrontmatter, filename: "test.md" })
    ).toMatchSnapshot();
  });

  it("With frontmatter", async () => {
    expect(
      await markdoc(testOptions).markup!({ content: withFrontmatter, filename: "test.md" })
    ).toMatchSnapshot();
  });

  it("No components", async () => {
    expect(
      await markdoc(testOptions).markup!({ content: noComponents, filename: "test.md" })
    ).toMatchSnapshot();
  });

  it("Multiple components with props", async () => {
    expect(
      await markdoc(testOptions).markup!({ content: multipleComponents, filename: "test.md" })
    ).toMatchSnapshot();
  });

  it("With layout and frontmatter", async () => {
    const layoutOptions = { ...testOptions, layout: "$lib/SimpleLayout.svelte" };
    expect(
      await markdoc(layoutOptions).markup!({ content: withLayoutAndFrontmatter, filename: "test.md" })
    ).toMatchSnapshot();
  });
}); 
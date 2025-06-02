import { markdocPreprocess } from "../src/main.ts";
import { noFrontmatter, withFrontmatter, noComponents, multipleComponents, withLayoutAndFrontmatter } from "./constants.ts";
import { describe, it, expect } from "vitest";
import type { Options } from "../src/types.ts";
import type { Processed } from "svelte/compiler";

describe("Frontmatter and Component Generation", () => {
  const testOptions: Options = {
    schema: "./test/markdoc",
    components: "./test/components",
    validationLevel: "warning"
  };

  it("No frontmatter", async () => {
    const result = await markdocPreprocess(testOptions).markup!({ content: noFrontmatter, filename: "test.md" }) as Processed;
    expect(result.code).toMatchSnapshot();
  });

  it("With frontmatter", async () => {
    const result = await markdocPreprocess(testOptions).markup!({ content: withFrontmatter, filename: "test.md" }) as Processed;
    expect(result.code).toMatchSnapshot();
  });

  it("No components", async () => {
    const result = await markdocPreprocess(testOptions).markup!({ content: noComponents, filename: "test.md" }) as Processed;
    expect(result.code).toMatchSnapshot();
  });

  it("Multiple components with props", async () => {
    const result = await markdocPreprocess(testOptions).markup!({ content: multipleComponents, filename: "test.md" }) as Processed;
    expect(result.code).toMatchSnapshot();
  });

  it("With layout and frontmatter", async () => {
    const layoutOptions = { ...testOptions, layout: "$lib/SimpleLayout.svelte" };
    const result = await markdocPreprocess(layoutOptions).markup!({ content: withLayoutAndFrontmatter, filename: "test.md" }) as Processed;
    expect(result.code).toMatchSnapshot();
  });
}); 
import { markdocPreprocess } from "../src/main.ts";
import { markdocWithFrontmatter, multipleComponents } from "./constants.ts";
import { describe, it, expect } from "vitest";
import type { Options } from "../src/types.ts";
import type { Processed } from "svelte/compiler";
import tags from "./markdoc/shared-schema/tags/index.ts";

describe("Frontmatter", () => {
  it("properly parses files with frontmatter", async () => {
    const result = (await markdocPreprocess().markup!({
      content: markdocWithFrontmatter,
      filename: "test.md",
    })) as Processed;
    expect(result.code).toMatchSnapshot();
  });
});

describe("Components", () => {
  it("properly parses multiple components with props", async () => {
    const result = (await markdocPreprocess({
      components: "./test/components",
      tags: { ...tags },
    } as Options).markup!({
      content: multipleComponents,
      filename: "test.md",
    })) as Processed;
    expect(result.code).toMatchSnapshot();
  });
});

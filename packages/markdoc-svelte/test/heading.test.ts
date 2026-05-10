import { markdocPreprocess } from "../src/main.ts";
import { describe, it, expect } from "vitest";

import type { Options } from "../src/types.ts";
import type { Processed } from "svelte/compiler";

import { markdocWithHeadings } from "./constants.ts";
import basicHeadingNode from "./markdoc/heading-tests/basicHeading.ts";
import customComponentNode from "./markdoc/heading-tests/customComponentHeading.ts";

const customSlugger = (str: string): string => str.replaceAll(/[^a-z]/gi, "-");

const headingMarkdocWithExplicitID = `
# This is some Markdoc {% #overview %}

Some text

## Second heading {% #two %}

And more
`

describe("Headings", () => {
  it("handles explicitly set heading IDs", async () => {
    const result = (await markdocPreprocess({
      headingIds: true,
    } as Options).markup!({
      content: headingMarkdocWithExplicitID,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });


  it("adds IDs and exports headings even when a custom heading is included", async () => {
    const result = (await markdocPreprocess({
      headingIds: true,
      nodes: { heading: basicHeadingNode },
    } as Options).markup!({
      content: markdocWithHeadings,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });

  it("adds IDs and exports headings even when the custom heading is a custom component", async () => {
    const result = (await markdocPreprocess({
      headingIds: true,
      nodes: { heading: customComponentNode },
    } as Options).markup!({
      content: markdocWithHeadings,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });

  it("adds IDs when passed a custom slugifying function", async () => {
    const result = (await markdocPreprocess({
      headingIds: customSlugger,
    } as Options).markup!({
      content: markdocWithHeadings,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });

  it("adds IDs when passed a custom slugifying function even for custom headings", async () => {
    const result = (await markdocPreprocess({
      headingIds: customSlugger,
      nodes: { heading: basicHeadingNode },
    } as Options).markup!({
      content: markdocWithHeadings,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });
});

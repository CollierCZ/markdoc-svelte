import { markdocPreprocess } from "../src/main.ts";
import { describe, it, expect } from "vitest";

import type { Options } from "../src/types.ts";
import type { Processed } from "svelte/compiler";

import { basicMarkdoc } from "./constants.ts";
import basicHeadingNode from "./markdoc/heading-tests/basicHeading.ts";
import customComponentNode from "./markdoc/heading-tests/customComponentHeading.ts";

describe("Headings", () => {
  it("adds IDs and exports headings even when a custom heading is included", async () => {
    const result = (await markdocPreprocess({
      headingIds: true,
      nodes: { heading: basicHeadingNode.heading },
    } as Options).markup!({
      content: basicMarkdoc,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });

  it("adds IDs and exports headings even when the custom heading is a custom component", async () => {
    const result = (await markdocPreprocess({
      headingIds: true,
      nodes: { heading: customComponentNode.heading },
    } as Options).markup!({
      content: basicMarkdoc,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });
});

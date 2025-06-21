import { markdocPreprocess } from "../src/main.ts";
import { describe, it, expect } from "vitest";

import type { Options } from "../src/types.ts";
import type { Processed } from "svelte/compiler";

import {
  basicMarkdoc,
  markdocWithComments,
  markdocWithSchemaTest,
} from "./constants.ts";
import functions from "./markdoc/shared-schema/functions.ts";
import nodes from "./markdoc/shared-schema/nodes.ts";
import tags from "./markdoc/shared-schema/tags/index.ts";
import variables from "./markdoc/shared-schema/variables.ts";

describe("Schema Configuration Combinations", () => {
  const testSchemasDir = "./test/markdoc";

  describe("Loading from a directory", () => {
    it("loads schemas from individual files (tags.ts, nodes.ts, functions.ts, variables.ts)", async () => {
      const result = (await markdocPreprocess({
        schema: `${testSchemasDir}/individual-files`,
      } as Options).markup!({
        content: markdocWithSchemaTest,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("loads schemas from index files in directories (tags/index.ts, nodes/index.ts)", async () => {
      const result = (await markdocPreprocess({
        schema: `${testSchemasDir}/index-directories`,
      } as Options).markup!({
        content: markdocWithSchemaTest,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("loads schemas from mixed patterns (some individual files, some index directories)", async () => {
      const result = (await markdocPreprocess({
        schema: `${testSchemasDir}/mixed-patterns`,
      } as Options).markup!({
        content: markdocWithSchemaTest,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("Loading from options", () => {
    it("loads schema correctly when passed as an option (no schema directory)", async () => {
      const result = (await markdocPreprocess({
        functions: { testFunction: functions.testFunction },
        nodes: { heading: nodes.heading },
        tags: { testTag: tags.testTag },
        variables: { testVariable: variables.testVariable },
      } as Options).markup!({
        content: markdocWithSchemaTest,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("processes partials when passed as option", async () => {
      const content = `# Test Document
      
      {% partial file="content.md" /%}
      `;

      const result = (await markdocPreprocess({
        partials: `${testSchemasDir}/shared-schema/partials`,
      } as Options).markup!({
        content,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("Combining sources", () => {
    it("accepts directory and options with options overriding the directory", async () => {
      const result = (await markdocPreprocess({
        schema: `${testSchemasDir}/individual-files`,
        tags: {
          testTag: {
            render: "OverrideTag",
            attributes: {},
            children: ["text"],
          },
        },
      } as Options).markup!({
        content: markdocWithSchemaTest,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("File variations", () => {
    it("prefers .ts files over .js files", async () => {
      const content = `# Test
        {% preferenceTag %}content{% /preferenceTag %}
      `;

      const result = (await markdocPreprocess({
        schema: `${testSchemasDir}/file-preference`,
      } as Options).markup!({
        content,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("prefers individual files over index directories", async () => {
      const content = `# Test
        {% priorityTag %}content{% /priorityTag %}
      `;

      const result = (await markdocPreprocess({
        schema: `${testSchemasDir}/file-vs-directory`,
      } as Options).markup!({
        content,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("Edge cases", () => {
    it("handles schema files with no default export", async () => {
      const result = (await markdocPreprocess({
        schema: `${testSchemasDir}/no-default-export`,
      } as Options).markup!({
        content: basicMarkdoc,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("handles missing schema directory gracefully", async () => {
      const result = (await markdocPreprocess({
        schema: `${testSchemasDir}/non-existent`,
      } as Options).markup!({
        content: basicMarkdoc,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("handles empty schema parts gracefully", async () => {
      const result = (await markdocPreprocess({
        schema: `${testSchemasDir}/empty-schemas`,
      } as Options).markup!({
        content: basicMarkdoc,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("Comments Handling", () => {
    it("hides comments by default", async () => {
      const result = (await markdocPreprocess().markup!({
        content: markdocWithComments,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("hides comments when passed as an option", async () => {
      const result = (await markdocPreprocess({
        comments: true,
      } as Options).markup!({
        content: markdocWithComments,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("doesn't hide comments when passed false", async () => {
      const result = (await markdocPreprocess({
        comments: false,
      } as Options).markup!({
        content: markdocWithComments,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("File Extensions", () => {
    it("works with no extension passed", async () => {
      const result = (await markdocPreprocess().markup!({
        content: basicMarkdoc,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("ignores files that don't match the default extensions", async () => {
      const result = await markdocPreprocess().markup!({
        content: basicMarkdoc,
        filename: "test.markdoc",
      });

      expect(result).toBeUndefined();
    });

    it("works when passed the default extension", async () => {
      const result = (await markdocPreprocess({
        extensions: [".md"],
      } as Options).markup!({
        content: basicMarkdoc,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("works when passed a single extension other than the default", async () => {
      const result = (await markdocPreprocess({
        extensions: [".markdoc"],
      } as Options).markup!({
        content: basicMarkdoc,
        filename: "test.markdoc",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("ignores files that don't match a single passed extension", async () => {
      const result = await markdocPreprocess({
        extensions: [".markdoc"],
      } as Options).markup!({
        content: basicMarkdoc,
        filename: "test.md",
      });

      expect(result).toBeUndefined();
    });

    it("works when passed multiple extensions", async () => {
      const result = (await markdocPreprocess({
        extensions: [".markdoc", ".md"],
      } as Options).markup!({
        content: basicMarkdoc,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("ignores files that don't match multiple passed extensions", async () => {
      const result = await markdocPreprocess({
        extensions: [".markdoc", ".md"],
      } as Options).markup!({
        content: basicMarkdoc,
        filename: "test.mdoc",
      });

      expect(result).toBeUndefined();
    });
  });

  describe("Typographer", () => {
    const replacableMarkdoc = `
## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'
`;

    it("leaves typographic elements alone as a default", async () => {
      const result = (await markdocPreprocess().markup!({
        content: replacableMarkdoc,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("properly replaces typographic elements when passed as an option", async () => {
      const result = (await markdocPreprocess({
        typographer: true,
      } as Options).markup!({
        content: replacableMarkdoc,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("leaves typographic elements alone when passed false", async () => {
      const result = (await markdocPreprocess({
        typographer: false,
      } as Options).markup!({
        content: replacableMarkdoc,
        filename: "test.md",
      })) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });
});

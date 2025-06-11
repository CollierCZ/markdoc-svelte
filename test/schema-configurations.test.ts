import { markdocPreprocess } from "../src/main.ts";
import { describe, it, expect } from "vitest";
import { directTags, directFunctions, directVariables, directNodes } from "./schema-options.ts";
import type { Options } from "../src/types.ts";
import type { Processed } from "svelte/compiler";
import { basicMarkdoc, markdocWithComments } from "./constants.ts";

describe("Schema Configuration Combinations", () => {
  const testSchemasDir = "./test/markdoc";

  describe("Schema Directory Loading Patterns", () => {
    it("loads schemas from individual files (tags.ts, nodes.ts, functions.ts, variables.ts)", async () => {
      const content = `# Test heading
        {% testTag %}Tag content{% /testTag %}
        Function value: {% testFunction($testVar) %}
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/individual-files`,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("loads schemas from index files in directories (tags/index.ts, nodes/index.ts)", async () => {
      const content = `# Test
        {% indexTag %}content{% /indexTag %}
        [link text](http://example.com)
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/index-directories`,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("loads schemas from mixed patterns (some individual files, some index directories)", async () => {
      const content = `# Test
        {% mixedTag %}content{% /mixedTag %}
        Function: {% mixedFunction($mixedVar) %}
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/mixed-patterns`,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("handles missing schema directory gracefully", async () => {
      const content = `# Test Content`;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/non-existent`,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("Configuration Source Combinations", () => {
    it("loads configuration from schema directory only", async () => {
      const content = `# Test
        {% testTag %}content{% /testTag %}
        Function: {% testFunction($testVar) %}
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/individual-files`,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("uses direct options only (no schema directory)", async () => {
      const content = `# Test\n{% directTag %}content{% /directTag %}`;
      
      const result = await markdocPreprocess({ 
        tags: { directTag: directTags.directTag },
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("merges schema directory and direct options (direct options override)", async () => {
      const content = `# Test
        {% testTag %}content{% /testTag %}
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/individual-files`,
        tags: { testTag: directTags.overrideTag },
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("handles conflicting schema types (direct functions override schema functions)", async () => {
      const content = `# Test
        Function: {% testFunction($testVar) %}
      `;

      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/individual-files`,
        functions: { testFunction: directFunctions.overrideFunction },
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("merges different schema types from multiple sources", async () => {
      const content = `# Test
        {% testTag %}content{% /testTag %}
        {% additionalTag %}content{% /additionalTag %}
        Function: {% testFunction($additionalVar) %}
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/individual-files`,
        tags: { additionalTag: directTags.additionalTag },
        variables: directVariables,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("Schema Types Coverage", () => {
    it("processes all schema types together (nodes, tags, functions, variables)", async () => {
      const content = `# Custom Heading
        {% testTag %}content{% /testTag %}
        Function: {% testFunction($testVar) %}
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/individual-files`,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("handles empty schema parts gracefully", async () => {
      const content = `# Test\nRegular content`;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/empty-schemas`,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("File Structure Variations", () => {
    it("prefers .ts files over .js files", async () => {
      const content = `# Test
        {% preferenceTag %}content{% /preferenceTag %}
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/file-preference`,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("prefers individual files over index directories", async () => {
      const content = `# Test
        {% priorityTag %}content{% /priorityTag %}
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/file-vs-directory`,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("Edge Cases", () => {
    it("handles schema files with no default export", async () => {
      const content = `# Test
        Regular content
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/no-default-export`,
        validationLevel: "warning"
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("Comments Handling", () => {
    it("hides comments by default", async () => {
      const result = await markdocPreprocess({ 
        validationLevel: "warning"
      } as Options).markup!({ 
        content: markdocWithComments, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("hides comments when passed as an option", async () => {
      const result = await markdocPreprocess({ 
        comments: true,
        validationLevel: "warning"
      } as Options).markup!({ 
        content: markdocWithComments, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("doesn't hide comments when passed false", async () => {
      const result = await markdocPreprocess({ 
        comments: false,
        validationLevel: "warning"
      } as Options).markup!({ 
        content: markdocWithComments, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("File Extensions", () => {
    it("works with no extension passed", async () => {
      const result = await markdocPreprocess({ 
        validationLevel: "warning"
      } as Options).markup!({ 
        content: basicMarkdoc, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("ignores files that don't match the default extensions", async () => {
      const result = await markdocPreprocess({ 
        validationLevel: "warning"
      } as Options).markup!({ 
        content: basicMarkdoc, 
        filename: "test.markdoc" 
      });

      expect(result).toBeUndefined();
    });

    it("works when passed the default extension", async () => {
      const result = await markdocPreprocess({ 
        extensions: [".md"],
        validationLevel: "warning"
      } as Options).markup!({ 
        content: basicMarkdoc, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("works when passed a single extension other than the default", async () => {
      const result = await markdocPreprocess({ 
        extensions: [".markdoc"],
        validationLevel: "warning"
      } as Options).markup!({ 
        content: basicMarkdoc, 
        filename: "test.markdoc" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("ignores files that don't match a single passed extension", async () => {
      const result = await markdocPreprocess({ 
        extensions: [".markdoc"],
        validationLevel: "warning"
      } as Options).markup!({ 
        content: basicMarkdoc, 
        filename: "test.md" 
      });

      expect(result).toBeUndefined();
    });

    it("works when passed multiple extensions", async () => {
      const result = await markdocPreprocess({ 
        extensions: [".markdoc", ".md"],
        validationLevel: "warning"
      } as Options).markup!({ 
        content: basicMarkdoc, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("ignores files that don't match multiple passed extensions", async () => {
      const result = await markdocPreprocess({ 
        extensions: [".markdoc", ".md"],
        validationLevel: "warning"
      } as Options).markup!({ 
        content: basicMarkdoc, 
        filename: "test.mdoc" 
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
      const result = await markdocPreprocess({ 
        validationLevel: "warning"
      } as Options).markup!({ 
        content: replacableMarkdoc, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("properly replaces typographic elements when passed as an option", async () => {
      const result = await markdocPreprocess({ 
        typographer: true,
        validationLevel: "warning"
      } as Options).markup!({ 
        content: replacableMarkdoc, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });

    it("leaves typographic elements alone when passed false", async () => {
      const result = await markdocPreprocess({ 
        typographer: false,
        validationLevel: "warning"
      } as Options).markup!({ 
        content: replacableMarkdoc, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("Combined Features", () => {
    it("processes partials, variables, and functions together", async () => {
      const content = `# Test Document
        {% testTag %}
          {% partial file="header.md" /%}
          Variable value: {% $testVar %}
          Function result: {% testFunction($testVar) %}
        {% /testTag %}
      `;
      
      const result = await markdocPreprocess({ 
        schema: `${testSchemasDir}/individual-files`,
        validationLevel: "warning",
        partials: `${testSchemasDir}/individual-files/partials`
      } as Options).markup!({ 
        content, 
        filename: "test.md" 
      }) as Processed;

      expect(result.code).toMatchSnapshot();
    });
  });

}); 
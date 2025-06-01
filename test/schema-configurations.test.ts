import { markdoc } from "../src/main.ts";
import { describe, it, expect } from "vitest";
import { directTags, directFunctions, directVariables, directNodes } from "./schema-options.ts";

describe("Schema Configuration Combinations", () => {
  const testSchemasDir = "./test/markdoc";

  describe("Schema Directory Loading Patterns", () => {
    it("loads schemas from individual files (tags.ts, nodes.ts, functions.ts, variables.ts)", async () => {
      const content = `# Test\n{% testTag %}{% /testTag %}\n{% testFunction($testVar) %}`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/individual-files` 
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });

    it("loads schemas from index files in directories (tags/index.ts, nodes/index.ts)", async () => {
      const content = `# Test\n{% indexTag %}content{% /indexTag %}\n[link text](http://example.com)`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/index-directories` 
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });

    it("loads schemas from mixed patterns (some individual files, some index directories)", async () => {
      const content = `# Test\n{% mixedTag %}content{% /mixedTag %}\n{% mixedFunction($mixedVar) %}`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/mixed-patterns` 
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });

    it("handles missing schema directory gracefully", async () => {
      const content = `# Test Content`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/non-existent` 
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe("Configuration Source Combinations", () => {
    it("loads configuration from schema directory only", async () => {
      const content = `# Test\n{% testTag %}content{% /testTag %}`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/individual-files` 
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });

    it("uses direct options only (no schema directory)", async () => {
      const content = `# Test\n{% directTag %}content{% /directTag %}`;
      
      const result = await markdoc({ 
        tags: { directTag: directTags.directTag }
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });

    it("merges schema directory and direct options (direct options override)", async () => {
      const content = `# Test\n{% testTag %}content{% /testTag %}`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/individual-files`,
        tags: { testTag: directTags.overrideTag }
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });

    it("handles conflicting schema types (direct functions override schema functions)", async () => {
      const content = `# Test\n{% testFunction($testVar) %}`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/individual-files`,
        functions: { testFunction: directFunctions.overrideFunction }
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });

    it("merges different schema types from multiple sources", async () => {
      const content = `# Test\n{% testTag %}content{% /testTag %}\n{% additionalTag %}content{% /additionalTag %}\n{% testFunction($additionalVar) %}`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/individual-files`,
        tags: { additionalTag: directTags.additionalTag },
        variables: directVariables
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe("Schema Types Coverage", () => {
    it("processes all schema types together (nodes, tags, functions, variables)", async () => {
      const content = `# Custom Heading\n{% testTag %}content{% /testTag %}\n{% testFunction($testVar) %}`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/individual-files` 
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });

    it("handles empty schema parts gracefully", async () => {
      const content = `# Test\nRegular content`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/empty-schemas` 
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe("File Structure Variations", () => {
    it("prefers .ts files over .js files", async () => {
      const content = `# Test\n{% preferenceTag %}content{% /preferenceTag %}`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/file-preference` 
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });

    it("prefers individual files over index directories", async () => {
      const content = `# Test\n{% priorityTag %}content{% /priorityTag %}`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/file-vs-directory` 
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe("Edge Cases", () => {
    it("handles schema files with no default export", async () => {
      const content = `# Test\nRegular content`;
      
      const result = await markdoc({ 
        schema: `${testSchemasDir}/no-default-export` 
      }).markup!({ 
        content, 
        filename: "test.md" 
      });

      expect(result).toMatchSnapshot();
    });
  });

}); 
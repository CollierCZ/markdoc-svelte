import { markdocPreprocess } from "../src/main.ts";
import { describe, it, expect } from "vitest";
import type { Options } from "../src/types.ts";
import { invalidMarkdoc } from "./constants.ts";

describe("Validation", () => {
  describe("Validation Levels", () => {
    it("throws an error when validation level is error and there are validation errors", async () => {
      await expect(markdocPreprocess({ 
        validationLevel: "error"
      } as Options).markup!({ 
        content: invalidMarkdoc, 
        filename: "test.md" 
      })).rejects.toThrow("Markdoc validation failed in test.md");
    });
  });

  describe("Validation Messages", () => {
    it("includes validation messages in the output when validation level is warning", async () => {
      try {
        await markdocPreprocess({ 
          validationLevel: "warning"
        } as Options).markup!({ 
          content: invalidMarkdoc, 
          filename: "test.md" 
        });
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("Markdoc validation failed");
        expect((error as Error).message).toContain("ERROR (text): Undefined variable");
      }
    });

    it("doesn't include validation messages when validation level is debug", async () => {
      try {
        await markdocPreprocess({ 
          validationLevel: "debug"
        } as Options).markup!({ 
          content: invalidMarkdoc, 
          filename: "test.md" 
        });
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("Markdoc validation failed");
        expect((error as Error).message).toContain("ERROR (text): Undefined variable");
      }
    });
  });
}); 
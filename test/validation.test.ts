import { markdocPreprocess } from "../src/main.ts";
import { describe, it, expect } from "vitest";
import type { Options } from "../src/types.ts";
import { invalidMarkdoc } from "./constants.ts";

const fileName = "test.md";

const invalidMarkdocToProcess = {
  content: invalidMarkdoc,
  filename: fileName,
};

describe("Validation", () => {
  describe("Validation Levels", () => {
    it("throws an error when there are validation errors at the set validatition level", async () => {
      await expect(
        markdocPreprocess({
          validationLevel: "error",
        } as Options).markup!(invalidMarkdocToProcess)
      ).rejects.toThrow(`Markdoc validation failed in ${fileName}`);
    });

    it("does not throw an error when there are no validation errors at the set validatition level but are at lower levels", async () => {
      expect(
        async () =>
          await markdocPreprocess({
            validationLevel: "critical",
          } as Options).markup!(invalidMarkdocToProcess)
      ).not.toThrowError();
    });
  });

  describe("Validation Messages", () => {
    it("includes validation messages in the output when validation level is warning", async () => {
      try {
        await markdocPreprocess({
          validationLevel: "warning",
        } as Options).markup!(invalidMarkdocToProcess);
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("Markdoc validation failed");
        expect((error as Error).message).toContain(
          "ERROR (text): Undefined variable"
        );
      }
    });

    it("doesn't include validation messages when validation level is debug", async () => {
      try {
        await markdocPreprocess({
          validationLevel: "debug",
        } as Options).markup!(invalidMarkdocToProcess);
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("Markdoc validation failed");
        expect((error as Error).message).toContain(
          "ERROR (text): Undefined variable"
        );
      }
    });
  });
});

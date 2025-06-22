import { markdocPreprocess } from "../src/main.ts";
import { describe, it, expect } from "vitest";

import type { Options } from "../src/types.ts";
import type { Processed } from "svelte/compiler";

import {
  basicMarkdoc,
  invalidMarkdoc,
  markdocWithComments,
  markdocWithTypography,
} from "./constants.ts";

describe("Comments", () => {
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

describe("File extensions", () => {
  it("processes default file extensions when nothing passed", async () => {
    const result = (await markdocPreprocess().markup!({
      content: basicMarkdoc,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });

  it("ignores files that don't match the default extensions if no option passed", async () => {
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
      filename: "test.markdoc",
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

describe("Layout", () => {
  it("properly puts the parsed file in a layout when passed as an option", async () => {
    const layoutOptions = {
      layout: "$lib/SimpleLayout.svelte",
    };
    const result = (await markdocPreprocess(layoutOptions).markup!({
      content: basicMarkdoc,
      filename: "test.md",
    })) as Processed;
    expect(result.code).toMatchSnapshot();
  });
});

describe("Typographer", () => {
  it("leaves typographic elements alone as a default", async () => {
    const result = (await markdocPreprocess().markup!({
      content: markdocWithTypography,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });

  it("properly replaces typographic elements when passed as an option", async () => {
    const result = (await markdocPreprocess({
      typographer: true,
    } as Options).markup!({
      content: markdocWithTypography,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });

  it("leaves typographic elements alone when passed false", async () => {
    const result = (await markdocPreprocess({
      typographer: false,
    } as Options).markup!({
      content: markdocWithTypography,
      filename: "test.md",
    })) as Processed;

    expect(result.code).toMatchSnapshot();
  });
});

describe("Validation", () => {
  const fileName = "test.md";

  const invalidMarkdocToProcess = {
    content: invalidMarkdoc,
    filename: fileName,
  };
  describe("Validation levels", () => {
    it("throws an error when there are validation errors at the set validatition level", async () => {
      await expect(
        markdocPreprocess({
          validationLevel: "error",
        } as Options).markup!(invalidMarkdocToProcess),
      ).rejects.toThrow(`Markdoc validation failed in ${fileName}`);
    });

    it("does not throw an error when there are no validation errors at the set validatition level but are at lower levels", async () => {
      expect(
        async () =>
          await markdocPreprocess({
            validationLevel: "critical",
          } as Options).markup!(invalidMarkdocToProcess),
      ).not.toThrowError();
    });
  });

  describe("Validation messages", () => {
    it("includes the proper validation message in the output", async () => {
      try {
        await markdocPreprocess({
          validationLevel: "error",
        } as Options).markup!(invalidMarkdocToProcess);
        expect.fail("Should have thrown an error for invalid Markdoc");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("Markdoc validation failed");
        expect((error as Error).message).toContain(
          "ERROR (text): Undefined variable",
        );
      }
    });
  });
});

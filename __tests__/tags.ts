import { markdoc } from "../src/main";
import { markdocWithComponent } from "../utils/test-constants";
import { button } from "../utils/schemas/schema/tags/Button";

test(`processes tags passed with schema path`, async () => {
  expect(
    await markdoc({ schema: "./utils/schemas/schemaWithTags" }).markup({
      content: markdocWithComponent,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`processes tags passed directly`, async () => {
  expect(
    await markdoc({
      tags: {
        button,
      },
    }).markup({
      content: markdocWithComponent,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

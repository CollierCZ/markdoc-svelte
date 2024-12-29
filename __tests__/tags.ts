import { markdoc } from "../src/main";
import { markdocWithComponent } from "../utils/test-constants";

test(`processes tags`, async () => {
  expect(
    await markdoc({ schema: "./utils/schemaWithTags" }).markup({
      content: markdocWithComponent,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

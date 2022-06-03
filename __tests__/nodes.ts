import { markdoc } from "../src/main";
import { basicMarkdoc } from "../utils/test-constants";

test(`processes tags`, async () => {
  expect(
    await markdoc({ schema: "./utils/schemaWithNodes" }).markup({
      content: basicMarkdoc,
      filename: "test.md",
    })
  ).toMatchSnapshot();
});

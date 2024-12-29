import { markdoc } from "../src/main";
import { basicMarkdoc } from "../utils/test-constants";
import nodes from "../utils/schemaWithNodes/nodes";

test(`processes nodes passed with schema path`, async () => {
  expect(
    await markdoc({ schema: "./utils/schemaWithNodes" }).markup({
      content: basicMarkdoc,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`processes nodes passed directly`, async () => {
  expect(
    await markdoc({ nodes: nodes }).markup({
      content: basicMarkdoc,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

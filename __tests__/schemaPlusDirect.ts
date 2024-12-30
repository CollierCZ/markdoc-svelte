import { markdoc } from "../src/main";
import { markdocWithComponent } from "../utils/test-constants";
import nodes from "../utils/schemas/schemaWithNodes/nodes";
import { button } from "../utils/schemas/schema/tags/Button";

test(`processes correctly when nodes passed directly and tags with schema path`, async () => {
  expect(
    await markdoc({
      nodes: nodes,
      schema: "./utils/schemas/schemaWithTags",
    }).markup({
      content: markdocWithComponent,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`processes correctly when tags passed directly and nodes with schema path`, async () => {
  expect(
    await markdoc({
      tags: {
        button,
      },
      schema: "./utils/schemas/schemaWithNodes",
    }).markup({
      content: markdocWithComponent,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

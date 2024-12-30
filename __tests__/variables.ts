import { markdoc } from "../src/main";
import { markdocWithVariable } from "../utils/test-constants";

test(`processes variables passed with schema path`, async () => {
  expect(
    await markdoc({ schema: "./utils/schemas/schemaWithVariables" }).markup({
      content: markdocWithVariable,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`processes variables passed directly`, async () => {
  expect(
    await markdoc({
      variables: { product: { name: "Best App" } },
    }).markup({
      content: markdocWithVariable,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

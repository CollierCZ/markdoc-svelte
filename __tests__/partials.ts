import { markdoc } from "../src/main";
import {
  markdocWithPartial,
  markdocWithPartialAndVariable,
} from "../utils/test-constants";

test(`processes partials passed with schema path`, async () => {
  expect(
    await markdoc({ schema: "./utils/schemas/schemaWithPartials" }).markup({
      content: markdocWithPartial,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`processes partials passed directly`, async () => {
  expect(
    await markdoc({
      partials: "./utils/schemas/schemaWithPartials/partials",
    }).markup({
      content: markdocWithPartial,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`processes partials passed with local variable`, async () => {
  expect(
    await markdoc({
      partials: "./utils/schemas/schemaWithPartials/partials",
    }).markup({
      content: markdocWithPartialAndVariable,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`processes partials passed with global variable`, async () => {
  expect(
    await markdoc({
      partials: "./utils/schemas/schemaWithPartials/partials",
      variables: { product: { name: "Best App" } },
    }).markup({
      content: markdocWithPartial,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

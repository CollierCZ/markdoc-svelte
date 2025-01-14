import { markdoc } from "../src/main";
import { basicMarkdoc } from "../utils/test-constants";

test(`works with no extension passed`, async () => {
  expect(
    await markdoc().markup({ content: basicMarkdoc, filename: "test.md" }),
  ).toMatchSnapshot();
});

test(`ignores files that don't match the default extensions`, async () => {
  expect(
    await markdoc().markup({ content: basicMarkdoc, filename: "test.markdoc" }),
  ).toMatchSnapshot();
});

test(`works when passed the default extension`, async () => {
  expect(
    await markdoc({ extensions: [".md"] }).markup({
      content: basicMarkdoc,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`works when passed a single extension other than the default`, async () => {
  expect(
    await markdoc({ extensions: [".markdoc"] }).markup({
      content: basicMarkdoc,
      filename: "test.markdoc",
    }),
  ).toMatchSnapshot();
});

test(`ignores files that don't match a single passed extension`, async () => {
  expect(
    await markdoc({ extensions: [".markdoc"] }).markup({
      content: basicMarkdoc,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`works when passed multiple extensions`, async () => {
  expect(
    await markdoc({ extensions: [".markdoc", ".md"] }).markup({
      content: basicMarkdoc,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`ignores files that don't match multiple passed extensions`, async () => {
  expect(
    await markdoc({ extensions: [".markdoc", ".md"] }).markup({
      content: basicMarkdoc,
      filename: "test.mdoc",
    }),
  ).toMatchSnapshot();
});

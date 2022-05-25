import { markdoc } from "../src/main";
import { basicMarkdoc } from "../utils/test-constants";

test(`works with no extension passed`, () => {
  expect(markdoc().markup( { content: basicMarkdoc, filename: "test.md" })).toMatchSnapshot();
});

test(`ignores files that don't match the default extensions`, () => {
  expect(markdoc().markup( { content: basicMarkdoc, filename: "test.markdoc" })).toMatchSnapshot();
});

test(`works when passed the default extension`, () => {
  expect(markdoc({extensions: [".md"]}).markup( { content: basicMarkdoc, filename: "test.md" })).toMatchSnapshot();
});

test(`works when passed a single extension other than the default`, () => {
  expect(markdoc({extensions: [".markdoc"]}).markup( { content: basicMarkdoc, filename: "test.markdoc" })).toMatchSnapshot();
});

test(`ignores files that don't match a single passed extension`, () => {
  expect(markdoc({extensions: [".markdoc"]}).markup( { content: basicMarkdoc, filename: "test.md" })).toMatchSnapshot();
});

test(`works when passed multiple extensions`, () => {
  expect(markdoc({extensions: [".markdoc",".md"]}).markup( { content: basicMarkdoc, filename: "test.md" })).toMatchSnapshot();
});

test(`ignores files that don't match multiple passed extension`, () => {
  expect(markdoc({extensions: [".markdoc", ".md"]}).markup( { content: basicMarkdoc, filename: "test.ts" })).toMatchSnapshot();
});

import { markdoc } from "../src/main";

const markdocWithComments = `
## A heading

<!-- A comment about the text -->

Actual text here.
`;

const replacableMarkdocObject = {
  content: markdocWithComments,
  filename: "test.md",
};

test(`hides comments by default`, async () => {
  expect(await markdoc().markup(replacableMarkdocObject)).toMatchSnapshot();
});

test(`hides comments when passed as an option`, async () => {
  expect(
    await markdoc({ comments: true }).markup(replacableMarkdocObject)
  ).toMatchSnapshot();
});

test(`doesn't hide comments when passed false`, async () => {
  expect(
    await markdoc({ comments: false }).markup(replacableMarkdocObject)
  ).toMatchSnapshot();
});

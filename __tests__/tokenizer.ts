import { markdoc } from "../src/main";

const replacableMarkdoc = `
## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'
`;

const replacableMarkdocObject = {
  content: replacableMarkdoc,
  filename: "test.md",
};

test(`leaves typographic elements alone as a default`, async () => {
  expect(await markdoc().markup(replacableMarkdocObject)).toMatchSnapshot();
});

test(`properly replaces typographic elements when passed as an option`, async () => {
  expect(
    await markdoc({ typographer: true }).markup(replacableMarkdocObject)
  ).toMatchSnapshot();
});

test(`leaves typographic elements alone when passed false`, async () => {
  expect(
    await markdoc({ typographer: false }).markup(replacableMarkdocObject)
  ).toMatchSnapshot();
});

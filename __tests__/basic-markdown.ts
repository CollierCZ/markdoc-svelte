import { markdoc } from "../src/main";
import { basicMarkdoc, markdocWithFrontmatter } from "../utils/test-constants";

const layoutObject = { layout: "/path/to/layout.svelte" };

const basicMarkdocObject = { content: basicMarkdoc, filename: "test.md" };
const basicMarkdocWithFrontmatterObject = {
  content: markdocWithFrontmatter,
  filename: "test.md",
};

test(`parses basic Markdoc properly`, () => {
  expect(markdoc().markup(basicMarkdocObject)).toMatchSnapshot();
});

test(`parses basic Markdoc properly with a layout`, () => {
  expect(markdoc(layoutObject).markup(basicMarkdocObject)).toMatchSnapshot();
});

test(`parses basic Markdoc with frontmatter properly`, () => {
  expect(
    markdoc().markup(basicMarkdocWithFrontmatterObject)
  ).toMatchSnapshot();
});

test(`parses basic Markdoc with frontmatter properly with a layout`, () => {
  expect(
    markdoc(layoutObject).markup(basicMarkdocWithFrontmatterObject)
  ).toMatchSnapshot();
});

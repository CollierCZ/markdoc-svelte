import { markdoc } from "../src/main";
import { basicMarkdoc, invalidMarkdoc } from "../utils/test-constants";

test(`emits error with invalid markdoc`, async () => {
  const runWithInvalidMarkdoc = () =>
    markdoc().markup({
      content: invalidMarkdoc,
      filename: "test.md",
    });
  await expect(runWithInvalidMarkdoc).rejects.toThrowErrorMatchingSnapshot();
});

class FutureDate {
  validate(value: string): { id: string; level: "info"; message: string }[] {
    if (new Date(value) <= new Date())
      return [
        {
          id: "invalid-future-date",
          level: "info",
          message: "Should be a date in the future",
        },
      ];

    return [];
  }

  transform(value: string) {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  }
}

const markdocWithFutureDate = `
{% futureDate date="2000-1-1" /%}
`;

const futureDate = {
  render: "span",
  attributes: {
    date: {
      type: FutureDate,
      required: true,
    },
  },
};

test(`passes if Markdoc has info-level errors and default validation level`, async () => {
  expect(
    await markdoc({
      tags: {
        futureDate,
      },
    }).markup({
      content: markdocWithFutureDate,
      filename: "test.md",
    }),
  ).toMatchSnapshot();
});

test(`errors if Markdoc has info-level errors and info as validation level`, async () => {
  const runWithInfodMarkdoc = () =>
    markdoc({
      validationLevel: "info",
      tags: {
        futureDate,
      },
    }).markup({
      content: markdocWithFutureDate,
      filename: "test.md",
    });
  await expect(runWithInfodMarkdoc).rejects.toThrowErrorMatchingSnapshot();
});

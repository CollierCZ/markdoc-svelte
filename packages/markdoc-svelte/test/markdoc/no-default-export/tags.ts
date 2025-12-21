import { Config } from "@markdoc/markdoc";

export const tags = {
  someTag: { render: "SomeTag" },
} satisfies Config["tags"];

// No default export

import { customComponent } from "./custom-component.ts";
import { anotherComponent } from "./another-component.ts";
import type { Config } from "@markdoc/markdoc";

const tags = {
  "custom-component": customComponent,
  "another-component": anotherComponent,
  testTag: {
    render: "TestTag",
    attributes: {},
    children: ["text"],
  },
} satisfies Config["tags"];

export default tags;

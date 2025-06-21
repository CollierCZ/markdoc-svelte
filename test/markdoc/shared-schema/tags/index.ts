import { customComponent } from "./custom-component.ts";
import { anotherComponent } from "./another-component.ts";

const tags = {
  "custom-component": customComponent,
  "another-component": anotherComponent,
  testTag: {
    render: "TestTag",
    attributes: {},
    children: ["text"],
  },
};

export default tags;

import { customComponent } from "./custom-component";
import { anotherComponent } from "./another-component";

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

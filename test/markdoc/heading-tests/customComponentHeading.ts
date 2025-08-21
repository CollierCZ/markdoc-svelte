import { headingNode } from "../../../src/index.ts";

export default {
  heading: {
    render: "HeadingComponent",
    attributes: {
      ...headingNode.attributes,
    },
    children: headingNode.children,
    transform: headingNode.transform,
  },
};

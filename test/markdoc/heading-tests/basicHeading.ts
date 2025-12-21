import { headingNode } from "../../../src/index.ts";

export default {
  heading: {
    render: "h1",
    attributes: {
      class: { type: String, default: "custom-heading" },
      ...headingNode.attributes,
    },
    children: headingNode.children,
    transform: headingNode.transform,
  },
};

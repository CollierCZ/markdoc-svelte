import type { Schema } from "@markdoc/markdoc";
import { headingNode } from "../../../src/index.ts";

export default {
  render: "HeadingComponent",
  attributes: {
    ...headingNode.attributes,
  },
  children: headingNode.children,
  transform: headingNode.transform,
} satisfies Schema;

import { Tag } from "@markdoc/markdoc";
import type { Config, Node } from "@markdoc/markdoc";

export const customComponent = {
  render: "CustomComponent",
  attributes: {
    title: { type: String },
    description: { type: String }
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Tag(this.render, attributes, children);
  }
}; 
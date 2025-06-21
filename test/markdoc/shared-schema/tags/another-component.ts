import { Tag } from "@markdoc/markdoc";
import type { Config, Node } from "@markdoc/markdoc";

export const anotherComponent = {
  render: "AnotherComponent",
  attributes: {
    status: { type: String },
    count: { type: Number }
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Tag(this.render, attributes, children);
  }
}; 
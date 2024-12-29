import { Tag } from "@markdoc/markdoc";
import type { Config, Node } from "@markdoc/markdoc";

export const link = {
  render: "Link",
  children: ["inline"],
  attributes: {
    href: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    console.log("hi");

    const relValue = attributes.href.startsWith("http") ? "noopener" : "";
    const classValue = attributes.class
      ? `${attributes.class} font-semibold`
      : "font-semibold";

    return new Tag(
      this.render,
      { ...attributes, rel: relValue, class: classValue },
      children,
    );
  },
};

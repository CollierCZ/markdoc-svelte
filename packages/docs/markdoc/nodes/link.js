import Markdoc from "@markdoc/markdoc";

const link = {
  ...Markdoc.nodes.link,
  transform(node, config) {
    const { href } = node.transformAttributes(config);
    const children = node.transformChildren(config);

    const getFinalLink = () => {
      // Handle relative links
      if (href.startsWith(".") && href.endsWith(".mdoc")) {
        return href.replaceAll(/\/\d\d-/g, "/").replace(/\.mdoc$/, "");
      }

      // Everything else
      return href;
    };

    return new Markdoc.Tag(
      this.render,
      {
        href: getFinalLink(),
      },
      children,
    );
  },
};

export default link;

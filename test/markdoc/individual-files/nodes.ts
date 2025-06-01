import Markdoc from '@markdoc/markdoc';
export default {
  heading: {
    render: "h1",
    attributes: {
      class: { type: String, default: "custom-heading" },
      ...Markdoc.nodes.heading.attributes
    },
    children: ["inline"]
  }
}; 
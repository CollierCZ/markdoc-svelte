export default {
  link: {
    render: "a",
    attributes: {
      href: { type: String, required: true },
      class: { type: String, default: "custom-link" }
    },
    children: ["inline"]
  }
}; 
import { Config } from "@markdoc/markdoc";

export default {
  priorityTag: {
    render: "FileTag",
    attributes: {},
    children: ["text"],
  },
} satisfies Config["tags"];

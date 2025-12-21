import { Config } from "@markdoc/markdoc";

export default {
  priorityTag: {
    render: "DirectoryTag",
    attributes: {},
    children: ["text"],
  },
} satisfies Config["tags"];

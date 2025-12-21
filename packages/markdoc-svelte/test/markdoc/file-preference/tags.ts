import { Config } from "@markdoc/markdoc";

export default {
  preferenceTag: {
    render: "TypeScriptTag",
    attributes: {},
    children: ["text"],
  },
} satisfies Config["tags"];

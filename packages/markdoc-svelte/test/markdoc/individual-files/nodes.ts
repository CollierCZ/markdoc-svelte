import { Config } from "@markdoc/markdoc";
import nodes from "../shared-schema/nodes.ts";

export default {
  heading: nodes.heading,
} satisfies Config["nodes"];

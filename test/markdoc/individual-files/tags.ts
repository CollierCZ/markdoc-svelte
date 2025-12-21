import { Config } from "@markdoc/markdoc";
import tags from "../shared-schema/tags/index.ts";

export default {
  testTag: tags.testTag,
} satisfies Config["tags"];

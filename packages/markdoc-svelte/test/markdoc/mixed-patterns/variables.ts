import { Config } from "@markdoc/markdoc";
import variables from "../shared-schema/variables.ts";

export default {
  testVariable: variables.testVariable,
} satisfies Config["variables"];

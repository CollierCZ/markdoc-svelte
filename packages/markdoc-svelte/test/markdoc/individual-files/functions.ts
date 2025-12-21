import { Config } from "@markdoc/markdoc";
import functions from "../shared-schema/functions.ts";

export default {
  testFunction: functions.testFunction,
} satisfies Config["functions"];

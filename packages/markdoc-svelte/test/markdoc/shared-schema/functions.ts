import type { Config } from "@markdoc/markdoc";

export default {
  testFunction: {
    transform(parameters: any[]) {
      return "TRANSFORMED: " + parameters[0];
    },
  },
} satisfies Config["functions"];

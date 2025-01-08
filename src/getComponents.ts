import { Config } from "@markdoc/markdoc";
import FS from "fs";
import Path from "path";

export const getComponentImports = (
  schema: Config,
  componentDirPath: string,
): string => {
  let importStatement = "";

  const addImportsForSvelteComponents = (schemaArray: Config["tags"]) => {
    for (let name in schemaArray) {
      const tagOrNode = schemaArray[name];
      // Only include objects
      if (!tagOrNode || typeof tagOrNode === "string") continue;

      const renderName = tagOrNode["render"];
      /* Only when render string starts with a capital letter
         To represent Svelte components, not HTML tags and such
         Also ignores nodes with no render property */
      if (typeof renderName === "string" && /^\p{Lu}/u.test(renderName)) {
        // Check if the file exists and import if so
        const componentPath = Path.join(
          process.cwd(),
          `${componentDirPath}/${renderName}.svelte`,
        );
        if (FS.existsSync(componentPath)) {
          importStatement += `import ${renderName} from '${componentPath}';\n`;
        }
      }
    }
  };

  addImportsForSvelteComponents(schema.tags);
  addImportsForSvelteComponents(schema.nodes);

  return importStatement;
};

import fs from "fs";
import path from "path";
import Markdoc from "@markdoc/markdoc";

const DEFAULT_SCHEMA_PATH = "./markdoc";

// https://stackoverflow.com/questions/53799385/how-can-i-convert-a-windows-path-to-posix-path-using-node-path
const normalizeAbsolutePath = (absolutePath: string) => {
  return absolutePath.split(path.sep).join(path.posix.sep);
};

interface LoadOptions {
  schemaPath?: string;
}

const loadSchema = async ({ schemaPath }: LoadOptions): Promise<string> => {
  const schemaDirectory = path.posix.resolve(schemaPath || DEFAULT_SCHEMA_PATH);

  const schemaDirectoryExists = fs.existsSync(schemaDirectory);

  let schemaCode = "const schema = {};";

  if (schemaDirectoryExists) {
    const readDirectory = async (directoryName: string) => {
      try {
        const module = normalizeAbsolutePath(
          path.posix.resolve(schemaDirectory, directoryName)
        );
        return `import * as ${directoryName} from '${module}'`;
      } catch (error) {
        return `const ${directoryName} = {};`;
      }
    };

    schemaCode = `
    ${await readDirectory("config")}
    ${await readDirectory("tags")}
    ${await readDirectory("nodes")}
    ${await readDirectory("functions")}
    const schema = {
      tags: tags ? (tags.default || tags) : {},
      nodes: nodes ? (nodes.default || nodes) : {},
      functions: functions ? (functions.default || functions) : {},
      ...(config ? (config.default || config) : {}),
    };`.trim();
  } else if (
    // Throw an error only if the directory doesn't exist
    // AND a custom schema path is pased
    schemaPath &&
    schemaPath !== DEFAULT_SCHEMA_PATH
  ) {
    throw new Error(
      `Can't find the schema at '${schemaDirectory}' from the passed option 'schema: ${schemaPath}`
    );
  }

  return schemaCode;
};

export default loadSchema;

import fs from "fs";
import path from "path";

const DEFAULT_SCHEMA_PATH = "./markdoc";

// https://stackoverflow.com/questions/53799385/how-can-i-convert-a-windows-path-to-posix-path-using-node-path
const normalizeAbsolutePath = (absolutePath: string) => {
  return absolutePath.split(path.sep).join(path.posix.sep);
};

const loadSchema = async ( schemaPath?: string): Promise<Record<string, unknown>> => {
  const schemaDirectory = path.posix.resolve(schemaPath || DEFAULT_SCHEMA_PATH);

  const schemaDirectoryExists = fs.existsSync(schemaDirectory);

  let schemaCode = {};

  if (schemaDirectoryExists) {
    const readDirectory = async (directoryName: string) => {
      try {
        const module = normalizeAbsolutePath(
          path.posix.resolve(schemaDirectory, directoryName)
        );
        const { default: schemaSection } = await import(module)
        return schemaSection;
      } catch (error) {
        return {};
      }
    };

    schemaCode = {
      config: await readDirectory("config"),
      tags: await readDirectory("tags"),
      nodes: await readDirectory("nodes"),
      functions: await readDirectory("functions")
    }
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

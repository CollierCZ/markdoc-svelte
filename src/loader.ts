import { Config } from "@markdoc/markdoc";
import { existsSync } from "fs";
import { posix, sep } from "path";

const DEFAULT_SCHEMA_PATH = "./markdoc";

// https://stackoverflow.com/questions/53799385/how-can-i-convert-a-windows-path-to-posix-path-using-node-path
const normalizeAbsolutePath = (absolutePath: string) => {
  return absolutePath.split(sep).join(posix.sep);
};

interface ConfigWithPartialsPath extends Omit<Config, "partials"> {
  partials?: string;
}

const loadSchema = async (
  schemaPath?: string,
): Promise<ConfigWithPartialsPath> => {
  const schemaDirectory = posix.resolve(schemaPath || DEFAULT_SCHEMA_PATH);

  const schemaDirectoryExists = existsSync(schemaDirectory);

  let schemaCode = {};

  const getNormalizedPathInSchemaDirectory = (subDirectory: string) =>
    normalizeAbsolutePath(posix.resolve(schemaDirectory, subDirectory));

  if (schemaDirectoryExists) {
    const readDirectory = async (directoryName: string) => {
      try {
        const module = getNormalizedPathInSchemaDirectory(directoryName);
        const moduleFile =
          existsSync(`${module}.js`) || existsSync(`${module}.ts`)
            ? `${module}`
            : `${module}/index`;
        const { default: schemaSection } = existsSync(`${moduleFile}.js`)
          ? await import(`${moduleFile}.js`)
          : await import(`${moduleFile}.ts`);
        return schemaSection;
      } catch (error) {
        return {};
      }
    };

    const getPartialsDirectory = () => {
      try {
        const dirPath = getNormalizedPathInSchemaDirectory("partials");
        if (existsSync(dirPath)) {
          return dirPath;
        }
        return "";
      } catch (error) {
        return "";
      }
    };

    schemaCode = {
      config: await readDirectory("config"),
      functions: await readDirectory("functions"),
      nodes: await readDirectory("nodes"),
      partials: getPartialsDirectory(),
      tags: await readDirectory("tags"),
      variables: await readDirectory("variables"),
    };
  } else if (
    // Throw an error only if the directory doesn't exist
    // AND a custom schema path is pased
    schemaPath &&
    schemaPath !== DEFAULT_SCHEMA_PATH
  ) {
    throw new Error(
      `Can't find the schema at '${schemaDirectory}' from the passed option 'schema: ${schemaPath}`,
    );
  }

  return schemaCode;
};

export default loadSchema;

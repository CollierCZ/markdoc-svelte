import MarkdocSource, { Config } from "@markdoc/markdoc";
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

const getPartials = (
  partialsDirectory: string | undefined,
): Config["partials"] => {
  if (!partialsDirectory) return undefined;

  if (existsSync(partialsDirectory)) {
    const files = readdirSync(partialsDirectory);

    const partialsRecords = files.reduce(
      (recordObject, file) => {
        if (recordObject) {
          recordObject[file] = MarkdocSource.parse(
            readFileSync(join(partialsDirectory, file), "utf8"),
          );
        }
        return recordObject;
      },
      {} as Config["partials"],
    );

    return partialsRecords;
  } else {
    throw new Error(
      `Can't find the partials directory at '${partialsDirectory}'.`,
    );
  }
};

export default getPartials;

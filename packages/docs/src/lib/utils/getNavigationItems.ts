import type { MarkdocModule } from "markdoc-svelte";
import type { NavItems } from "$lib/types";

export const getNavigationItems = async (): Promise<NavItems> => {
  const allPages = import.meta.glob("/src/content/docs/**/*.mdoc");
  const allDirs = import.meta.glob("/src/content/docs/**/meta.json");
  const docsDir = "/src/content/docs/";

  // If no pages found in the docs directory
  if (!Object.keys(allPages)) return;

  // Go through each file and get its path and title
  const navItems = await Object.entries(allPages).reduce(
    async (navItemAcc, [filePath, fileResolver]): Promise<NavItems> => {
      try {
        const existingNavItems = await navItemAcc;
        // Get the metadata from the file
        const page = (await fileResolver()) as MarkdocModule;
        const pageTitle = page.frontmatter?.title;

        // Get only the slug part of the path
        const slug = filePath.replace(docsDir, "").replace(/\.mdoc$/, "");

        // Check if the file is inside another directory
        const isInDir = slug.match(/^(?<dirName>.*)\//);

        // If it's in a directory
        if (isInDir) {
          // Get everything before the slash
          const dirName = isInDir.groups["dirName"];

          // See if that directory is already inn the list
          const matchingNavDir = Object.entries(existingNavItems).find(
            (item) => item[0] === dirName,
          );

          // If it is, add another child
          if (matchingNavDir) {
            const matchingNavDirData = matchingNavDir[1];

            return {
              ...existingNavItems,
              [dirName]: {
                title: matchingNavDirData.title,
                children: {
                  ...matchingNavDirData.children,
                  [slug]: {
                    title: pageTitle,
                  },
                },
              },
            };
          } else {
            // If directory isn't yet in list, get the JSON data from which the title comes
            const matchingDir = Object.entries(allDirs).find(([dirPath, _]) =>
              dirPath.match(dirName),
            );

            const [_, dirData] = matchingDir;

            return {
              ...existingNavItems,
              [dirName]: {
                title: (await dirData()).title,
                children: {
                  [slug]: {
                    title: pageTitle,
                  },
                },
              },
            };
          }
        }

        const newNavItems = {
          ...existingNavItems,
          [slug]: {
            title: pageTitle,
          },
        };

        return newNavItems;
      } catch (err) {
        console.error(
          `Error getting navigation information for the file ${filePath}: ${err}`,
        );
      }
    },
    Promise.resolve({} as unknown as NavItems),
  );

  return navItems;
};

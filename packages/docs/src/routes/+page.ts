import { error, type HttpError } from "@sveltejs/kit";
import type { MarkdocModule } from "markdoc-svelte";

export const load = async () => {
  try {
    const page = (await import(`/src/content/index.mdoc`)) as MarkdocModule;
    return { page };
  } catch {
    throw error(404) as HttpError;
  }
};

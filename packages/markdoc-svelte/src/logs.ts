const projectName = "markdoc-svelte";

const log = {
  debug: (message: string) => {
    console.debug(`[${projectName}] DEBUG: ${message}`);
  },
  info: (message: string) => {
    console.info(`[${projectName}] INFO: ${message}`);
  },
  log: (message: string) => {
    console.log(`[${projectName}] LOG: ${message}`);
  },
  warn: (message: string) => {
    console.warn(`[${projectName}] WARNING: ${message}`);
  },
  // Log formal Errors and others too
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: string, error?: any) => {
    if (error) {
      console.error(`[${projectName}] ERROR: ${message}`, error);
    } else {
      console.error(`[${projectName}] ERROR: ${message}`);
    }
  },
};

export default log;

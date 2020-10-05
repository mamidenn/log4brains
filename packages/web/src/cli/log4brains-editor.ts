import next from "next";
import { createServer } from "http";
import path from "path";
import chalk from "chalk";
import { logger } from "../lib/logger";

export async function startEditorCommand(port: number): Promise<void> {
  logger.info("🧠 Log4brains is starting...");

  const app = next({ dev: true, dir: path.join(__dirname, "..") });
  await app.prepare();

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const srv = createServer(app.getRequestHandler());

  try {
    await new Promise((resolve, reject) => {
      // This code catches EADDRINUSE error if the port is already in use
      srv.on("error", reject);
      srv.on("listening", () => resolve());
      srv.listen(port);
    });

    logger.info(
      `The editor is now 🚀 on ${chalk.underline.blueBright(
        `http://localhost:${port}/`
      )}`
    );
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.code === "EADDRINUSE") {
      logger.fatal(
        `Port ${port} is already in use. Use the -p <PORT> option to select another one.`
      );
      process.exit(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (err.code === "EACCES") {
      logger.fatal(
        `Impossible to use port ${port} (permission denied). Use the -p <PORT> option to select another one.`
      );
      process.exit(1);
    } else {
      throw err;
    }
  }
}
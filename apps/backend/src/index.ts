import { logger } from "@repo/logger/config";
import { bootstrap } from "@/server.ts";
import http from "http";
import { ApiError } from "@/utils/customError.ts";
import { PORT } from "./utils/envs.ts";
async function main() {
  const port = PORT;
  if (!port) {
    throw new ApiError(500, "PORT is not set");
  }
  const app = await bootstrap();

  const server = http.createServer(app);
  server.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
}
main().catch((err) => {
  if (err instanceof ApiError) {
    logger.error(`Startup error: ${err.message}`);
  } else {
    logger.error("Unexpected startup error", err);
  }

  // 🚨 fatal startup failure → exit
  process.exit(1);
});

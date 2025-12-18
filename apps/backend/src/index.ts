import { logger } from "@repo/logger/config";
import { bootstrap } from "./server.ts";
import http from "http";
async function main() {
  const port = process.env.PORT;
  if (!port) {
    throw new Error("PORT is not set");
  }
  const app = await bootstrap();

  const server = http.createServer(app);
  server.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
}
main().catch((err) => {
  logger.error(err instanceof Error ? err.message : String(err));
});

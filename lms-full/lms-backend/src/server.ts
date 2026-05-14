import app from "./app";
import { prisma } from "./config/prisma";
import { logger } from "./middlewares/logger.middleware";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  try {
    await prisma.$connect();

    logger.info("Database connected successfully");

    app.listen(PORT, () => {
      logger.info(
        `Server running on http://localhost:${PORT} in ${NODE_ENV} mode`,
      );
    });
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)));

    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();

  logger.info("Database disconnected");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();

  logger.info("Application terminated");
  process.exit(0);
});

startServer();

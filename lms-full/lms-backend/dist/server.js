import app from "./app.js";
import { ConnectCloudinary } from "./config/cloudinary.js";
import { prisma } from "./config/prisma.js";
import { logger } from "./middlewares/logger.middleware.js";
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const startServer = async () => {
    try {
        await prisma.$connect();
        await ConnectCloudinary();
        logger.info("Database connected successfully");
        logger.info("Cloudinary connected successfully");
        app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT} in ${NODE_ENV} mode`);
        });
    }
    catch (error) {
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
//# sourceMappingURL=server.js.map
import "dotenv/config";
import express from "express";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { httpLogger } from "./middlewares/logger.middleware";

const app = express();

app.use(express.json());
app.use(httpLogger);

//--------------- health check -------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the LMS API",
    timestamp: new Date().toISOString(),
  });
});

//------------------ mount the routes ------------------------
app.use("/api", routes);

// 404 Handler
app.use((_, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

//------------------------- global errorHandling --------------------------
app.use(errorMiddleware);

export default app;

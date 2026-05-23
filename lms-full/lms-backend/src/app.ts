import "dotenv/config";
import "./config/passport.js";
import express from "express";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { httpLogger } from "./middlewares/logger.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { CorsOptions } from "cors";
import passport from "passport";
import muxWebhookRoutes from "./modules/chapter/mux.routes.js";
const app = express();

const parseOrigins = (value?: string) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
      try {
        return new URL(origin).origin;
      } catch {
        return origin.replace(/\/$/, "");
      }
    }) ?? [];

const allowedOrigins = new Set([
  "http://localhost:3000",
  ...parseOrigins(process.env.CLIENT_URL),
  ...parseOrigins(process.env.CORS_ORIGIN),
]);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};

app.use(
  "/api/webhook/mux",
  express.raw({
    type: "application/json",
  }),
  muxWebhookRoutes,
);


app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);
app.use(cors(corsOptions));

//------------------------- mux webhook --------------------------


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

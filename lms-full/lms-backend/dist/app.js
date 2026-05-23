import "dotenv/config";
import "./config/passport.js";
import express from "express";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { httpLogger } from "./middlewares/logger.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import muxWebhookRoutes from "./modules/chapter/mux.routes.js";
const app = express();
app.use("/api/webhook/mux", express.raw({
    type: "application/json",
}), muxWebhookRoutes);
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);
app.use(cors({
    origin: ["http://localhost:3000", "https://next-projects-8oog.vercel.app", "https://api.puter.com"],
    credentials: true,
}));
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
//# sourceMappingURL=app.js.map
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import indexRouter from "./routes/index.js";

const app = express();

app.use(cookieParser());
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(
  express.urlencoded({
    limit: "16kb",
    extended: true,
  })
);
app.use(indexRouter);

export default app;

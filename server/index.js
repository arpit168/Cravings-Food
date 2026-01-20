import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import AuthRouter from "./src/routers/authRouter.js";
import publicRouter from "./src/routers/publicRouter.js";


const app = express();

app.use(cors({ origin: ["http://localhost:5173","http://192.168.0.141:5173","https://cravings-food-zone-by-arpit.netlify.app"], credentials:true}));
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", AuthRouter);
app.use("/public", publicRouter );

app.get("/", (req, res) => {
  console.log("Server is Working");
});

app.use((err, req, res, next) => {
  const ErrorMessage = err.message || "Internal Server Error";
  const StatusCode = err.statusCode || 500;

  res.status(StatusCode).json({ message: ErrorMessage });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server started at port:", port);
});
connectDB();

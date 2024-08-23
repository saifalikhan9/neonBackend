import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Authorization,Content-Type",
  })
);

app.use(express.json( ));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import cartRouter from "./routes/cart.routes.js"
import adminRouter from "./routes/admin.routes.js"
import addressRouter from "./routes/address.routes.js"
import OrderItemRouter from "./routes/orderItem.routes.js"
import orderRouter from "./routes/order.routes.js"
import paymentRouter from "./routes/payment.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/orderitem", OrderItemRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/payment", paymentRouter);

// http://localhost:8000/api/v1/users/register

export { app };
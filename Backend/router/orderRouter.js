import express from "express";

import authMiddleware from "../middleware/auth.js";

import { listOrders, placeOrder, removeOrder, updateStatus, userOrders } from "../controllers/orderController.js";

const orderRouter =express.Router();

orderRouter.post("/place",authMiddleware,placeOrder)

orderRouter.post("/userorders",authMiddleware,userOrders)
orderRouter.get("/list",listOrders)
orderRouter.post("/status",updateStatus)
orderRouter.post("/remove",removeOrder)




export default orderRouter;
import cors from "cors"
import 'dotenv/config.js'
import express from "express"
import { connectDB } from "./config/db.js"
import cartRouter from "./router/cartRouter.js"
import foodRouter from "./router/foodRouter.js"
import orderRouter from "./router/orderRouter.js"
import userRouter from "./router/userRouter.js"


//app config
// twilio code = R4Y3T27KQZDUSBDM55ZLZ5UG

const app = express()
const port = 4000


//middleware

app.use(express.json())
app.use(cors())

// db Connection
connectDB();

// API endpoints

app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req, res)=>{
    res.send("API  Working")
})

app.listen(port,()=>{
    console.log('Server Strated on http://localhost:${port}')
})

//mongodb+srv://moneduc1234:Kine.Fall@cluster0.saoz4n6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
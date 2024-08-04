import cors from "cors"
import express from "express"
import { connectDB } from "./config/db.js"
import foodRouter from "./router/foodRouter.js"


//app config

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

app.get("/",(req, res)=>{
    res.send("API  Working")
})

app.listen(port,()=>{
    console.log('Server Strated on http://localhost:${port}')
})

//mongodb+srv://moneduc1234:Kine.Fall@cluster0.saoz4n6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
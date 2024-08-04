import mongoose from "mongoose";

export const connectDB = async() => {
    (await mongoose.connect('mongodb+srv://moneduc1234:Kine.Fall@cluster0.saoz4n6.mongodb.net/food-del').then(()=>console.log("DB Connected")));

}
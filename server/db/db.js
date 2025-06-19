import mongoose from "mongoose";


const connectDB = async ()=>{
    try {
        mongoose.connection.on("connected",()=> console.log("DataBase Connected !!")
        )
        await mongoose.connect(`${process.env.MONGODB_URL}/mern_auth`)
    } catch (error) {
        console.log("DataBase Connected Failed",error)
        process.exit(1)
        
    }
}

export default connectDB
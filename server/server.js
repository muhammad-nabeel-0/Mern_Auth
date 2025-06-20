import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config.js'
import connectDB from './db/db.js'
import userRouter from './routes/user.routes.js'
import {userDataRouter} from './routes/userData.routes.js'


const app = express()
const port = process.env.PORT || 4000
connectDB();


app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: [ 'https://mern-auth-git-main-nabeel-munirs-projects.vercel.app'], // update this
  credentials:true
}));

// app.use(cors({
//   origin: [ 'http://localhost:5173'], // update this
//   credentials:true
// }));

app.get("/",(req,res)=>{
    res.send("API Working")
})
app.use("/api/auth",userRouter)
app.use("/api/user",userDataRouter)


app.listen(port,()=>console.log(`Server started on http://localhost:${port}`))


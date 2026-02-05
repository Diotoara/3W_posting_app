import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import authRouter from "./Routes/authRoutes.js";
import postRouter from "./Routes/PostRoutes.js";
import connectDb from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)

const startServer = async() => {
    try {
        await connectDb();
        app.listen(5000,()=>{
            console.log("Server is running on http://localhost:5000")
        })

    } catch (error) {
        console.log("Failed to start server",error);
        process.exit(1)
    }
};

startServer();

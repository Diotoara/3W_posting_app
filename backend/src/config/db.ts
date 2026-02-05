import mongoose from "mongoose"

const connectDb = async() => {
    try {
        const mongodb = process.env.MONGO_DB_URI!
        await mongoose.connect(mongodb)
        console.log("Mongo DB Connected")
    } catch (error) {
        console.log("Error while connecting to Mongo DB.\n", error);
    }
};

export default connectDb

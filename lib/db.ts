import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(`mongodb://localhost:27017/SchoolDB`)
        console.log('Connected to mongodb.')
    }catch(error){
        console.log(`Error `, error)
        process.exit(1)
    }
}

export default connectDB;
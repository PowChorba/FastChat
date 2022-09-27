import mongoose from "mongoose";
require ("dotenv").config();

const dbConnection = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION || "test");
        console.log("Db connected")
    }catch(e){
        console.log(e,"db fail")
    }
}

module.exports = {
    dbConnection
}
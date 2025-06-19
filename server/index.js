import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// connect to database;
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB connected !"))
	.catch((error) => console.log("Error connecting to mongo DB !", error));

const app = express();

// listen to app;
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`It's running my guy`));

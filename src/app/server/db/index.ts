import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log("MongoDB URI not found in environment variables.");
    process.exit(1);
  }

  try {
    const connectionInstance = await mongoose.connect(mongoUri, {
      // Example write concern option
      writeConcern: { w: "majority" },
    });

    console.log("MongoDB connected successfully!");
    console.log("DB HOST: ", connectionInstance.connection.host);
  } catch (error) {
    console.error("MongoDB connection unsuccessful!", error);
    process.exit(1);
  }
}

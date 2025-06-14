import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  } else {
    console.error("Unknown error connecting to MongoDB");
  }
  process.exit(1);
}
};

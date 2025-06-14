import { connectDB } from "@/lib/mongoose";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  res.status(200).json({ message: "Connected to MongoDB" });
}
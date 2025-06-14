import { dailyRoutespost, deletedailydata, getdailydata, updatedailydata } from "@/controllers/dailyData.controller";

import { connectDB } from "@/lib/mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    switch (req.method) {
        case "GET":
            return getdailydata(req, res);
        case "POST":
            return dailyRoutespost(req, res);
        case "PUT":
            return updatedailydata(req, res);
        case "DELETE":
            return deletedailydata(req, res);
    
       default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
}
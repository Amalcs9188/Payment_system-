import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongoose';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '@/controllers/expense.controller';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB(); 
  
  switch (req.method) {
    case 'GET':
      return getExpenses(req, res);
    case 'POST':
      return createExpense(req, res);
    case 'PUT':
      return updateExpense(req, res);
    case 'DELETE':
      return deleteExpense(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

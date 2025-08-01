import { NextApiRequest, NextApiResponse } from 'next';
import { Expense } from '@/schema/expenseSchema';

// POST: Create a new expense
export const createExpense = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { date, category, description, amount } = req.body;
    const expense = new Expense({ date, category, description, amount });
    await expense.save();
    res.status(201).json({ message: 'Expense record created successfully' });
  } catch (error) {
    const err = error as Error;
     console.error('API Error:', err.message);
    res.status(500).json({ error: 'Failed to create expense record' });
  }
};
// GET: Get all expenses
export const getExpenses = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req);
    
  try {
    const expenses = await Expense.find({});
    res.status(200).json({ message: 'Expense data retrieved successfully', data: expenses });
  } catch (error) {
    const err = error as Error;
     console.error('API Error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve expense data' });
  }
};

// PUT: Update a specific expense
export const updateExpense = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Valid ID is required to update the expense record' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedExpense) {
      
      return res.status(404).json({ message: 'Expense record not found' });
    }

    res.status(200).json({ message: 'Expense record updated successfully', data: updatedExpense });
  } catch (error) {
     const err = error as Error;
     console.error('API Error:', err.message);
    res.status(500).json({ error: 'Failed to update expense record' });
  }
};

// DELETE: Delete a specific expense
export const deleteExpense = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Valid ID is required to delete the expense record' });
    }

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense record not found' });
    }

    res.status(200).json({ message: 'Expense record deleted successfully', data: deletedExpense });
  } catch (error) {
     const err = error as Error;
     console.error('API Error:', err.message);
    res.status(500).json({ error: 'Failed to delete expense record' });
  }
};

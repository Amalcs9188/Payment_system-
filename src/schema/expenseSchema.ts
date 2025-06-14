import mongoose from "mongoose";



// Schema definition
const expenseSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },
});

// Create and export the model
export const Expense = mongoose.model("Expense", expenseSchema);

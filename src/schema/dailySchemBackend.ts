import mongoose from "mongoose";



// Schema definition
const dailySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  closing_cash: {
    type: Number,
    required: true,
  },
  opening_cash: {
    type: Number,
    required: true,
  },
  counter_cash: {
    type: Number,
    required: true,
  },
  expense: {
    type: Number,
    default: 0,
  },
  total_cash: {
    type: Number,
  },
  upi_cash: {
    type: Number,
    default: 0,
  },
  card_cash: {
    type: Number,
    default: 0,
  },
  total_sales: {
    type: Number,
  },
  short_excess: {
    type: Number,
  },
});

// Pre-save hook to calculate derived fields
dailySchema.pre('save', function (next) {


  this.total_cash = (this.opening_cash || 0) + (this.counter_cash || 0) - (this.expense || 0);
  this.total_sales = (this.upi_cash || 0) + (this.card_cash || 0) + (this.counter_cash || 0);
  this.short_excess = (this.closing_cash || 0) - this.total_cash;


  next();
});



// Create and export the model
export const DailyData = mongoose.model("DailyData", dailySchema);


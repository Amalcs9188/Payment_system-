import { DailyData } from "@/schema/dailySchemBackend";
import { NextApiRequest, NextApiResponse } from "next";



// Create a new daily record

export const dailyRoutespost = async (req:NextApiRequest, res:NextApiResponse) => {
  try {
    const {
      date,
      closing_cash,
      opening_cash,
      counter_cash,
      expense,
      upi_cash,
      card_cash,
    } = req.body;


    // Create a new daily record
    const dailyRecord = new DailyData({
      date,
      closing_cash,
      opening_cash,
      counter_cash,
      expense,
      upi_cash,
      card_cash,
    });

    // Save the record to the database
    await dailyRecord.save();

    res
      .status(201)
      .json({
        message: "Daily record created successfully",
        data: dailyRecord,
      });
  } catch (error) {
    console.error("Error creating daily record:", error);
    res
      .status(500)
      .json({ 
        message: "Internal server error", 
        error: error instanceof Error ? error.message : String(error), 
        
      });
  }
};

export const getdailydata = async (req:NextApiRequest, res:NextApiResponse) => {
    console.log(req);
    
  try {
    const dailyData = await DailyData.find({});
    res
      .status(200)
      .json({ message: "Daily data retrieved successfully", data: dailyData });
  } catch (error) {
    console.error("Error retrieving daily data:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error instanceof Error ? error.message : String(error) });
  }
};

export const updatedailydata = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(req.body);

  try {
    // query params
    const { id } = req.query;
    console.log(id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID is required to update the daily record" });
    }
    const updateData = req.body;

    // Find the record by ID and update it
    const updatedRecord = await DailyData.findByIdAndUpdate(
      id,

      {
        date: updateData.date,
        closing_cash: updateData.closing_cash,
        opening_cash: updateData.opening_cash,
        counter_cash: updateData.counter_cash,
        expense: updateData.expense,
        upi_cash: updateData.upi_cash,
        card_cash: updateData.card_cash,
        total_cash:(updateData.opening_cash || 0) + (updateData.counter_cash || 0) - (updateData.expense || 0) ,
        total_sales: (updateData.upi_cash || 0) + (updateData.card_cash || 0) + (updateData.counter_cash || 0),
        short_excess: (updateData.closing_cash || 0) - (updateData.total_cash || 0),

      },
      { new: true }
    );
//     total_cash
// total_sales
// short_excess

    if (!updatedRecord) {
      return res.status(404).json({ message: "Daily record not found" });
    }

    res
      .status(200)
      .json({
        message: "Daily record updated successfully",
        data: updatedRecord,
      });
  } catch (error) {
    console.error("Error updating daily record:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error instanceof Error ? error.message : String(error) });
  }
};

export const deletedailydata = async (req:NextApiRequest, res:NextApiResponse) => {
  try {
    const { id } = req.query;
    console.log(id);
    
    if (!id) {
      return res
        .status(400)
        .json({ message: "ID is required to delete the daily record" });
    }

    const deletedRecord = await DailyData.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ message: "Daily record not found" });
    }

    res
      .status(200)
      .json({
        message: "Daily record deleted successfully",
        data: deletedRecord,
      });
  } catch (error) {
    console.error("Error deleting daily record:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error instanceof Error ? error.message : String(error) });
  }
};


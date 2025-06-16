"use client";

import ComponentHeader from "@/components/ComponentHeader";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DataTableDemo } from "@/components/table_";
import { useExpense } from "@/hooks/use-expense";
import groupByDate from "./groupByDate";
import { Progress } from "@/components/ui/progress";

export type DailyDataItem = {
  _id: string;
  date?: string;
  closing_cash?: number;
  opening_cash?: number;
  counter_cash?: number;
  expense?: number;
  upi_cash?: number;
  card_cash?: number;
  // add other fields if present
};



import React, { useEffect, useState } from "react";

const Page = () => {

    const {data:expenseData,isLoading} =useExpense()
    console.log(expenseData);
    
    const [progress, setProgress] = useState(10);

    const groupedData = groupByDate(expenseData?.data);
    console.log(groupedData);
    
 
     useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLoading) {
          timer = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 90) {
                return prev;
              }
              return prev + 10;
            });
          }, 200);
        }
        return () => {
          if (timer) clearInterval(timer);
        };
      }, [isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="w-[60%] space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground">
            Loading Daily Sales Report...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className=" w-[100%] flex flex-col items-start bg-fill_bg p-2">
      <ComponentHeader
        className="w-full px-3"
        title={"Day Wise Expense Report"}
        description={
          "Record daily expense data to keep your reports accurate and up to date."
        }
      />
    

      <Accordion
        type="single"
        collapsible
        className="w-full bg-background p-3 rounded-2xl"
        defaultValue="item-1">
        {groupedData&&Object?.entries(groupedData).map(([date, expenses]) => (    
        <AccordionItem key={date} value={"item-" + date}>
         
          <AccordionTrigger className="">
            <div className="w-full flex justify-between">
              <span className="font-bold">  {date}</span>
              <span className="font-bold">Total Expense : 5000</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <DataTableDemo data={expenses??[]} />
          </AccordionContent>
        </AccordionItem>
        ))}
      </Accordion>

    </div>
  );
};

export default Page;

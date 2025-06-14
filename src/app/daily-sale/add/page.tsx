"use client";
import { CgClose } from "react-icons/cg";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import ComponentHeader from "@/components/ComponentHeader";
import { formSchema } from "../../../schema/dailyShema";
import { useDailyDataUpdate } from "../view/useDailyData";


type FormValues = z.infer<typeof formSchema>;

export default function DailySalePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      openingCash: 0,
      counterCash: 0,
      expense: 0,
      upiCash: 0,
      cardCash: 0,
      other: 0,
      note500: 0,
      note200: 0,
      note100: 0,
      note50: 0,
      note20: 0,
      note10: 0,
    },
  });

  // Watch all fields for live calculation
  const openingCash = watch("openingCash") || 0;
  const counterCash = watch("counterCash") || 0;
  const expense = watch("expense") || 0;
  const upiCash = watch("upiCash") || 0;
  const cardCash = watch("cardCash") || 0;
  const other = watch("other") || 0;
  const note500 = watch("note500") || 0;
  const note200 = watch("note200") || 0;
  const note100 = watch("note100") || 0;
  const note50 = watch("note50") || 0;
  const note20 = watch("note20") || 0;
  const note10 = watch("note10") || 0;

  const totalCash =( openingCash + counterCash) - (expense ?? 0);
  const totalNotes =
    note500 * 500 +
    note200 * 200 +
    note100 * 100 +
    note50 * 50 +
    note20 * 20 +
    note10 * 10;
  const short = totalNotes - totalCash;
  const totalSale = counterCash + upiCash + cardCash + other;

  const { mutate: addData  } = useDailyDataUpdate();

  const newDate = new Date().toLocaleDateString();
  const onSubmit = (data: FormValues) => {
    console.log(data)
    addData({
      date: (date instanceof Date ? date.toLocaleDateString() : date) ?? newDate,
      closing_cash: totalNotes,
      opening_cash: data.openingCash,
      counter_cash: data.counterCash,
      expense: data.expense??0,
      upi_cash: data.upiCash,
      card_cash: data.cardCash,
    },{
      onSuccess: ()=>{
        reset();
        
      }
    }
    )
  };
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [calOpen, setCalOpen] = React.useState(false);

  return (
    <div className="w-[100%] min-h-screen flex items-center bg-fill_bg justify-center p-3">
      <Card className="w-full p-6  border bg-background">
        <CardHeader>
          <ComponentHeader
            title="Cafe Daily Sale"
            description="Record your daily sales and cash management details"
          />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Badge
              className=" cursor-pointer"
              onClick={() => setCalOpen(!calOpen)}
              variant={"default"}>
              {date ? date.toLocaleDateString() : "Select Date"}
            </Badge>
            {calOpen && (
              <div className=" relative bg-background">
                <div className="rounded-lg border absolute top-0 left-2  bg-white shadow-lg">
                  <span
                    onClick={() => setCalOpen(false)}
                    className="absolute top-2 cursor-pointer right-2">
                    <CgClose />
                  </span>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate);
                        setCalOpen(false);
                      }
                    }}
                    className="mt-4"
                  />
                </div>
              </div>
            )}
            {/* Cash Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h3 className="text-lg font-semibold tracking-tight">
                  Cash Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingCash">Opening Cash</Label>
                  <Input
                    id="openingCash"
                    type="number"
                    {...register("openingCash", { valueAsNumber: true })}
                  />
                  {errors.openingCash && (
                    <p className="text-sm text-red-500">
                      {errors.openingCash.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="counterCash">Counter Cash</Label>
                  <Input
                    id="counterCash"
                    type="number"
                    {...register("counterCash", { valueAsNumber: true })}
                  />
                  {errors.counterCash && (
                    <p className="text-sm text-red-500">
                      {errors.counterCash.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense">Expense</Label>
                  <Input
                    id="expense"
                    type="number"
                    {...register("expense", { valueAsNumber: true })}
                  />
                  {errors.expense && (
                    <p className="text-sm text-red-500">
                      {errors.expense.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Payment Methods Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h3 className="text-lg font-semibold tracking-tight">
                  Payment Methods
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="upiCash">UPI Cash</Label>
                  <Input
                    id="upiCash"
                    type="number"
                    {...register("upiCash", { valueAsNumber: true })}
                  />
                  {errors.upiCash && (
                    <p className="text-sm text-red-500">
                      {errors.upiCash.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCash">Card Cash</Label>
                  <Input
                    id="cardCash"
                    type="number"
                    {...register("cardCash", { valueAsNumber: true })}
                  />
                  {errors.cardCash && (
                    <p className="text-sm text-red-500">
                      {errors.cardCash.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="other">Other</Label>
                  <Input
                    id="other"
                    type="number"
                    {...register("other", { valueAsNumber: true })}
                  />
                  {errors.other && (
                    <p className="text-sm text-red-500">
                      {errors.other.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Notes Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h3 className="text-lg font-semibold tracking-tight">
                  Cash Notes
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="note500">₹500 Notes</Label>
                  <Input
                    id="note500"
                    type="number"
                    {...register("note500", { valueAsNumber: true })}
                  />
                  {errors.note500 && (
                    <p className="text-sm text-red-500">
                      {errors.note500.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note200">₹200 Notes</Label>
                  <Input
                    id="note200"
                    type="number"
                    {...register("note200", { valueAsNumber: true })}
                  />
                  {errors.note200 && (
                    <p className="text-sm text-red-500">
                      {errors.note200.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note100">₹100 Notes</Label>
                  <Input
                    id="note100"
                    type="number"
                    {...register("note100", { valueAsNumber: true })}
                  />
                  {errors.note100 && (
                    <p className="text-sm text-red-500">
                      {errors.note100.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note50">₹50 Notes</Label>
                  <Input
                    id="note50"
                    type="number"
                    {...register("note50", { valueAsNumber: true })}
                  />
                  {errors.note50 && (
                    <p className="text-sm text-red-500">
                      {errors.note50.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note20">₹20 Notes</Label>
                  <Input
                    id="note20"
                    type="number"
                    {...register("note20", { valueAsNumber: true })}
                  />
                  {errors.note20 && (
                    <p className="text-sm text-red-500">
                      {errors.note20.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note10">₹10 Notes</Label>
                  <Input
                    id="note10"
                    type="number"
                    {...register("note10", { valueAsNumber: true })}
                  />
                  {errors.note10 && (
                    <p className="text-sm text-red-500">
                      {errors.note10.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className=" mt-4">
              <Button
                variant={"outline"}
                className=" border-2 w-full border-primary bg-blue-700/10 text-primary hover:bg-primary hover:text-primary-foreground "
                type="submit">
                Submit Report
              </Button>
            </div>
            {/* Summary Section */}
            <div className="w-full space-y-4 rounded-lg border p-4 bg-blue-700/10 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h3 className="text-lg font-semibold tracking-tight">
                  Summary
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="space-y-2 p-3 rounded-lg bg-background/70">
                  <p className="text-sm text-muted-foreground">Total Cash</p>
                  <p className="text-2xl font-bold">₹{totalCash}</p>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-background/70">
                  <p className="text-sm text-muted-foreground">Total Notes</p>
                  <p className="text-2xl font-bold">₹{totalNotes}</p>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-background/70">
                  <p className="text-sm text-muted-foreground">Short/Excess</p>
                  <p
                    className={`text-2xl font-bold ${
                      short < 0 ? "text-red-500" : "text-green-600"
                    }`}>
                    ₹{short}
                  </p>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-background/70">
                  <p className="text-sm text-muted-foreground">Total Sale</p>
                  <p className="text-2xl font-bold">₹{totalSale}</p>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-background/70">
                  <p className="text-sm text-muted-foreground">
                    Total Cash Online
                  </p>
                  <p className="text-2xl font-bold">₹{cardCash + upiCash}</p>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-background/70">
                  <p className="text-sm text-muted-foreground">Cash Online</p>
                  <p className="text-2xl font-bold">₹{0}</p>
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-end px-0 pt-6"></CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

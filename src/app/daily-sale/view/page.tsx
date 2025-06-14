"use client";
import { Data_column } from "@/app/daily-sale/view/Column-Data";
import ComponentHeader from "@/components/ComponentHeader";
import { DataTable } from "@/components/data-table";
import React, { useEffect, useState } from "react";
import { useDailyData, useDailyDataEdit, useDailyDelete } from "./useDailyData";
import { Progress } from "@/components/ui/progress";

import {
  DialogContent,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";

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

const formSchema = z.object({
  date: z.string().optional(),
  closing_cash: z.coerce.number().min(1, "Closing cash is required"),
  opening_cash: z.coerce.number().min(1, "Opening cash is required"),
  counter_cash: z.coerce.number().min(1, "Counter cash is required"),
  expense: z.coerce.number().min(0, "Expense must be non-negative"),
  upi_cash: z.coerce.number().min(1, "UPI cash is required"),
  card_cash: z.coerce.number().min(1, "Card cash is required"),
});

const Page = () => {
  const { data: dailyData, isLoading } = useDailyData();

  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [_id, set_id] = useState<string>("");
  const [progress, setProgress] = React.useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
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
  });
  console.log(errors);

  const handleEdit = (_id: string, action: "view" | "edit") => {
    setOpen(true);
    set_id(_id);
    setIsEdit(action === "edit");
    const toBeEdited = dailyData?.data?.find(function (item: DailyDataItem) {
      return item._id === _id;
    });
    reset({
      date: toBeEdited?.date,
      closing_cash: toBeEdited?.closing_cash,
      opening_cash: toBeEdited?.opening_cash,
      counter_cash: toBeEdited?.counter_cash,
      expense: toBeEdited?.expense,
      upi_cash: toBeEdited?.upi_cash,
      card_cash: toBeEdited?.card_cash,
    });
  };

  const { mutate: toBeDeleted } = useDailyDelete();
  const handleDelete = (_id: string) => {
    console.log(_id);
    toBeDeleted(_id);
  };

  const { mutate } = useDailyDataEdit();
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(
      { ...data, _id },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

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
  const columns = Data_column(handleEdit, handleDelete);

  return (
    <div className=" w-[100%] flex flex-col items-start bg-fill_bg p-2">
      <ComponentHeader
        className="w-full px-3"
        title={"Add Daily Sales Report"}
        description={
          "Record today’s sales data to keep your reports accurate and up to date."
        }
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent  className="max-w-[425px] h-[600px] pb-0 overflow-auto side_bar lg:w-[900px]">
          <DialogHeader className="flex flex-col  gap-1 pb-0">
            <DialogTitle>Update Daily Sales Report</DialogTitle>
            <DialogDescription>
              Make changes to your report here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid pt-0 mt-0 gap-4">
              <div className="grid ">
                <Label htmlFor="date"><Badge variant="destructive">{watch("date")}</Badge></Label>
                <Input className="cursor-not-allowed hidden placeholder:text-black" disabled id="date" {...register("date")} />
                <p>{errors.date?.message}</p>
              </div>
            <div className="grid grid-cols-2 gap-3">
              
              <div className="grid gap-3">
                <Label htmlFor="opening_cash">Opening Cash</Label>
                <Input
                  disabled={!isEdit}
                  id="opening_cash"
                  {...register("opening_cash")}
                />
                <p>{errors.opening_cash?.message}</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="counter_cash">Counter Cash</Label>
                <Input
                  disabled={!isEdit}
                  id="counter_cash"
                  {...register("counter_cash")}
                />
                <p>{errors.counter_cash?.message}</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="expense">Expense</Label>
                <Input disabled={!isEdit} id="expense" {...register("expense")} />
                <p>{errors.expense?.message}</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="upi_cash">Upi Cash</Label>
                <Input
                  disabled={!isEdit}
                  id="upi_cash"
                  {...register("upi_cash")}
                />
                <p>{errors.upi_cash?.message}</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="card_cash">Card Cash</Label>
                <Input
                  disabled={!isEdit}
                  id="card_cash"
                  {...register("card_cash")}
                />
                <p>{errors.card_cash?.message}</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="closing_cash">Closing Cash</Label>
                <Input
                  disabled={!isEdit}
                  id="closing_cash"
                  {...register("closing_cash")}
                />
                <p>{errors.closing_cash?.message}</p>
              </div>
            </div>

            {isEdit && (
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            )}
          </form>
        </DialogContent>
      </Dialog>

      <DataTable
      url={'/daily-sale/add'}
        EnableDialog={true}
        ButtonTitle={"Add Daily payment"}
        columns={columns}
        data={dailyData?.data || []}
        title="Daily Sales"
      />
    </div>
  );
};

export default Page;

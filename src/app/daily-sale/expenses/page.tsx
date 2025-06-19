"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import * as XLSX from "xlsx";
import { format } from "date-fns";

import ComponentHeader from "@/components/ComponentHeader";
import { DataTableDemo, IExpense } from "@/components/table_";
import {
  useExpense,
  useExpenseDelete,
  useExpenseEdit,
  useExpensePost,
} from "@/hooks/use-expense";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@radix-ui/react-label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { expenceShemaZod, ExpenseshemaZod } from "./expenseShemaZod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { CgClose } from "react-icons/cg";
import { ExpenseColumns } from "@/components/expense_daywise_Columns";

type Grouped = Record<string, IExpense[]>;

const groupByDate = (expenses: IExpense[]) => {
  return expenses.reduce((acc, curr) => {
    const rawDate = new Date(curr.date);
    const formattedDate = format(rawDate, "yyyy-MM-dd");

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate].push(curr);
    return acc;
  }, {} as Grouped);
};

const exportToExcel = (
  grouped: Grouped,
  fileName: string = "expenses.xlsx"
) => {
  const rows: {
    date: string;
    category: string;
    description: string;
    amount: number | string;
  }[] = [];

  let grandTotal = 0;

  Object.entries(grouped).forEach(([date, items]) => {
    let dailyTotal = 0;

    items.forEach((item, index) => {
      dailyTotal += item.amount ?? 0;
      grandTotal += item.amount ?? 0;

      rows.push({
        date: index === 0 ? date : "", // Only show date for the first entry
        category: item.category,
        description: item?.description ?? "",
        amount: item.amount,
      });
    });

    // Add daily total row
    rows.push({
      date: "",
      category: "",
      description: "Daily Total",
      amount: dailyTotal,
    });

    // Optional: Add empty row between days for readability
    rows.push({ date: "", category: "", description: "", amount: "" });
  });

  // Add grand total row at the end
  rows.push({
    date: "Grand Total",
    category: "",
    description: "",
    amount: grandTotal,
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
  XLSX.writeFile(workbook, fileName);
};

const Page = () => {
  const { data: expenseData, isLoading } = useExpense();
  console.log(expenseData);
  const [open, setOpen] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [toBeedited, setToBeEdited] = useState<IExpense | null>(null);

  const defaultValues = {
    category: "",
    description: "",
    amount: 0,
  };
  const form = useForm<ExpenseshemaZod>({
    resolver: zodResolver(expenceShemaZod),
    defaultValues: defaultValues,
  });

  const [progress, setProgress] = useState(10);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IExpense[]>();
  const [groupedData, setGroupedData] = useState<Grouped>();
  const [calOpen, setCalOpen] = useState(false);

  const handleGlobalFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setGlobalFilter(value);

    const filtered =
      expenseData?.data?.filter((item: IExpense) =>
        item.date.toLowerCase().includes(value.toLowerCase())
      ) ?? [];

    setFilteredData(filtered);
  };

  useEffect(() => {
    const grouped = groupByDate(filteredData ?? expenseData?.data ?? []);
    setGroupedData(grouped);
  }, [filteredData, expenseData?.data]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 200);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const { mutate: expencePost } = useExpensePost();
  const { mutate: expenceEdit } = useExpenseEdit();
  const onSubmit = (data: ExpenseshemaZod) => {
    console.log(data);
    if (!toBeedited || toBeedited === null) {
      expencePost(
        {
          date: date ? date.toISOString() : "",
          ...data,
        },
        {
          onSuccess: () => {
            form.reset(defaultValues);
            setOpen(false);
            setToBeEdited(null);
          },
        }
      );
    }
   
    expenceEdit(
      
      {
        date: toBeedited?.date ? new Date(toBeedited.date).toISOString() : "",
        id: toBeedited?._id,
        ...data,
      },
      {
        onSuccess: () => {
          form.reset(defaultValues);
          setOpen(false);
          setToBeEdited(null);
          setDate(new Date());
        },
      }
    );
  };
  // Define stub handlers with proper types

  const handleEdit = (id: string) => {
    const toBeEditedd = expenseData?.data?.find(
      (item: IExpense) => item._id === id
    );
    console.log(toBeEditedd);
    setToBeEdited(toBeEditedd);
    setDate(toBeEditedd?.date ? new Date(toBeEditedd.date) : new Date());

    console.log(id);
    setOpen(true);
    form.reset({
      category: toBeEditedd.category ?? "",
      description: toBeEditedd.description ?? "",
      amount: toBeEditedd.amount ?? 0,
    });
  };

  const ExpenseDelete = useExpenseDelete();
  const handleDelete = (id: string) => {
    console.log(id);
    ExpenseDelete.mutate(id);
  };
  const columns = ExpenseColumns({ handleEdit, handleDelete });

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
    <div className="w-full flex flex-col items-start bg-fill_bg p-2">
      <ComponentHeader
        className="w-full px-3"
        title={"Day Wise Expense Report"}
        description={
          "Record daily expense data to keep your reports accurate and up to date."
        }
      />
      <div className="px-3 w-full">
        <div className=" w-full flex py-3 ">
          <div className="flex items-center gap-3 justify-between w-1/2">
            <div className="w-1/3 ">
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                variant={"outline"}
                className="w-full hover:bg-blue-600 rounded-2xl border-none shadow-none bg-white text-[#595959] hover:text-white active:text-white">
                <Plus /> Add Expense
              </Button>
            </div>
            <div className="relative w-full ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8C8C8C]" />
              <Input
                placeholder="Search..."
                value={globalFilter}
                onChange={handleGlobalFilterChange}
                className="pl-10 w-full rounded-2xl border-none shadow-none bg-white placeholder:text-[#8C8C8C]"
              />
            </div>
          </div>

          <div className=" flex justify-end w-1/2">
            <Button
              onClick={() => exportToExcel(groupedData ?? {}, "expenses.xlsx")}
              variant="outline"
              className=" w-1/2 hover:bg-blue-600 rounded-2xl border-none shadow-none bg-white text-[#595959] hover:text-white active:text-white">
              Export to Excel
            </Button>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[425px] p-3 overflow-auto side_bar lg:w-[900px]">
            <DialogHeader className="flex flex-col  gap-1 pb-0">
              <DialogTitle>Update Daily Sales Report</DialogTitle>
              <DialogDescription>
                Make changes to your report here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Badge
                className=" cursor-pointer"
                onClick={() => setCalOpen(!calOpen)}
                variant={"default"}>
                {date ? date.toLocaleDateString("en-GB") : "Select Date"}
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
                      onSelect={(selectedDate: Date | undefined) => {
                        if (
                          selectedDate instanceof Date &&
                          !isNaN(selectedDate.getTime())
                        ) {
                          setDate(selectedDate);
                          setCalOpen(false);
                        }
                      }}
                      className="mt-4"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    placeholder="Category"
                    id="category"
                    {...(form.register("category") || "")}
                  />
                  <p className=" text-red-600 font-light text-sm">
                    {form.formState.errors.category?.message}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    placeholder="Description"
                    id="description"
                    {...(form.register("description") || "")}
                  />
                  <p className=" text-red-600 font-light text-sm">
                    {form.formState.errors.description?.message}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Amount"
                    {...(form.register("amount") || "")}
                  />
                  <p className=" text-red-600 font-light text-sm">
                    {form.formState.errors.amount?.message}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Accordion
          type="single"
          collapsible
          className="w-full bg-background p-3 rounded-2xl">
          {groupedData &&
            Object.entries(groupedData).map(([date, expenses]) => (
              <AccordionItem key={date} value={"item-" + date}>
                <AccordionTrigger className="">
                  <div className="w-full flex text-gray-600 justify-between">
                    <span className="font-bold">{date}</span>
                    <span className="font-bold">
                      Total Expense:{" "}
                      {expenses.reduce(
                        (total, expense) => total + (expense.amount ?? 0),
                        0
                      )}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <DataTableDemo columns={columns} data={expenses} />
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Page;

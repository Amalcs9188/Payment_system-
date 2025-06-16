import { IExpense } from "@/components/table_";


function groupByDate(expenses: IExpense[]) {
  return expenses?.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(curr);
    return acc;
  }, {} as Record<string, IExpense[]>);
}

export default groupByDate;
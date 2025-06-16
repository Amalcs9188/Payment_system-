import { IExpense } from "@/components/table_";
import { format } from "date-fns"; // make sure to install: npm install date-fns

function groupByDate(expenses: IExpense[]) {
  return expenses?.reduce((acc, curr) => {
    const rawDate = new Date(curr.date);
    const formattedDate = format(rawDate, "yyyy-MM-dd"); // → "14/06/2025"

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(curr);

    return acc;
  }, {} as Record<string, IExpense[]>);
}

export default groupByDate;
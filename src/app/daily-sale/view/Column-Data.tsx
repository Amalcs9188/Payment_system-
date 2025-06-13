import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Grid, Pencil, Trash } from "lucide-react";
import { Button } from "../../../components/ui/button";

export type salesMan = {
  _id: string;
};
export const Data_column = (
  handleEdit: (_id: string, action: "view" | "edit") => void,
  handleDelete: (_id: string) => void
): ColumnDef<salesMan>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "opening_cash",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Opening Cash
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "counter_cash",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Counter Cash
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "expense",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Expense
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "upi_cash",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Upi Cash
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "card_cash",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Card Cash
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "total_cash",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Total Cash
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "closing_cash",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Closing Cash
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "total_sales",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Total Sales
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "short_excess",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Short/Excess
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Actions",
    header: () => <h3>Actions</h3>,
    cell: ({ row }) => {
      const _id = row.original._id;

      return (
        <div className="flex gap-2">
          <div className="button-transition flex items-center">
            <Grid
              size={16}
              onClick={() => handleEdit(_id, "view")}
              className="hover:text-blue-500 cursor-pointer"
            />
          </div>
          <div className="button-transition flex items-center">
            <Pencil
              size={16}
              onClick={() => handleEdit(_id, "edit")}
              className="hover:text-yellow-500 cursor-pointer"
            />
          </div>
          <div className="button-transition flex items-center">
            <Trash
              size={16}
              onClick={() => handleDelete(_id)}
              className="hover:text-red-500 cursor-pointer"
            />
          </div>
        </div>
      );
    },
  },
];

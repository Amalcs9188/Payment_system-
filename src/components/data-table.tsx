"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { format } from "date-fns";
import { Plus, Search } from "lucide-react";
import React from "react";
import * as XLSX from "xlsx";
import { Button } from "./ui/button";

import { Input } from "./ui/input";
import {DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger, DropdownMenu } from "./ui/dropdown-menu";
import { Table ,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,} from "./ui/table";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  EnableDialog?: boolean;
  ButtonTitle?: string;
  openDialog?: () => void;
  defaultInVisibleColumns?: string[];
  url?:string
}

export function DataTable<TData, TValue, title, EnableDialog, ButtonTitle>({
  columns,
  data,
  title,
  EnableDialog = false,
  ButtonTitle,
  defaultInVisibleColumns,
  openDialog,
  url
}: DataTableProps<TData, TValue>) {
  console.log("Dialog", EnableDialog);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Helper function to safely extract column ID
  const getColumnId = (
    column: ColumnDef<TData, TValue>
  ): string | undefined => {
    // Try to get the ID directly
    if (column.id) return column.id;

    // Try to access accessorKey if it exists
    if ("accessorKey" in column && typeof column.accessorKey === "string") {
      return column.accessorKey;
    }

    // Return undefined if no ID could be determined
    return undefined;
  };



  
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      const initialState: VisibilityState = {};

      if (defaultInVisibleColumns) {
        // Create a set for faster lookup
        const visibleColumnsSet = new Set(defaultInVisibleColumns);

        // Initialize all columns as hidden first
        columns.forEach((column) => {
          // Safely get the column id
          const id = getColumnId(column);
          if (id) initialState[id] = false;
        });

        // Then set the default InVisible columns
        columns.forEach((column) => {
          const id = getColumnId(column);
          if (id && !visibleColumnsSet.has(id)) {
            initialState[id] = true;
          }
        });
      } else {
        // If no defaultVisibleColumns provided, show all columns
        columns.forEach((column) => {
          const id = getColumnId(column);
          if (id) initialState[id] = true;
        });
      }

      return initialState;
    });

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
      columnVisibility,
      sorting,
      // pagination: {
      //   pageIndex: 0,
      //   pageSize: 15, // Default page size
      // },
    },
  });


  // Calculate the range of rows shown on the current page
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getRowModel().rows.length;

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const handleExportExcel = () => {
    const visibleColumns = table
      .getAllColumns()
      .filter((col) => col.getIsVisible())

    // Get headers from column definitions
    const headers = visibleColumns.map((column) => {
      // Get the header content directly from the column
      const headerContent = column.columnDef.header;
      return typeof headerContent === "string" ? headerContent : column.id;
    });
    // Prepare data with styling
    const excelData = [
      // Headers row with styling
      headers.map((header) => ({
        v: header,
        t: "s",
        s: {
          font: { bold: true },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
          alignment: { horizontal: "center" },
        },
      })),
    ];

    // Data rows with styling
    table.getFilteredRowModel().rows.forEach((row) => {
      const rowData = visibleColumns.map((column) => {
        const cell = row
          .getAllCells()
          .find((cell) => cell.column.id === column.id);
        let value: string;

        // Handle date formatting for createdOn and modifiedOn
        if (column.id === "createdOn" || column.id === "modifiedOn") {
          if (cell?.getValue()) {
            try {
              const date = new Date(cell.getValue() as string);
              if (!isNaN(date.getTime())) {
                value = format(date, "dd-MM-yyyy");
              } else {
                value = "-";
              }
            } catch (e) {
              console.error("Error parsing date:", e);
              value = "-";
            }
          } else {
            value = "-";
          }
        } else {
          // For non-date columns, prefix with ' to force text format
          const cellValue = cell?.getValue();
          value = cellValue?.toString() ?? "-";
        }

        return {
          v: value,
          t: "s",
          s: {
            font: { bold: false },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
            alignment: { horizontal: "center" },
          },
        };
      });
      excelData.push(rowData);
    });

    // Create and download Excel file
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    ws["!cols"] = headers.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "table-data.xlsx");
  };

  return (
    <div className="rounded-xl w-full bg-fill_bg  px-2 pb-2">
        <div className="rounded-xl py-3 w-full  flex items-center bg-fill_bg justify-center">
        <div className="flex w-full items-center mx-[2px] justify-between">
          <div className="relative flex gap-2 items-center w-1/2">
            {EnableDialog && (
              <Link href={url ?? ""} >
                <Button
                 variant={"outline"}
                className="whitespace-nowrap rounded-2xl border-none hover:bg-blue-600 shadow-none bg-white text-[#595959]   hover:text-white active:text-white"
                onClick={openDialog}>
                  <Plus size={18}></Plus>
                  {ButtonTitle}
                </Button>
              </Link>
            )}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8C8C8C]" />
              <Input
                placeholder="Search..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10 rounded-2xl border-none shadow-none bg-white placeholder:text-[#8C8C8C]"
              />
              
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExportExcel}
              variant="outline"
              className="whitespace-nowrap hover:bg-blue-600 rounded-2xl border-none shadow-none bg-white text-[#595959]  hover:text-white active:text-white">
              Export to Excel
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-2xl border-none hover:bg-blue-600 shadow-none bg-white text-[#595959]  hover:text-white active:text-white">
                  Column Visibility
                </Button>   
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white rounded-2xl border-none shadow-2xl max-h-[50svh] scroll overflow-y-auto"
                onCloseAutoFocus={(e) => {
                  // Only prevent default for checkbox interactions
                  if (
                    !((e as FocusEvent).relatedTarget as HTMLElement)?.closest(
                      ".dropdown-item"
                    )
                  ) {
                    e.preventDefault();
                  }
                }}>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize rounded-xl m-1 dropdown-item"
                        checked={column.getIsVisible()}
                        onSelect={(e) => e.preventDefault()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }>
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-2 tableBorder    bg-white">
        <div className="text-black w-full text-m font-semibold mb-4">{title}</div>
        <div className="flex-1">
          <div className="rounded-md tableBorder border w-full">
            <div className="overflow-x-auto">
              <Table className="w-full table-auto">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className="text-left text-[#595959] bg-[#F3F8FB] border-[#f0f0f0] border-b-[1.5px] whitespace-nowrap px-6">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        className="text-center"
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="whitespace-nowrap text-left px-10 border-[#f0f0f0] border-b-[1.5px]">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {/* {table.getRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected. */}
              Showing {startRow}-{endRow} of {totalRows} row(s)
            </div>
            {/* <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="p-1 py-1 border rounded text-sm font-medium">
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size} className="text-sm font-medium">
              Row No : {size}
            </option>
          ))}
        </select> */}

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

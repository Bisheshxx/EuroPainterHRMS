import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/Profile.lib";
import { formatDate } from "@/lib/utils";

import { Receipt, Plus } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { createClient } from "../../../../../utils/supabase/client";
import { Database, Tables } from "../../../../../database.types";
import { useForm } from "react-hook-form";

// Define the form type
interface ExpenseForm {
  date: string;
  description: string;
  amount: string;
  vendor: string;
  receipt_number: string;
}

interface IProps {
  expenses: Tables<"expenses">[];
  setExpenses: Dispatch<
    SetStateAction<
      {
        amount: number | null;
        created_at: string;
        description: string | null;
        id: number;
        invoice_number: string | null;
        supplier: string | null;
      }[]
    >
  >;
}

export default function MaterialExpenses({ expenses, setExpenses }: IProps) {
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  //   const [expenses, setExpenses] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseForm>();

  const handleAddExpense = async (data: ExpenseForm) => {
    if (!data.description || !data.amount || !data.date) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const supabase = createClient();
    const body: Database["public"]["Tables"]["expenses"]["Insert"] = {
      description: data.description,
      amount: Number.parseFloat(data.amount),
      created_at: new Date().toISOString(),
      supplier: data.vendor,
      invoice_number: data.receipt_number,
    };
    const response = await supabase.from("expenses").insert([body]).select();
    console.log(response);
    if (response.data) {
      setExpenses([...expenses, ...response.data]);
    } else {
      toast.error(
        "There was an error saving the expense to the database. Displaying locally only."
      );
      // fallback for local display
      const expense = {
        id: Date.now(),
        description: data.description,
        amount: Number.parseFloat(data.amount),
        created_at: new Date().toISOString(),
        supplier: data.vendor,
        invoice_number: data.receipt_number,
      };
      setExpenses(prev => [...prev, expense]);
    }
    reset();
    setIsExpenseDialogOpen(false);
    toast("New expense has been added to the job.");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Material Expenses
            </CardTitle>
            <CardDescription>
              Additional expenses and materials for this job
            </CardDescription>
          </div>
          <Dialog
            open={isExpenseDialogOpen}
            onOpenChange={setIsExpenseDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Add a new material expense or cost to this job.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(handleAddExpense)}
                className="grid gap-4 py-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expense-date">Date *</Label>
                    <Input
                      id="expense-date"
                      type="date"
                      {...register("date", { required: true })}
                    />
                    {errors.date && (
                      <span className="text-red-500 text-xs">
                        Date is required
                      </span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="expense-amount">Amount *</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("amount", { required: true })}
                    />
                    {errors.amount && (
                      <span className="text-red-500 text-xs">
                        Amount is required
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="expense-description">Description *</Label>
                  <Input
                    id="expense-description"
                    placeholder="Enter expense description"
                    {...register("description", { required: true })}
                  />
                  {errors.description && (
                    <span className="text-red-500 text-xs">
                      Description is required
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expense-vendor">Supplier</Label>
                    <Input
                      id="expense-vendor"
                      placeholder="Supplier name"
                      {...register("vendor")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expense-receipt">Invoice Number</Label>
                    <Input
                      id="expense-receipt"
                      placeholder="Invoice number"
                      {...register("receipt_number")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsExpenseDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Add Expense
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses?.map(expense => (
              <TableRow key={expense.id}>
                <TableCell>{formatDate(expense.created_at)}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.supplier}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {expense.invoice_number}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(expense.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {expenses?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No expenses recorded for this job yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

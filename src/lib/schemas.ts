import { z } from "zod";

export const transactionFormSchema = z.object({
  transactionType: z.string().min(1, "Transaction type is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
});

import { transactionFormSchema } from "@/lib/schemas";
import { z } from "zod";

export interface BalanceCardType {
  id?: string;
  title?: string;
  icon?: string;
  balance?: number;
  balanceColor?: string;
  subtitle?: string;
}

export type FormData = z.infer<typeof transactionFormSchema>;
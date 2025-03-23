import { addTransaction, getUserTransactions } from "@/lib/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useAuth } from "./auth-context";

// Transaction schema (matching your form schema)
const transactionSchema = z.object({
  transactionType: z.string().min(1, "Transaction type is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
});

export type Transaction = z.infer<typeof transactionSchema> & {
  id: string;
  userId: string;
  timestamp: string;
};

interface TransactionContextType {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  addNewTransaction: (
    transaction: z.infer<typeof transactionSchema>
  ) => Promise<void>;
  loading: boolean;
  chartData: { category: string; expense: number }[];
}

const TransactionContext = createContext<TransactionContextType | null>(null);

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
}

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's transactions when component mounts or user changes
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser?.uid) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        const userTransactions = await getUserTransactions(currentUser.uid);
        setTransactions(userTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser?.uid]);

    const addNewTransaction = async (
      transactionData: z.infer<typeof transactionSchema>
    ) => {
      if (!currentUser?.uid) return;
      setLoading(true);
      const newTransaction: Transaction = {
        ...transactionData,
        id: crypto.randomUUID(),
        userId: currentUser.uid,
        timestamp: new Date().toISOString(),
      };

      try {
        await addTransaction(newTransaction);
        setTransactions((prev) => [...prev, newTransaction]);
      } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.transactionType === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.transactionType === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  // Generate chart data
  const chartData = React.useMemo(() => {
    const expensesByCategory: Record<string, number> = {};

    transactions
      .filter((t) => t.transactionType === "expense")
      .forEach((transaction) => {
        const { category, amount } = transaction;
        expensesByCategory[category] =
          (expensesByCategory[category] || 0) + amount;
      });

    return Object.entries(expensesByCategory).map(([category, expense]) => ({
      category,
      expense,
    }));
  }, [transactions]);

  const value: TransactionContextType = {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    addNewTransaction,
    loading,
    chartData,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

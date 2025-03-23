import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addTransaction, getUserTransactions } from "@/lib/firestore";
import { z } from "zod";
import { RootState } from "../index";

const transactionSchema = z.object({
  transactionType: z.string().min(1, "Transaction type is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export type Transaction = TransactionFormData & {
  id: string;
  userId: string;
  timestamp: string;
};

type ChartDataPoint = {
  category: string;
  expense: number;
};

interface TransactionState {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  chartData: ChartDataPoint[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  chartData: [],
  loading: false,
  error: null,
};

// Fetch user transactions thunk
export const fetchTransactionsAsync = createAsyncThunk(
  "transactions/fetchTransactions",
  async (userId: string | undefined, { rejectWithValue }) => {
    if (!userId) return [];

    try {
      const transactions = await getUserTransactions(userId);
      return transactions;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Add transaction thunk
export const addTransactionAsync = createAsyncThunk(
  "transactions/addTransaction",
  async (
    {
      userId,
      transactionData,
    }: {
      userId: string;
      transactionData: TransactionFormData;
    },
    { rejectWithValue },
  ) => {
    try {
      const newTransaction: Transaction = {
        ...transactionData,
        id: crypto.randomUUID(),
        userId,
        timestamp: new Date().toISOString(),
      };

      await addTransaction(newTransaction);
      return newTransaction;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Calculate totals and chart data
const calculateDerivedState = (transactions: Transaction[]) => {
  // Calculate total income
  const totalIncome = transactions
    .filter((t) => t.transactionType === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  // Calculate total expense
  const totalExpense = transactions
    .filter((t) => t.transactionType === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  // Calculate balance
  const balance = totalIncome - totalExpense;

  // Generate chart data
  const expensesByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.transactionType === "expense")
    .forEach((transaction) => {
      const { category, amount } = transaction;
      expensesByCategory[category] =
        (expensesByCategory[category] || 0) + amount;
    });

  const chartData = Object.entries(expensesByCategory).map(
    ([category, expense]) => ({
      category,
      expense,
    }),
  );

  return { totalIncome, totalExpense, balance, chartData };
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsAsync.fulfilled, (state, action) => {
        state.transactions = action.payload;
        // Calculate derived state
        const derived = calculateDerivedState(action.payload);
        state.totalIncome = derived.totalIncome;
        state.totalExpense = derived.totalExpense;
        state.balance = derived.balance;
        state.chartData = derived.chartData;
        state.loading = false;
      })
      .addCase(fetchTransactionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add transaction
      .addCase(addTransactionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransactionAsync.fulfilled, (state, action) => {
        // Add new transaction to state
        state.transactions.push(action.payload);
        // Recalculate derived state
        const derived = calculateDerivedState(state.transactions);
        state.totalIncome = derived.totalIncome;
        state.totalExpense = derived.totalExpense;
        state.balance = derived.balance;
        state.chartData = derived.chartData;
        state.loading = false;
      })
      .addCase(addTransactionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setLoading, clearError, clearTransactions } =
  transactionSlice.actions;

// Selectors
export const selectTransactions = (state: RootState) =>
  state.transactions.transactions;
export const selectTotalIncome = (state: RootState) =>
  state.transactions.totalIncome;
export const selectTotalExpense = (state: RootState) =>
  state.transactions.totalExpense;
export const selectBalance = (state: RootState) => state.transactions.balance;
export const selectChartData = (state: RootState) =>
  state.transactions.chartData;
export const selectTransactionsLoading = (state: RootState) =>
  state.transactions.loading;

export default transactionSlice.reducer;

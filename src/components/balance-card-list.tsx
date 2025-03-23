import { useAppSelector } from "@/store";
import BalanceCard from "./balance-card";
import {
  selectBalance,
  selectTotalExpense,
  selectTotalIncome,
} from "@/store/slices/transactionSlice";

export default function BalanceCardList() {
  const totalIncome = useAppSelector(selectTotalIncome);
  const totalExpense = useAppSelector(selectTotalExpense);
  const balance = useAppSelector(selectBalance);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <BalanceCard
        title="Income"
        icon="arrowUp"
        balance={totalIncome}
        balanceColor="text-green-500"
      />
      <BalanceCard
        title="Expenses"
        icon="arrowDown"
        balance={totalExpense}
        balanceColor="text-red-500"
      />
      <BalanceCard
        title="Current Balance"
        icon="wallet"
        balance={balance}
        balanceColor={balance >= 0 ? "text-green-500" : "text-red-500"}
      />
    </div>
  );
}

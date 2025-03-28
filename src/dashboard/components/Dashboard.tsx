import BalanceCardList from "@/accounts/components/balance-card-list";
import ExpenseChart from "@/reporting/components/expense-chart";
import Header from "@/shared/components/header";
import TransactionFormContainer from "@/transactions/components/transaction-form/form-container";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-10 font-nunito">
      <Header />
      <main className="flex flex-col gap-10">
        <BalanceCardList />
        <div className="flex flex-col gap-10 text-center md:text-left md:flex-row md:justify-between">
          <ExpenseChart />
          <TransactionFormContainer />
        </div>
      </main>
    </div>
  );
}

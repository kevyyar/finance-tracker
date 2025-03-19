import BalanceCardList from "./components/balance-card-list";
import Header from "./components/header";
import "./App.css";
import TransactionForm from "./components/transaction-form";
import ExpenseChart from "./components/expense-chart";

function App() {
  return (
    <div className="container mx-auto p-10 font-nunito">
      <Header />
      <main className="flex flex-col gap-10">
        <BalanceCardList />
        <div className="flex flex-col gap-10 text-center md:text-left md:flex-row md:justify-between">
          <ExpenseChart />
          <TransactionForm />
        </div>
      </main>
    </div>
  );
}

export default App;

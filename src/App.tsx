import BalanceCardList from "./components/balance-card-list";
import Header from "./components/header";
import "./App.css";
import TransactionForm from "./components/transaction-form";

function App() {
  return (
    <div className="container mx-auto p-10 font-nunito">
      <Header />
      <main className="mt-10">
        <BalanceCardList />
        <div>
          <TransactionForm />
        </div>
      </main>
    </div>
  );
}

export default App;

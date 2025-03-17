import BalanceCardList from "./components/balance-card-list";
import Header from "./components/header";
import "./App.css";

function App() {
  return (
    <div className="container mx-auto p-10 font-nunito">
      <Header />
      <main className="mt-10">
        <BalanceCardList />
      </main>
    </div>
  );
}

export default App;

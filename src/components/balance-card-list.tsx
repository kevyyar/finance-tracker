import { financeData } from "@/constants";
import BalanceCard from "./balance-card";

export default function BalanceCardList() {
  return (
    <section className="flex flex-col gap-6 md:flex-row md:justify-center">
      {financeData.map((card) => (
        <BalanceCard
          key={card.title}
          title={card.title}
          icon={card.icon}
          balance={card.balance}
          balanceColor={card.balanceColor}
          subtitle={card.subtitle}
        />
      ))}
    </section>
  );
}

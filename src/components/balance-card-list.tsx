import { BalanceCardType } from "@/types";
import BalanceCard from "./balance-card";

export default function BalanceCardList({
  balances,
}: {
  balances: BalanceCardType[];
}) {
  return (
    <section className="flex flex-col gap-6 md:flex-row md:justify-center">
      {balances.map((card: BalanceCardType) => (
        <BalanceCard
          id={card.id}
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

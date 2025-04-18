import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { BalanceCardType } from "@/types";
import { ArrowDown, ArrowUp, LucideIcon, Wallet } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  wallet: Wallet,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
};

export default function BalanceCard({
  title,
  icon = "wallet",
  balance = 0,
  balanceColor = "text-black",
  subtitle = "Current balance",
}: BalanceCardType) {
  const IconComponent = iconMap[icon];
  const displayBalance =
    typeof balance === "number" && !isNaN(balance) ? balance : 0;

  return (
    <Card className="w-full border-gray-300 shadow-md">
      <CardHeader className="flex justify-betweenflex items-center justify-between">
        <CardTitle className="font-bold text-xl">{title}</CardTitle>
        <CardDescription>
          <IconComponent
            size={20}
            color={icon === "arrowUp" ? "#11B981" : "#F43F5E"}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className={cn("text-4xl font-black", balanceColor)}>
          ${displayBalance.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="mt-[-20px]">
        <p>{subtitle}</p>
      </CardFooter>
    </Card>
  );
}

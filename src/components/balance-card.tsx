import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, LucideIcon, Wallet } from "lucide-react";

interface BalanceCardProps {
  title: string;
  icon: string;
  balance: number;
  balanceColor?: string;
  subtitle?: string;
}

const iconMap: Record<string, LucideIcon> = {
  wallet: Wallet,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
};

export default function BalanceCard({
  title,
  icon,
  balance,
  balanceColor = "text-black",
  subtitle = "Current balance",
}: BalanceCardProps) {
  const IconComponent = iconMap[icon];

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
          ${balance.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="mt-[-20px]">
        <p>{subtitle}</p>
      </CardFooter>
    </Card>
  );
}

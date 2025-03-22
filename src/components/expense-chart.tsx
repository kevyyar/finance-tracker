import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTransactions } from "@/contexts/transaction-context";
import React from "react";
import { Label, Pie, PieChart } from "recharts";

const getColorIndex = (category: string) => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 5) + 1;
};

export default function ExpenseChart() {
  const { totalExpense, chartData } = useTransactions();

  const chartConfig = React.useMemo(
    () => ({
      expense: { label: "Expenses" },
      ...chartData.reduce(
        (acc, { category }) => ({
          ...acc,
          [category]: {
            label: category.charAt(0).toUpperCase() + category.slice(1),
          },
        }),
        {}
      ),
    }),
    [chartData]
  );

  return (
    <Card className="flex flex-col md:w-1/2 border-gray-300 p-6 rounded-lg shadow-md h-3/4">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-4xl font-bold">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="bg-white" />}
            />
            <Pie
              data={chartData.map((entry) => ({
                ...entry,
                fill: `hsl(var(--chart-${getColorIndex(entry.category)}))`,
              }))}
              dataKey="expense"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                    return null;
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan className="fill-foreground text-3xl font-bold">
                        ${totalExpense.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Expenses
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total expenses for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}

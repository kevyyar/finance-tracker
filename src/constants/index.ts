export const financeData = [
  {
    id: crypto.randomUUID(),
    title: "Total Balance",
    icon: "wallet",
    balance: 1000,
  },
  {
    id: crypto.randomUUID(),
    title: "Income",
    subtitle: "Total Income",
    icon: "arrowUp",
    balance: 3500,
    balanceColor: "text-green-400",
  },
  {
    id: crypto.randomUUID(),
    title: "Expenses",
    subtitle: "Total Expenses",
    icon: "arrowDown",
    balance: 2500,
    balanceColor: "text-red-400",
  },
];

export const transactionCategories = [
  { id: crypto.randomUUID(), title: "Housing" },
  { id: crypto.randomUUID(), title: "Food" },
  { id: crypto.randomUUID(), title: "Transportation" },
  { id: crypto.randomUUID(), title: "Utilities" },
  { id: crypto.randomUUID(), title: "Entertainment" },
  { id: crypto.randomUUID(), title: "Bills" },
  { id: crypto.randomUUID(), title: "Shopping" },
  { id: crypto.randomUUID(), title: "Health" },
  { id: crypto.randomUUID(), title: "Other" },
];

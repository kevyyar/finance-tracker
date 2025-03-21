import { useForm, Field } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { z } from "zod";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { transactionCategories } from "@/constants";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

const formSchema = z.object({
  transactionType: z.string().min(1, "Transaction type is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
});

export default function TransactionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      transactionType: "",
      description: "",
      amount: 0,
      category: "",
      date: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col gap-6 border border-gray-300 p-6 rounded-lg shadow-md md:w-1/2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h4 className="text-4xl font-bold">Add Transaction</h4>
        <FormField
          control={form.control}
          name="transactionType"
          render={({ field }: Field) => (
            <FormItem>
              <FormLabel className="font-black">Transaction Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Expense" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }: Field) => (
            <FormItem>
              <FormLabel className="font-black">Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Description" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }: Field) => (
            <FormItem>
              <FormLabel className="font-black">Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="Amount" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }: Field) => (
            <FormItem>
              <FormLabel className="font-black">Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {transactionCategories.map((category) => (
                      <SelectItem value={category.title} key={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }: Field) => (
            <FormItem>
              <FormLabel className="font-black">Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? date.toISOString() : "");
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="bg-black text-white hover:bg-gray-800 transition-colors">
          Add Transaction
        </Button>
      </form>
    </Form>
  );
}

import { transactionCategories } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormData } from "@/types";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

interface TransactionFormUIProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

interface FieldProps {
  field: {
    onChange: (e: string | ChangeEvent<HTMLInputElement>) => void;
    value: string;
  };
}

interface NumberFieldProps {
  field: {
    onChange: (value: number) => void;
    value: number;
  };
}


export default function TransactionFormUI({
  onSubmit,
  loading,
}: TransactionFormUIProps) {
  const form = useFormContext<FormData>();
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
          render={({ field }: FieldProps) => (
            <FormItem>
              <FormLabel className="font-black">Transaction Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "expense"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
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
          render={({ field }: FieldProps) => (
            <FormItem>
              <FormLabel className="font-black">Description</FormLabel>
              <FormControl>
                <Input
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  value={field.value}
                  placeholder="Description"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }: NumberFieldProps) => (
            <FormItem>
              <FormLabel className="font-black">Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={field.value || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.valueAsNumber;
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                  placeholder="Amount"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }: FieldProps) => (
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
          render={({ field }: FieldProps) => (
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
                      onSelect={(date: Date | undefined) => {
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
        <Button
          className={cn(
            "bg-black text-white hover:bg-gray-800 transition-colors",
            loading ? "bg-gray-500" : "",
          )}
          disabled={loading}
        >
          {loading ? "Adding Transaction..." : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
}

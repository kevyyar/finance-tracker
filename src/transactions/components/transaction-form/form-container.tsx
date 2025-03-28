import { useAppDispatch, useAppSelector } from "@/core/hooks/useRedux";
import { addTransactionAsync } from "@/store/slices/transactionSlice";
import { FormData } from '@/types';
import { FormProvider, useForm } from "react-hook-form";
import TransactionFormUI from "./form-ui";

export default function TransactionFormContainer() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.transactions);
  const { currentUser } = useAppSelector((state) => state.auth);

  const form = useForm<FormData>({
    defaultValues: {
      transactionType: "expense",
      description: "",
      amount: 0,
      category: "",
      date: "",
    },
  });

  const handleSubmit = async (values: FormData) => {
    if (!currentUser) return;

    await dispatch(
      addTransactionAsync({
        userId: currentUser.uid,
        transactionData: values,
      }),
    );

    form.reset({
      transactionType: "expense",
      description: "",
      amount: 0,
      category: "",
      date: "",
    });
  };

  return (
    <FormProvider {...form}>
      <TransactionFormUI
        onSubmit={handleSubmit}
        loading={loading}
      />
    </FormProvider>
  );
}

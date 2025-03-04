import { useState } from "react";
import { useForm, UseFormReturn, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface UseFormManagementProps<T> {
  schema: z.ZodSchema<T>;
  defaultValues: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
}

interface UseFormManagementReturn<T> {
  form: UseFormReturn<T>;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  handleSubmit: (data: T) => Promise<void>;
}

export function useFormManagement<T>({
  schema,
  defaultValues,
  onSubmit,
}: UseFormManagementProps<T>): UseFormManagementReturn<T> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      await onSubmit(data);

      setSuccess(true);
      form.reset(defaultValues as DefaultValues<T>);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    error,
    success,
    handleSubmit,
  };
}
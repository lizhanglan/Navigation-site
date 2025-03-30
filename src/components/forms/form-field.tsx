"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/ui/common/input";
import { Textarea } from "@/ui/common/textarea";
import type { FormInputs } from "@/lib/types";

interface FormFieldProps {
  label: string;
  name: keyof FormInputs;
  form: UseFormReturn<FormInputs>;
  placeholder?: string;
  textarea?: boolean;
}

export function FormField({
  label,
  name,
  form,
  placeholder,
  textarea,
}: FormFieldProps) {
  const Component = textarea ? Textarea : Input;

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-foreground/80">
        {label}
      </label>
      <Component
        {...form.register(name)}
        placeholder={placeholder}
        className={`w-full bg-background/50 backdrop-blur-sm border-border/40 hover:bg-background/70 hover:border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 
          ${textarea ? "min-h-[100px] resize-y" : "h-10"}`}
      />
      {form.formState.errors[name] && (
        <p className="text-sm text-red-500/70 mt-1">
          {form.formState.errors[name]?.message}
        </p>
      )}
    </div>
  );
}

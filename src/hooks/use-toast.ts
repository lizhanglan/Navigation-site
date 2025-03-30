"use client";

import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  className?: string;
}

function toast({ title, description, variant = "default", className }: ToastProps) {
  return sonnerToast[variant === "destructive" ? "error" : "success"](title, {
    description,
    className,
  });
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast, toast };

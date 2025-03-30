"use client";

import { Loader2 } from "lucide-react";

interface FallbackProps {
  className?: string;
  message?: string;
}

export default function Fallback({ className = "", message = "加载中..." }: FallbackProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

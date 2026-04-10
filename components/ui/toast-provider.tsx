"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type Toast = {
  id: number;
  message: string;
  variant: "success" | "error";
};

type ToastContextType = {
  showToast: (message: string, variant?: Toast["variant"]) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: Toast["variant"] = "success") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[92vw] max-w-sm flex-col gap-2 sm:right-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-fade-up rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-xl ${
              toast.variant === "success"
                ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                : "border-red-400/30 bg-red-500/15 text-red-100"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

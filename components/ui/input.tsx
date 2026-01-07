"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, id, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(false);
        const generatedId = React.useId();
        const inputId = id || generatedId;

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            props.onBlur?.(e);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            props.onFocus?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
        };

        return (
            <div className="relative w-full mb-1">
                <div className="relative">
                    <input
                        id={inputId}
                        type={type}
                        className={cn(
                            "flex h-12 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                            (isFocused || hasValue) ? "pt-5 pb-1" : "py-3",
                            error && "border-red-500/50 focus-visible:ring-red-500/50",
                            className
                        )}
                        ref={ref}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        {...props}
                    />
                    {label && (
                        <motion.label
                            htmlFor={inputId}
                            initial={false}
                            animate={{
                                top: isFocused || hasValue ? "0.4rem" : "0.9rem",
                                fontSize: isFocused || hasValue ? "0.7rem" : "0.875rem",
                                color: isFocused ? "var(--primary)" : "var(--muted-foreground)",
                            }}
                            className="absolute left-3 pointer-events-none font-medium transition-all duration-200"
                            {...({} as any)}
                        >
                            {label}
                        </motion.label>
                    )}
                </div>
                {error && (
                    <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(false);
        const generatedId = React.useId();
        const textareaId = id || generatedId;

        const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            props.onBlur?.(e);
        };

        const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
            setIsFocused(true);
            props.onFocus?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
        };

        return (
            <div className="relative w-full mb-1">
                <div className="relative">
                    <textarea
                        id={textareaId}
                        className={cn(
                            "flex min-h-[120px] w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm ring-offset-background placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none",
                            (isFocused || hasValue) ? "pt-6 pb-2" : "py-3",
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
                            htmlFor={textareaId}
                            initial={false}
                            animate={{
                                top: isFocused || hasValue ? "0.5rem" : "1rem",
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
Textarea.displayName = "Textarea";

export { Textarea };

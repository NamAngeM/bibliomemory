import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm transition-colors',
                    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                    'placeholder:text-slate-400',
                    'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';

export { Input };

'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
    default: { bg: 'bg-zinc-800/50', border: 'border-zinc-700', icon: Info },
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle2 },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle },
    error: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertCircle },
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Info },
};

const textColors: Record<AlertVariant, string> = {
    default: 'text-zinc-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
    info: 'text-blue-400',
};

export function Alert({
    variant = 'default',
    title,
    children,
    dismissible,
    onDismiss,
    className
}: AlertProps) {
    const { bg, border, icon: Icon } = variantStyles[variant];

    return (
        <div className={cn(
            'relative flex gap-3 rounded-lg border p-4',
            bg, border,
            className
        )}>
            <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', textColors[variant])} />
            <div className="flex-1">
                {title && (
                    <h5 className={cn('font-medium mb-1', textColors[variant])}>
                        {title}
                    </h5>
                )}
                <div className="text-sm text-zinc-400">{children}</div>
            </div>
            {dismissible && onDismiss && (
                <button
                    onClick={onDismiss}
                    className="absolute top-3 right-3 p-1 rounded-md hover:bg-white/10 transition-colors"
                >
                    <X className="h-4 w-4 text-zinc-500" />
                </button>
            )}
        </div>
    );
}

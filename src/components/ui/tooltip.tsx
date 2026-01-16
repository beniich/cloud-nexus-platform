import * as React from "react";

interface TooltipProviderProps {
    children: React.ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
    return <>{children}</>;
};

export const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};

export const TooltipTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
    return <button ref={ref} {...props}>{children}</button>;
});
TooltipTrigger.displayName = "TooltipTrigger";

export const TooltipContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={`z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
});
TooltipContent.displayName = "TooltipContent";

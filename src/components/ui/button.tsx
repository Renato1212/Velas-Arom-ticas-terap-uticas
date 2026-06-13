"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-wide transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-espresso text-cream-100 hover:bg-accent-dark shadow-soft hover:shadow-premium",
        accent:
          "bg-accent text-cream-100 hover:bg-accent-dark shadow-soft hover:shadow-premium",
        outline:
          "border border-ink/30 bg-transparent text-ink hover:border-espresso hover:bg-espresso hover:text-cream-100",
        ghost: "text-ink hover:bg-sand/40",
        light:
          "bg-cream-100 text-espresso hover:bg-white shadow-soft hover:shadow-premium",
        link: "text-accent underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-10 px-5 text-xs uppercase tracking-luxe",
        default: "h-12 px-8 text-xs uppercase tracking-luxe",
        lg: "h-14 px-10 text-xs uppercase tracking-luxe",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

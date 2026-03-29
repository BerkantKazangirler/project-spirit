import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "classnames";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-[#525252] focus-visible:ring-[#525252]/50 focus-visible:ring-[3px] aria-invalid:ring-[#82181a]/20 dark:aria-invalid:ring-[#82181a]/40 aria-invalid:border-[#82181a] transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#fafafa] text-[#171717] [a&]:hover:bg-[#fafafa]/90",
        secondary:
          "border-transparent bg-[#262626] text-[#fafafa] [a&]:hover:bg-[#262626]/90",
        destructive:
          "border-transparent bg-[#82181a] text-white [a&]:hover:bg-[#82181a]/90 focus-visible:ring-[#82181a]/20 dark:focus-visible:ring-[#82181a]/40 dark:bg-[#82181a]/60",
        outline:
          "text-[#fafafa] [a&]:hover:bg-[#262626] [a&]:hover:text-[#fafafa]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

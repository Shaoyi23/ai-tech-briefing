import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full bg-secondary",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({
  alt,
  className,
  ...props
}: React.ComponentProps<"img"> & { alt: string }) {
  return (
    <img
      alt={alt}
      className={cn("size-full object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center text-sm font-medium",
        className,
      )}
      {...props}
    />
  );
}

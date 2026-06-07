import * as React from "react";
import Image, { type ImageProps } from "next/image";
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
}: Omit<ImageProps, "width" | "height" | "alt"> & { alt: string }) {
  return (
    <Image
      alt={alt}
      className={cn("object-cover", className)}
      fill
      sizes="40px"
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

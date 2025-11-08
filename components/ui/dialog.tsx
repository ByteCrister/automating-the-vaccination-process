// src/components/ui/dialog.tsx
"use client";

import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Exports:
 *  - Dialog (Root)
 *  - DialogTrigger
 *  - DialogPortal
 *  - DialogOverlay
 *  - DialogContent
 *  - DialogHeader
 *  - DialogFooter
 *  - DialogTitle
 *  - DialogDescription
 *
 * Important behavior:
 *  - Overlay uses z-40 so content can sit above it.
 *  - Content uses z-50 and includes a safe opaque fallback bg (bg-white) while keeping bg-background token.
 *  - DialogPortal is used to render overlay + content at document body level.
 */

function Dialog(props: React.ComponentProps<typeof RadixDialog.Root>) {
  return <RadixDialog.Root {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof RadixDialog.Trigger>) {
  return <RadixDialog.Trigger {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof RadixDialog.Portal>) {
  return <RadixDialog.Portal {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof RadixDialog.Close>) {
  return <RadixDialog.Close {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof RadixDialog.Overlay>) {
  // overlay intentionally lower z so content can be above
  return (
    <RadixDialog.Overlay
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out " +
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof RadixDialog.Content> & { showCloseButton?: boolean }) {
  // Content has a guaranteed visible background fallback (bg-white) plus bg-background token.
  // z-50 ensures it sits above overlay. We keep the same utility-first classes your component expects.
  return (
    <DialogPortal>
      <DialogOverlay />
      <RadixDialog.Content
        className={cn(
          "bg-background bg-white data-[state=open]:animate-in data-[state=closed]:animate-out " +
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 " +
            "data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] " +
            "translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <RadixDialog.Close
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </RadixDialog.Close>
        )}
      </RadixDialog.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof RadixDialog.Title>) {
  return <RadixDialog.Title className={cn("text-lg leading-none font-semibold", className)} {...props} />;
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof RadixDialog.Description>) {
  return <RadixDialog.Description className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};

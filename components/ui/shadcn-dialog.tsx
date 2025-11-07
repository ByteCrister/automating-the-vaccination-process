import * as React from "react"

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                {children}
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
        </div>
    )
}

export function DialogContent({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-4">{children}</div>
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
    return <div className="flex justify-end gap-2 mt-6">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg font-semibold mb-2">{children}</h2>
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
    return <p className="text-gray-600 text-sm">{children}</p>
}

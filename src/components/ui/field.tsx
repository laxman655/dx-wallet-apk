import React from "react"
import { cn } from "@/lib/utils"

interface FieldProps extends React.ComponentProps<"div"> {
  label?: string
  error?: string
  helper?: string
  required?: boolean
}

function Field({ label, error, helper, required, children, className, ...props }: FieldProps) {
  return (
    <div className={cn("grid gap-2", className)} {...props}>
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-destructive text-xs">{error}</p>}
      {helper && !error && <p className="text-muted-foreground text-xs">{helper}</p>}
    </div>
  )
}

export { Field }

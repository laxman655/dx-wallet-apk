import React from "react"
import { cn } from "@/lib/utils"

interface ItemProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  active?: boolean
}

function Item({ title, description, icon, action, active, className, ...props }: ItemProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg border p-3 transition-colors", active && "bg-accent", className)} {...props}>
      {icon && <div className="text-muted-foreground shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        {description && <p className="text-muted-foreground text-xs truncate">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export { Item }

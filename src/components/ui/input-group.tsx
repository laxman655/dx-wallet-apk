import React from "react"
import { cn } from "@/lib/utils"

interface InputGroupProps extends React.ComponentProps<"div"> {
  startElement?: React.ReactNode
  endElement?: React.ReactNode
}

function InputGroup({ startElement, endElement, children, className, ...props }: InputGroupProps) {
  return (
    <div className={cn("relative flex items-center", className)} {...props}>
      {startElement && <div className="text-muted-foreground absolute left-3">{startElement}</div>}
      {children}
      {endElement && <div className="text-muted-foreground absolute right-3">{endElement}</div>}
    </div>
  )
}

export { InputGroup }

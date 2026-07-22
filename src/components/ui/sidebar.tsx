"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  children: React.ReactNode
  className?: string
  side?: "left" | "right"
}

function Sidebar({ children, className, side = "left" }: SidebarProps) {
  return (
    <aside className={cn("fixed top-0 bottom-0 z-40 w-64 bg-background border-r flex flex-col", side === "right" && "right-0 border-l border-r-0", className)}>
      {children}
    </aside>
  )
}

function SidebarHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-4 border-b", className)}>{children}</div>
}

function SidebarContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex-1 overflow-auto p-4", className)}>{children}</div>
}

function SidebarFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-4 border-t", className)}>{children}</div>
}

function SidebarGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("py-2", className)}>{children}</div>
}

function SidebarGroupLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider", className)}>{children}</div>
}

function SidebarMenu({ className, children }: { className?: string; children: React.ReactNode }) {
  return <nav className={cn("space-y-1", className)}>{children}</nav>
}

function SidebarMenuItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("", className)}>{children}</div>
}

function SidebarMenuButton({ className, children, asChild }: { className?: string; children: React.ReactNode; asChild?: boolean }) {
  const Comp = asChild ? React.Slot : "button"
  return <Comp className={cn("w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors", className)}>{children}</Comp>
}

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton }

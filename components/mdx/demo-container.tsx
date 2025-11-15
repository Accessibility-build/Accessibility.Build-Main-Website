import type React from "react"

interface DemoContainerProps {
  title?: string
  children: React.ReactNode
  code?: React.ReactNode
}

export function DemoContainer({ title, children, code }: DemoContainerProps) {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-border">
      {title && (
        <div className="border-b border-border bg-muted/50 px-4 py-2">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}
      <div className="p-4 bg-background">{children}</div>
      {code && (
        <div className="border-t border-border bg-muted/50 p-4">
          <div className="overflow-x-auto">{code}</div>
        </div>
      )}
    </div>
  )
}

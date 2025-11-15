"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function FocusVisibleDemo() {
  const [activeTab, setActiveTab] = useState("demo")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus Visible (Enhanced) Demo</CardTitle>
        <CardDescription>Compare poor and good focus indicators according to WCAG 2.2</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Interactive Demo</TabsTrigger>
            <TabsTrigger value="code">Code Example</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="text-center">
                  <Label className="text-destructive mb-2 block">Poor Focus Indicator</Label>
                  <div className="flex flex-col items-center gap-4">
                    <button
                      className={cn(
                        "px-4 py-2 bg-background border rounded",
                        "focus:outline-[1px] focus:outline-dotted focus:outline-gray-400",
                      )}
                    >
                      Button with Poor Focus
                    </button>
                    <span className="text-sm text-muted-foreground">Tab to focus (thin, low contrast outline)</span>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Issues:</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Outline is too thin (1px)</li>
                    <li>Low contrast against background</li>
                    <li>Difficult to see for low vision users</li>
                    <li>Fails WCAG 2.2 criterion 2.4.11</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <Label className="text-green-500 mb-2 block">Good Focus Indicator</Label>
                  <div className="flex flex-col items-center gap-4">
                    <button
                      className={cn(
                        "px-4 py-2 bg-background border rounded",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                      )}
                    >
                      Button with Good Focus
                    </button>
                    <span className="text-sm text-muted-foreground">Tab to focus (thick, high contrast ring)</span>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Benefits:</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Thick outline (2px ring + 2px offset)</li>
                    <li>High contrast against background</li>
                    <li>Clearly visible for all users</li>
                    <li>Passes WCAG 2.2 criterion 2.4.11</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Try using the Tab key to navigate between the buttons above to see the difference in focus styles.
            </div>
          </TabsContent>

          <TabsContent value="code" className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Poor Focus Indicator (Fails WCAG 2.2)</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`.button-poor:focus {
  outline: 1px dotted gray; /* Low contrast, thin outline */
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Good Focus Indicator (Passes WCAG 2.2)</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`.button-good:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #3b82f6; /* High contrast, thick outline */
}

/* Alternative using Tailwind CSS */
.button-good {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary;
}`}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

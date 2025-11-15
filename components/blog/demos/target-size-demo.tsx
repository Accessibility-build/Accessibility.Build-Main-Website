"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Trash, Pencil, Copy, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function TargetSizeDemo() {
  const [activeTab, setActiveTab] = useState("demo")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Target Size Demo</CardTitle>
        <CardDescription>Compare small and adequately sized interactive elements</CardDescription>
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
                <div>
                  <Label className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Small Target Size (Fails WCAG 2.2)
                  </Label>
                  <div className="flex justify-center gap-4">
                    <button className="w-4 h-4 bg-destructive rounded-full" aria-label="Delete (small target)" />
                    <button className="w-4 h-4 bg-amber-500 rounded-full" aria-label="Edit (small target)" />
                    <button className="w-4 h-4 bg-blue-500 rounded-full" aria-label="Copy (small target)" />
                  </div>
                  <div className="text-center text-sm text-muted-foreground mt-2">4×4 pixel targets</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Issues:</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Targets are too small (4×4 pixels)</li>
                    <li>Difficult to click accurately</li>
                    <li>Problematic for users with motor disabilities</li>
                    <li>Fails WCAG 2.2 criterion 2.5.8</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Adequate Target Size (Passes WCAG 2.2)
                  </Label>
                  <div className="flex justify-center gap-4">
                    <button
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-full",
                        "bg-destructive text-destructive-foreground",
                      )}
                      aria-label="Delete"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <button
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-full",
                        "bg-amber-500 text-white",
                      )}
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-full",
                        "bg-blue-500 text-white",
                      )}
                      aria-label="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-center text-sm text-muted-foreground mt-2">40×40 pixel targets</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Benefits:</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Targets are adequately sized (40×40 pixels)</li>
                    <li>Easy to click accurately</li>
                    <li>Accessible for users with motor disabilities</li>
                    <li>Passes WCAG 2.2 criterion 2.5.8 (minimum 24×24 pixels)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Try clicking on both sets of buttons to feel the difference in usability.
            </div>
          </TabsContent>

          <TabsContent value="code" className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Small Target Size (Fails WCAG 2.2)</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`// Poor implementation - targets too small
<button 
  className="w-4 h-4 bg-red-500 rounded-full" 
  aria-label="Delete"
/>

// Only 4×4 pixels - fails WCAG 2.2 criterion 2.5.8
// which requires at least 24×24 pixels`}
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Adequate Target Size (Passes WCAG 2.2)</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`// Good implementation - adequately sized targets
<button 
  className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-full" 
  aria-label="Delete"
>
  <TrashIcon className="h-4 w-4" />
</button>

// 40×40 pixels - passes WCAG 2.2 criterion 2.5.8
// which requires at least 24×24 pixels`}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function DraggingMovementsDemo() {
  const [activeTab, setActiveTab] = useState("demo")
  const [sliderValue, setSliderValue] = useState(50)

  const increment = () => setSliderValue((prev) => Math.min(prev + 10, 100))
  const decrement = () => setSliderValue((prev) => Math.max(prev - 10, 0))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dragging Movements Demo</CardTitle>
        <CardDescription>Compare inaccessible and accessible slider implementations</CardDescription>
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
                  <Label className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Inaccessible Slider (Drag Only)
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      value={[sliderValue]}
                      max={100}
                      step={1}
                      className="w-full"
                      onValueChange={(value) => setSliderValue(value[0])}
                    />
                    <div className="text-center text-sm">Value: {sliderValue}</div>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Issues:</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Only supports dragging interaction</li>
                    <li>Difficult for users with motor disabilities</li>
                    <li>No alternative input method</li>
                    <li>Fails WCAG 2.2 criterion 2.5.7</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Accessible Slider (Drag + Buttons)
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      value={[sliderValue]}
                      max={100}
                      step={1}
                      className="w-full"
                      onValueChange={(value) => setSliderValue(value[0])}
                    />
                    <div className="flex justify-between">
                      <Button onClick={decrement} variant="outline" size="sm" disabled={sliderValue <= 0}>
                        Decrease
                      </Button>
                      <div className="text-center text-sm py-2">Value: {sliderValue}</div>
                      <Button onClick={increment} variant="outline" size="sm" disabled={sliderValue >= 100}>
                        Increase
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Benefits:</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Supports both dragging and button interactions</li>
                    <li>Accessible for users with motor disabilities</li>
                    <li>Provides alternative input methods</li>
                    <li>Passes WCAG 2.2 criterion 2.5.7</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Try using both the slider and the buttons to adjust the values.
            </div>
          </TabsContent>

          <TabsContent value="code" className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Inaccessible Implementation (Fails WCAG 2.2)</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`// Only supports dragging
function InaccessibleSlider() {
  const [value, setValue] = useState(50);
  
  return (
    <div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value} 
        onChange={(e) => setValue(Number(e.target.value))} 
      />
      <div>Value: {value}</div>
    </div>
  );
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Accessible Implementation (Passes WCAG 2.2)</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`// Supports both dragging and button interactions
function AccessibleSlider() {
  const [value, setValue] = useState(50);
  
  const increment = () => setValue(prev => Math.min(prev + 10, 100));
  const decrement = () => setValue(prev => Math.max(prev - 10, 0));
  
  return (
    <div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value} 
        onChange={(e) => setValue(Number(e.target.value))} 
      />
      <div>Value: {value}</div>
      <div>
        <button onClick={decrement} disabled={value <= 0}>
          Decrease
        </button>
        <button onClick={increment} disabled={value >= 100}>
          Increase
        </button>
      </div>
    </div>
  );
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

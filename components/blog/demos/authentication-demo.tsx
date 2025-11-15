"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, AlertCircle, Fingerprint, Key } from "lucide-react"

export function AuthenticationDemo() {
  const [activeTab, setActiveTab] = useState("demo")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessible Authentication Demo</CardTitle>
        <CardDescription>Compare inaccessible and accessible authentication methods</CardDescription>
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
                    Inaccessible Authentication
                  </Label>
                  <div className="space-y-4 border p-4 rounded-md">
                    <div className="space-y-2">
                      <Label htmlFor="username-bad">Username</Label>
                      <Input id="username-bad" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-bad">Password</Label>
                      <Input id="password-bad" type="password" autoComplete="off" />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 12 characters with uppercase, lowercase, numbers, and special
                        characters.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="captcha-bad">Type the characters you see below:</Label>
                      <div className="bg-muted p-2 rounded text-center font-mono text-sm tracking-widest">
                        Rj9#kL7@pQ
                      </div>
                      <Input id="captcha-bad" />
                    </div>
                    <Button className="w-full">Sign In</Button>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Issues:</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Disables password managers (autoComplete="off")</li>
                    <li>Complex password requirements to memorize</li>
                    <li>Text-based CAPTCHA is a cognitive function test</li>
                    <li>No alternative authentication methods</li>
                    <li>Fails WCAG 2.2 criteria 3.3.7 and 3.3.8</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Accessible Authentication
                  </Label>
                  <div className="space-y-4 border p-4 rounded-md">
                    <div className="space-y-2">
                      <Label htmlFor="email-good">Email</Label>
                      <Input id="email-good" type="email" autoComplete="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-good">Password</Label>
                      <Input id="password-good" type="password" autoComplete="current-password" />
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Or sign in with:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Fingerprint className="h-4 w-4" />
                          <span>Fingerprint</span>
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          <span>Security Key</span>
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full">Sign In</Button>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Benefits:</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Supports password managers (proper autoComplete)</li>
                    <li>Provides alternative authentication methods</li>
                    <li>No CAPTCHA or cognitive function tests</li>
                    <li>"Remember me" option reduces memory load</li>
                    <li>Passes WCAG 2.2 criteria 3.3.7 and 3.3.8</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Inaccessible Implementation (Fails WCAG 2.2)</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`// Inaccessible authentication form
function InaccessibleAuth() {
  return (
    <form>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          type="password" 
          autoComplete="off" // Prevents password managers
        />
      </div>
      
      <div>
        <label htmlFor="captcha">Type the characters you see:</label>
        <div>Rj9#kL7@pQ</div> // Text CAPTCHA (cognitive test)
        <input id="captcha" />
      </div>
      
      <button type="submit">Sign In</button>
    </form>
  );
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Accessible Implementation (Passes WCAG 2.2)</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {`// Accessible authentication form
function AccessibleAuth() {
  return (
    <form>
      <div>
        <label htmlFor="email">Email</label>
        <input 
          id="email" 
          type="email" 
          autoComplete="email" // Supports password managers
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          type="password" 
          autoComplete="current-password" // Supports password managers
        />
      </div>
      
      <div>
        <input type="checkbox" id="remember" />
        <label htmlFor="remember">Remember me</label>
      </div>
      
      {/* Alternative authentication methods */}
      <div>
        <p>Or sign in with:</p>
        <button type="button">Fingerprint</button>
        <button type="button">Security Key</button>
      </div>
      
      <button type="submit">Sign In</button>
    </form>
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

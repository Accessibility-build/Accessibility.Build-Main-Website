"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUp, ArrowDown, X } from "lucide-react"

export function KeyboardNavigationDemo() {
  const [items, setItems] = useState([
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ])
  const [newItemName, setNewItemName] = useState("")
  const [focusedItemId, setFocusedItemId] = useState<number | null>(null)
  const [instructions, setInstructions] = useState<string[]>([
    "Try using only your keyboard to navigate this demo",
    "Tab to move between controls",
    "Enter to add a new item",
    "Use arrow buttons to reorder items",
    "Delete button removes an item",
  ])

  const addItem = () => {
    if (newItemName.trim()) {
      const newId = Math.max(0, ...items.map((item) => item.id)) + 1
      setItems([...items, { id: newId, name: newItemName }])
      setNewItemName("")
      setInstructions([...instructions, `Added item: ${newItemName}`])
    }
  }

  const removeItem = (id: number) => {
    const itemName = items.find((item) => item.id === id)?.name
    setItems(items.filter((item) => item.id !== id))
    setInstructions([...instructions, `Removed item: ${itemName}`])
  }

  const moveItem = (id: number, direction: "up" | "down") => {
    const index = items.findIndex((item) => item.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === items.length - 1)) {
      return
    }

    const newItems = [...items]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const itemToMove = newItems[index]
    newItems.splice(index, 1)
    newItems.splice(newIndex, 0, itemToMove)

    setItems(newItems)
    setInstructions([...instructions, `Moved ${itemToMove.name} ${direction}`])
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      moveItem(id, "up")
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      moveItem(id, "down")
    } else if (e.key === "Delete") {
      e.preventDefault()
      removeItem(id)
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h3 className="text-xl font-semibold mb-4">Keyboard Navigation Demo</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="new-item">Add new item</Label>
              <Input
                id="new-item"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem()
                  }
                }}
                placeholder="Enter item name"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addItem}>Add</Button>
            </div>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center space-x-2 p-3 border rounded-md ${
                  focusedItemId === item.id ? "ring-2 ring-primary" : ""
                }`}
                tabIndex={0}
                onFocus={() => setFocusedItemId(item.id)}
                onBlur={() => setFocusedItemId(null)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
              >
                <div className="flex-1">{item.name}</div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveItem(item.id, "up")}
                    aria-label={`Move ${item.name} up`}
                    disabled={items.indexOf(item) === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveItem(item.id, "down")}
                    aria-label={`Move ${item.name} down`}
                    disabled={items.indexOf(item) === items.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Instructions & Activity Log</h4>
            <div className="h-[300px] overflow-y-auto border rounded-md p-3 text-sm space-y-1" aria-live="polite">
              {instructions.map((instruction, i) => (
                <p key={i} className={i >= instructions.length - 3 ? "font-medium" : ""}>
                  {instruction}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

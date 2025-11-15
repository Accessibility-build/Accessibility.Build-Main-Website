"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function AccessibleFormDemo() {
  const [formState, setFormState] = useState<"idle" | "error" | "success">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setFormState("error")

      // Focus the first field with an error
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.focus()
      }

      return
    }

    // Form is valid
    setFormState("success")
    setErrors({})
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      agreeTerms: false,
    })
    setErrors({})
    setFormState("idle")
  }

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h3 className="text-xl font-semibold mb-4">Interactive Accessible Form Demo</h3>

      {formState === "success" ? (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>Form submitted successfully! Thank you for your submission.</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={resetForm}>Try Again</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {formState === "error" && Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please correct the errors in the form.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
              Name
              <span aria-hidden="true" className="text-destructive">
                {" "}
                *
              </span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
              Email
              <span aria-hidden="true" className="text-destructive">
                {" "}
                *
              </span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
              aria-required="true"
              aria-invalid={!!errors.agreeTerms}
              aria-describedby={errors.agreeTerms ? "terms-error" : undefined}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="agreeTerms"
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  errors.agreeTerms ? "text-destructive" : ""
                }`}
              >
                I agree to the terms and conditions
                <span aria-hidden="true" className="text-destructive">
                  {" "}
                  *
                </span>
              </Label>
              {errors.agreeTerms && (
                <p id="terms-error" className="text-sm text-destructive">
                  {errors.agreeTerms}
                </p>
              )}
            </div>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      )}
    </div>
  )
}

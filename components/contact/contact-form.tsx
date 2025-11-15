"use client"

import { useState } from "react"
import { useForm, ValidationError } from "@formspree/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, Loader2, Mail } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export function ContactForm() {
  const [state, handleSubmit] = useForm("xpwdbywd")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    subject: "",
    message: "",
    priority: "normal",
    newsletter: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      newsletter: checked,
    }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Create FormData with all form values
    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value.toString())
    })
    
    // Submit to Formspree
    await handleSubmit(form)
  }

  if (state.succeeded) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
          Message Sent Successfully!
        </h3>
        <p className="text-green-700 dark:text-green-300 text-lg max-w-md mx-auto">
          Thank you for reaching out. We've received your message and will get back to you within 24 hours.
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-6"
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              className="w-full"
            />
            <ValidationError prefix="Name" field="name" errors={state.errors} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center">
              Email Address
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
              className="w-full"
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium">
              Company / Organization
            </Label>
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Your company name"
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-sm font-medium">
            Website URL
          </Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://yourwebsite.com"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            Subject
          </Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Brief description of your inquiry"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium flex items-center">
            Message
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell us about your accessibility needs, questions, or how we can help..."
            required
            className="w-full min-h-[150px] resize-y"
          />
          <ValidationError prefix="Message" field="message" errors={state.errors} />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Priority Level</Label>
          <RadioGroup
            value={formData.priority}
            onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="priority-low" />
              <Label htmlFor="priority-low" className="text-sm cursor-pointer">
                Low - General inquiry
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="priority-normal" />
              <Label htmlFor="priority-normal" className="text-sm cursor-pointer">
                Normal - Standard request
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="priority-high" />
              <Label htmlFor="priority-high" className="text-sm cursor-pointer">
                High - Urgent issue
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
          <Checkbox
            id="newsletter"
            checked={formData.newsletter}
            onCheckedChange={handleCheckboxChange}
          />
          <div className="space-y-1">
            <Label
              htmlFor="newsletter"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Subscribe to our newsletter
            </Label>
            <p className="text-sm text-muted-foreground">
              Get the latest accessibility insights, tips, and product updates delivered to your inbox monthly.
            </p>
          </div>
        </div>

        {/* Error Display */}
        {state.errors && Object.keys(state.errors).length > 0 && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Please fix the following errors:
                </h4>
                <div className="text-sm text-red-700 dark:text-red-300">
                  {Object.entries(state.errors).map(([field, errors]) => (
                    <div key={field} className="mb-1">
                      {Array.isArray(errors) ? errors.map((error, index) => (
                        <div key={index}>{error.message}</div>
                      )) : errors.message}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm pt-2">
                  <Mail className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span>Or email us directly: </span>
                  <a 
                    href="mailto:accessibilitybuild@gmail.com" 
                    className="text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 underline font-medium"
                  >
                    accessibilitybuild@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <Button 
            type="submit" 
            disabled={state.submitting || !formData.email || !formData.message} 
            className="w-full h-12 text-lg font-medium"
          >
            {state.submitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending Message...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center mt-4">
            <span className="text-red-500">*</span> Required fields • We'll respond within 24 hours
          </p>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
            <Mail className="h-3 w-3" />
            <span>Direct email: accessibilitybuild@gmail.com</span>
          </div>
        </div>

        {/* Anti-spam honeypot */}
        <input
          type="text"
          name="_gotcha"
          className="sr-only absolute left-[-9999px]"
          tabIndex={-1}
          autoComplete="off"
        />
      </form>
    </div>
  )
}

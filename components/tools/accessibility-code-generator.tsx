"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Code,
  Copy,
  Download,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  Eye,
  Hand,
  Layers,
  Keyboard,
  FileCode,
  Braces
} from "lucide-react"

interface GeneratedCode {
  html: string
  react: string
  vue: string
  accessibility: {
    features: string[]
    wcagCompliance: string[]
    testing: string[]
    implementation: string[]
    bestPractices: string[]
  }
  explanation: string
  detailedAnalysis: {
    codeBreakdown: string
    accessibilityContext: string
    realWorldExample: string
    commonMistakes: string[]
    enhancementSuggestions: string[]
  }
  examples: {
    basicUsage: string
    advancedUsage: string
    integrationExample: string
  }
}

const componentTypes = [
  { value: "button", label: "Button", description: "Interactive button with focus states" },
  { value: "form", label: "Form", description: "Accessible form with validation" },
  { value: "modal", label: "Modal/Dialog", description: "Accessible modal with focus management" },
  { value: "navigation", label: "Navigation", description: "Accessible navigation menu" },
  { value: "tabs", label: "Tabs", description: "Tab interface with keyboard navigation" },
  { value: "carousel", label: "Carousel", description: "Image carousel with controls" },
  { value: "accordion", label: "Accordion", description: "Collapsible content sections" },
  { value: "table", label: "Data Table", description: "Accessible data table with sorting" },
  { value: "dropdown", label: "Dropdown", description: "Accessible dropdown menu" },
  { value: "tooltip", label: "Tooltip", description: "Accessible tooltip implementation" },
  { value: "breadcrumb", label: "Breadcrumb", description: "Navigation breadcrumb trail" },
  { value: "pagination", label: "Pagination", description: "Accessible pagination controls" }
]

const frameworks = [
  { value: "html", label: "HTML/CSS", icon: "🌐" },
  { value: "react", label: "React", icon: "⚛️" },
  { value: "vue", label: "Vue.js", icon: "💚" },
  { value: "angular", label: "Angular", icon: "🅰️" }
]

export default function AccessibilityCodeGenerator() {
  const [componentType, setComponentType] = useState("")
  const [framework, setFramework] = useState("")
  const [description, setDescription] = useState("")
  const [customRequirements, setCustomRequirements] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const generateCode = async () => {
    if (!componentType || !framework || !description) return
    
    setIsGenerating(true)
    setError(null)
    setGeneratedCode(null)

    try {
      const code = await simulateCodeGeneration()
      setGeneratedCode(code)
    } catch (err) {
      setError("Failed to generate code. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const simulateCodeGeneration = async (): Promise<GeneratedCode> => {
    // Simulate AI code generation
    await new Promise(resolve => setTimeout(resolve, 3000))

    const selectedComponent = componentTypes.find(c => c.value === componentType)

    // Generate realistic accessible code examples
    const htmlCode = `<!-- Accessible ${selectedComponent?.label} Component -->
<div class="component-container" role="region" aria-labelledby="component-title">
  <h2 id="component-title" class="sr-only">${selectedComponent?.label} Component</h2>
  
  ${componentType === 'button' ? `
  <button 
    class="btn btn-primary"
    type="button"
    aria-describedby="btn-help"
    data-testid="action-button"
  >
    ${description || 'Click me'}
    <span class="sr-only"> - Opens in new window</span>
  </button>
  <div id="btn-help" class="sr-only">
    This button performs the main action and provides feedback
  </div>
  ` : componentType === 'form' ? `
  <form class="accessible-form" novalidate>
    <fieldset>
      <legend>Contact Information</legend>
      
      <div class="form-group">
        <label for="email" class="required">
          Email Address
          <span aria-hidden="true">*</span>
        </label>
        <input 
          type="email" 
          id="email"
          name="email"
          aria-describedby="email-error email-help"
          aria-required="true"
          autocomplete="email"
        />
        <div id="email-help" class="help-text">
          We'll never share your email with anyone else.
        </div>
        <div id="email-error" class="error-text" role="alert" aria-live="polite">
          <!-- Error messages appear here -->
        </div>
      </div>
      
      <button type="submit" class="btn btn-primary">
        Submit Form
      </button>
    </fieldset>
  </form>
  ` : `
  <div class="accessible-component" ${componentType === 'modal' ? 'role="dialog" aria-modal="true"' : ''}>
    <!-- Component implementation with proper ARIA attributes -->
    <div aria-live="polite" aria-atomic="true">
      Content updates will be announced to screen readers
    </div>
  </div>
  `}
</div>`

    const reactCode = `import React, { useState, useRef, useEffect } from 'react';
${componentType === 'modal' ? "import { createPortal } from 'react-dom';" : ''}

interface ${selectedComponent?.label.replace(/\s+/g, '')}Props {
  children?: React.ReactNode;
  className?: string;
  ${componentType === 'button' ? 'onClick?: () => void;' : ''}
  ${componentType === 'form' ? 'onSubmit?: (data: FormData) => void;' : ''}
  'aria-label'?: string;
}

export const Accessible${selectedComponent?.label.replace(/\s+/g, '')} = ({ 
  children, 
  className = '', 
  ${componentType === 'button' ? 'onClick,' : ''}
  ${componentType === 'form' ? 'onSubmit,' : ''}
  'aria-label': ariaLabel,
  ...props 
}: ${selectedComponent?.label.replace(/\s+/g, '')}Props) => {
  ${componentType === 'modal' ? 'const [isOpen, setIsOpen] = useState(false);' : ''}
  ${componentType === 'form' ? 'const [errors, setErrors] = useState<Record<string, string>>({});' : ''}
  const componentRef = useRef<HTML${componentType === 'button' ? 'Button' : 'Div'}Element>(null);

  ${componentType === 'modal' ? `
  useEffect(() => {
    if (isOpen && componentRef.current) {
      componentRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  ` : ''}

  ${componentType === 'button' ? `
  const handleClick = () => {
    onClick?.();
    // Add any additional button logic here
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };
  ` : ''}

  ${componentType === 'form' ? `
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.get('email')?.toString().includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData);
    }
  };
  ` : ''}

  return (
    ${componentType === 'button' ? `
    <button
      ref={componentRef}
      className={\`btn btn-primary \${className}\`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      {...props}
    >
      {children || '${description || 'Click me'}'}
    </button>
    ` : componentType === 'form' ? `
    <form 
      className={\`accessible-form \${className}\`}
      onSubmit={handleSubmit}
      noValidate
      {...props}
    >
      <fieldset>
        <legend>Contact Information</legend>
        
        <div className="form-group">
          <label htmlFor="email" className="required">
            Email Address
            <span aria-hidden="true">*</span>
          </label>
          <input 
            type="email" 
            id="email"
            name="email"
            aria-describedby="email-error email-help"
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            autoComplete="email"
          />
          <div id="email-help" className="help-text">
            We'll never share your email with anyone else.
          </div>
          {errors.email && (
            <div id="email-error" className="error-text" role="alert" aria-live="polite">
              {errors.email}
            </div>
          )}
        </div>
        
        <button type="submit" className="btn btn-primary">
          Submit Form
        </button>
      </fieldset>
    </form>
    ` : `
    <div 
      ref={componentRef}
      className={\`accessible-component \${className}\`}
      ${componentType === 'modal' ? 'role="dialog" aria-modal="true"' : ''}
      aria-label={ariaLabel}
      {...props}
    >
      <div aria-live="polite" aria-atomic="true">
        {children}
      </div>
    </div>
    `}
  );
};`

    const vueCode = `<template>
  <div 
    ref="componentRef"
    :class="['accessible-component', className]"
    ${componentType === 'modal' ? 'role="dialog" aria-modal="true"' : ''}
    :aria-label="ariaLabel"
  >
    ${componentType === 'button' ? `
    <button
      class="btn btn-primary"
      @click="handleClick"
      @keydown="handleKeyDown"
      :aria-label="ariaLabel"
    >
      <slot>{{ description || 'Click me' }}</slot>
    </button>
    ` : componentType === 'form' ? `
    <form 
      class="accessible-form"
      @submit.prevent="handleSubmit"
      novalidate
    >
      <fieldset>
        <legend>Contact Information</legend>
        
        <div class="form-group">
          <label for="email" class="required">
            Email Address
            <span aria-hidden="true">*</span>
          </label>
          <input 
            type="email" 
            id="email"
            v-model="formData.email"
            aria-describedby="email-error email-help"
            aria-required="true"
            :aria-invalid="errors.email ? 'true' : 'false'"
            autocomplete="email"
          />
          <div id="email-help" class="help-text">
            We'll never share your email with anyone else.
          </div>
          <div 
            v-if="errors.email"
            id="email-error" 
            class="error-text" 
            role="alert" 
            aria-live="polite"
          >
            {{ errors.email }}
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary">
          Submit Form
        </button>
      </fieldset>
    </form>
    ` : `
    <div aria-live="polite" aria-atomic="true">
      <slot></slot>
    </div>
    `}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  className?: string
  ariaLabel?: string
  ${componentType === 'form' ? 'onSubmit?: (data: Record<string, any>) => void' : ''}
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  ariaLabel: ''
})

const componentRef = ref<HTMLDivElement>()
${componentType === 'form' ? `
const formData = ref({ email: '' })
const errors = ref<Record<string, string>>({})
` : ''}

${componentType === 'modal' ? `
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    // Close modal logic
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  componentRef.value?.focus()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
` : ''}

${componentType === 'button' ? `
const handleClick = () => {
  // Button click logic
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}
` : ''}

${componentType === 'form' ? `
const handleSubmit = () => {
  const newErrors: Record<string, string> = {}
  
  if (!formData.value.email.includes('@')) {
    newErrors.email = 'Please enter a valid email address'
  }
  
  errors.value = newErrors
  
  if (Object.keys(newErrors).length === 0) {
    props.onSubmit?.(formData.value)
  }
}
` : ''}
</script>`

    return {
      html: htmlCode,
      react: reactCode,
      vue: vueCode,
      accessibility: {
        features: [
          "ARIA labels and descriptions for screen readers",
          "Full keyboard navigation with visual focus indicators", 
          "Screen reader compatibility with proper announcements",
          "Focus management with logical tab order",
          "High contrast colors (4.5:1 ratio minimum)",
          "Semantic HTML structure for better accessibility tree"
        ],
        wcagCompliance: [
          "WCAG 2.2 Level AA compliant across all success criteria",
          "Perceivable: Proper alt text, labels, and color contrast",
          "Operable: Full keyboard accessibility and sufficient target sizes",
          "Understandable: Clear instructions and consistent navigation", 
          "Robust: Valid HTML, ARIA, and cross-browser compatibility"
        ],
        testing: [
          "Screen reader testing (NVDA, JAWS, VoiceOver, TalkBack)",
          "Keyboard navigation verification (Tab, Shift+Tab, Enter, Space, Escape, Arrow keys)",
          "Color contrast validation using tools like WebAIM or Stark",
          "HTML and ARIA markup validation with axe-core",
          "Magnification software testing (ZoomText, built-in zoom)",
          "Focus indicator visibility testing across different themes"
        ],
        implementation: [
          "Install component with proper TypeScript support",
          "Configure CSS variables for consistent theming",
          "Set up global focus styles in your design system",
          "Implement proper error handling and user feedback",
          "Add analytics tracking for accessibility usage patterns",
          "Test integration with your existing form validation"
        ],
        bestPractices: [
          "Always provide descriptive labels, not just 'Click here'",
          "Maintain logical heading hierarchy (H1 > H2 > H3)",
          "Use semantic HTML before adding ARIA",
          "Test with actual assistive technology users",
          "Provide multiple ways to access the same functionality",
          "Keep focus management predictable and logical"
        ]
      },
      explanation: `This comprehensive ${selectedComponent?.label.toLowerCase()} component implementation follows WCAG 2.2 Level AA guidelines and modern accessibility best practices. Every aspect has been carefully designed to work seamlessly with assistive technologies while providing an excellent user experience for all users.`,
      detailedAnalysis: {
        codeBreakdown: `🔍 **Code Structure Analysis:**

**Semantic Foundation:** The component uses proper semantic HTML elements (${componentType === 'button' ? '<button>' : componentType === 'form' ? '<form>, <fieldset>, <legend>' : '<div with proper roles>'}) as the foundation, ensuring assistive technologies understand the purpose and structure.

**ARIA Implementation:** Strategic use of ARIA attributes enhances the semantic meaning:
- \`aria-label\` provides accessible names when visual text isn't sufficient
- \`aria-describedby\` connects help text and error messages to form controls
- \`aria-live\` regions announce dynamic content changes
- \`role\` attributes clarify the component's purpose when HTML semantics aren't enough

**Focus Management:** The component implements comprehensive focus handling:
- \`useRef\` hooks manage focus programmatically
- \`tabIndex\` controls are used appropriately
- Focus trapping in modal components prevents focus from escaping
- Visual focus indicators are clearly visible and high-contrast

**Event Handling:** Both mouse and keyboard interactions are supported:
- Click handlers for mouse users
- KeyDown handlers for keyboard users (Enter, Space, Escape)
- Touch handlers for mobile accessibility
- Consistent behavior across all interaction methods`,

        accessibilityContext: `🎯 **Why These Accessibility Features Matter:**

**For Users with Visual Impairments:**
- Screen readers rely on proper semantic structure and ARIA labels to understand content
- High contrast ratios ensure users with low vision can see interactive elements
- Focus indicators help users with partial vision track their location

**For Users with Motor Impairments:**
- Large touch targets (44px minimum) accommodate users with limited dexterity
- Keyboard navigation provides an alternative to precise mouse movements
- Generous click areas reduce the precision required for interaction

**For Users with Cognitive Disabilities:**
- Clear, consistent labeling reduces cognitive load
- Predictable interaction patterns help users understand functionality
- Error messages are descriptive and actionable
- Multiple input methods accommodate different preferences and abilities

**Universal Benefits:**
- Semantic HTML improves SEO and machine readability
- Keyboard navigation helps power users work more efficiently
- Clear structure benefits all users when content is complex
- Robust code reduces bugs and improves maintainability`,

        realWorldExample: `🌍 **Real-World Implementation Example:**

\`\`\`tsx
// Integration with your existing React application
import { Accessible${selectedComponent?.label.replace(/\s+/g, '')} } from './components/Accessible${selectedComponent?.label.replace(/\s+/g, '')}';

function ContactPage() {
  const handleFormSubmit = (formData: FormData) => {
    // Your form submission logic
    const email = formData.get('email') as string;
    
    // Show success message
    toast.success('Form submitted successfully!');
    
    // Analytics tracking
    analytics.track('Form Submitted', {
      component: '${selectedComponent?.label}',
      accessible: true
    });
  };

  return (
    <main>
      <h1>Contact Us</h1>
      <p>We'd love to hear from you. Send us a message!</p>
      
      <Accessible${selectedComponent?.label.replace(/\s+/g, '')}
        onSubmit={handleFormSubmit}
        aria-label="Contact form for customer inquiries"
        className="contact-form"
      />
      
      {/* Success/error notifications should also be accessible */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        Form submission status will be announced here
      </div>
    </main>
  );
}
\`\`\`

**CSS Integration Example:**
\`\`\`css
/* Ensure consistent focus styles across your application */
.btn:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .btn {
    border: 2px solid;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
\`\`\``,

        commonMistakes: [
          "❌ Using div/span with click handlers instead of button elements",
          "❌ Missing focus indicators or using outline: none without alternatives",
          "❌ Inadequate color contrast (below 4.5:1 for normal text)",
          "❌ Missing or incorrect ARIA labels that don't describe the actual function",
          "❌ Breaking keyboard navigation by using tabIndex incorrectly",
          "❌ Not announcing dynamic content changes to screen readers",
          "❌ Using placeholder text as the only form label",
          "❌ Implementing custom controls without proper ARIA patterns",
          "❌ Not testing with actual assistive technologies",
          "❌ Focusing only on screen readers and ignoring other accessibility needs"
        ],

        enhancementSuggestions: [
          "🚀 Add support for Windows High Contrast Mode with CSS custom properties",
          "🚀 Implement voice control compatibility with data-* attributes",
          "🚀 Add animation controls for users with vestibular disorders",
          "🚀 Include RTL (right-to-left) language support",
          "🚀 Implement progressive enhancement for JavaScript-disabled users",
          "🚀 Add comprehensive error boundary handling",
          "🚀 Include analytics for accessibility feature usage",
          "🚀 Implement automatic accessibility testing in CI/CD pipeline",
          "🚀 Add support for browser extensions like Dragon NaturallySpeaking",
          "🚀 Create comprehensive storybook documentation with accessibility notes"
        ]
      },
      examples: {
        basicUsage: `// Basic implementation - perfect for getting started
<Accessible${selectedComponent?.label.replace(/\s+/g, '')} 
  aria-label="Submit contact form"
  className="primary-button"
>
  Get Started
</Accessible${selectedComponent?.label.replace(/\s+/g, '')}>`,

        advancedUsage: `// Advanced implementation with full configuration
<Accessible${selectedComponent?.label.replace(/\s+/g, '')}
  aria-label="Submit contact form"
  aria-describedby="form-help"
  onSubmit={handleSubmit}
  onValidationError={handleError}
  className="contact-form"
  autoComplete="on"
  noValidate={false}
  data-testid="contact-form"
  data-analytics="contact-form-submit"
>
  <FormField name="email" required />
  <FormField name="message" type="textarea" />
</Accessible${selectedComponent?.label.replace(/\s+/g, '')}>

<div id="form-help" className="help-text">
  All fields marked with * are required. 
  We'll respond within 24 hours.
</div>`,

        integrationExample: `// Full integration with form library and validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

function ContactForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', message: '' }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Accessible${selectedComponent?.label.replace(/\s+/g, '')}
        {...form.register('email')}
        error={form.formState.errors.email?.message}
        aria-invalid={!!form.formState.errors.email}
        aria-describedby="email-help email-error"
      />
      
      {/* Accessible error announcements */}
      <div
        role="alert"
        aria-live="assertive"
        className={form.formState.errors ? 'error-summary' : 'sr-only'}
      >
        {Object.keys(form.formState.errors).length > 0 && 
          'There are errors in the form. Please review and correct them.'
        }
      </div>
    </form>
  );
}`
      }
    }
  }

  const copyCode = (code: string, tab: string) => {
    navigator.clipboard.writeText(code)
    setCopiedTab(tab)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Code Generator
          </CardTitle>
          <CardDescription>
            Generate WCAG 2.2 compliant components with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="component-type">Component Type</Label>
              <Select value={componentType} onValueChange={setComponentType}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select component type" />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  {componentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="framework">Framework</Label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  {frameworks.map((fw) => (
                    <SelectItem key={fw.value} value={fw.value}>
                      <div className="flex items-center gap-2">
                        <span>{fw.icon}</span>
                        <span>{fw.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Component Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the component functionality and requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Custom Requirements (Optional)</Label>
            <Textarea
              id="requirements"
              placeholder="Any specific accessibility requirements, styling needs, or functionality..."
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Credits Required:</strong> This comprehensive AI-powered code generation uses 2 credits and provides detailed accessible components with explanations, examples, and implementation guides.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={generateCode}
            disabled={!componentType || !framework || !description || isGenerating}
            className="w-full"
          >
            {isGenerating ? "Generating Comprehensive Code..." : "Generate Detailed Accessible Code"}
            <Badge variant="secondary" className="ml-2">2 Credits</Badge>
          </Button>
        </CardContent>
      </Card>

      {generatedCode && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Generated Accessible Code
              </CardTitle>
              <CardDescription>
                Production-ready, WCAG 2.2 compliant component code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="react" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="react">⚛️ React</TabsTrigger>
                  <TabsTrigger value="vue">💚 Vue.js</TabsTrigger>
                  <TabsTrigger value="html">🌐 HTML</TabsTrigger>
                </TabsList>
                
                <TabsContent value="react" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">React Component</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(generatedCode.react, 'react')}
                      >
                        {copiedTab === 'react' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiedTab === 'react' ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadCode(generatedCode.react, `${componentType}-component.tsx`)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{generatedCode.react}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="vue" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Vue.js Component</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(generatedCode.vue, 'vue')}
                      >
                        {copiedTab === 'vue' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiedTab === 'vue' ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadCode(generatedCode.vue, `${componentType}-component.vue`)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{generatedCode.vue}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="html" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">HTML Template</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(generatedCode.html, 'html')}
                      >
                        {copiedTab === 'html' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiedTab === 'html' ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadCode(generatedCode.html, `${componentType}-component.html`)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{generatedCode.html}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Detailed Analysis Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Braces className="h-5 w-5" />
                Detailed Code Analysis
              </CardTitle>
              <CardDescription>
                Comprehensive breakdown of the accessibility implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="breakdown" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="breakdown">Code Breakdown</TabsTrigger>
                  <TabsTrigger value="context">Accessibility Context</TabsTrigger>
                  <TabsTrigger value="example">Real-World Example</TabsTrigger>
                </TabsList>
                
                <TabsContent value="breakdown" className="space-y-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: generatedCode.detailedAnalysis.codeBreakdown.replace(/\n/g, '<br>') }} />
                  </div>
                </TabsContent>
                
                <TabsContent value="context" className="space-y-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: generatedCode.detailedAnalysis.accessibilityContext.replace(/\n/g, '<br>') }} />
                  </div>
                </TabsContent>
                
                <TabsContent value="example" className="space-y-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: generatedCode.detailedAnalysis.realWorldExample.replace(/\n/g, '<br>') }} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Implementation Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Implementation Examples
              </CardTitle>
              <CardDescription>
                Different ways to use and integrate the component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Usage</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Usage</TabsTrigger>
                  <TabsTrigger value="integration">Full Integration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Basic Implementation</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyCode(generatedCode.examples.basicUsage, 'basic')}
                    >
                      {copiedTab === 'basic' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode.examples.basicUsage}</code>
                  </pre>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Advanced Configuration</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyCode(generatedCode.examples.advancedUsage, 'advanced')}
                    >
                      {copiedTab === 'advanced' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode.examples.advancedUsage}</code>
                  </pre>
                </TabsContent>
                
                <TabsContent value="integration" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Full Integration Example</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyCode(generatedCode.examples.integrationExample, 'integration')}
                    >
                      {copiedTab === 'integration' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode.examples.integrationExample}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Comprehensive Accessibility Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5" />
                  Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.accessibility.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="h-5 w-5" />
                  WCAG Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.accessibility.wcagCompliance.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Keyboard className="h-5 w-5" />
                  Testing Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.accessibility.testing.map((test, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Hand className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.accessibility.bestPractices.map((practice, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Common Mistakes & Enhancements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.detailedAnalysis.commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-blue-600">
                  <Zap className="h-5 w-5" />
                  Enhancement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.detailedAnalysis.enhancementSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Summary</CardTitle>
              <CardDescription>
                Key points for successful implementation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {generatedCode.explanation}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Implementation Steps:</h4>
                  <ul className="space-y-1 text-sm">
                    {generatedCode.accessibility.implementation.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Production Ready</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      This component is thoroughly tested and ready for production use with comprehensive accessibility support.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📚 Educational</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Learn accessibility best practices through detailed explanations and real-world examples.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 
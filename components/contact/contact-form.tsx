"use client"

import { ClipboardList, MessageSquareText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectBriefBuilder } from "@/components/contact/project-brief-builder"
import { QuickContactForm } from "@/components/contact/quick-contact-form"

type ContactFormProps = {
  requestedService?: string
  requestedPackage?: string
  requestedTopic?: string
}

export function ContactForm({ requestedService, requestedPackage, requestedTopic }: ContactFormProps) {
  const defaultPath = requestedService || requestedPackage ? "project" : "message"

  return (
    <Tabs defaultValue={defaultPath} className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-2 bg-muted p-1" aria-label="Choose contact form type">
        <TabsTrigger value="message" className="h-12 min-w-0 gap-1.5 whitespace-nowrap px-2 py-2 text-left">
          <MessageSquareText className="h-4 w-4 shrink-0" aria-hidden="true" />
          Quick message
        </TabsTrigger>
        <TabsTrigger value="project" className="h-12 min-w-0 gap-1.5 whitespace-nowrap px-2 py-2 text-left">
          <ClipboardList className="h-4 w-4 shrink-0" aria-hidden="true" />
          Project brief
        </TabsTrigger>
      </TabsList>
      <TabsContent value="message" className="mt-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <QuickContactForm requestedTopic={requestedTopic} />
      </TabsContent>
      <TabsContent value="project" className="mt-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <ProjectBriefBuilder requestedService={requestedService} requestedPackage={requestedPackage} />
      </TabsContent>
    </Tabs>
  )
}

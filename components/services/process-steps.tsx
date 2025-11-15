import type { LucideIcon } from "lucide-react"

interface Step {
  title: string
  description: string
  icon: LucideIcon
}

interface ProcessStepsProps {
  steps: Step[]
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {steps.map((step, index) => {
        const Icon = step.icon
        return (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute top-1/2 left-full h-0.5 w-full bg-primary/20 -translate-y-1/2 hidden lg:block">
                {index < steps.length - 1 && <div className="h-full w-full bg-primary/20"></div>}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        )
      })}
    </div>
  )
}

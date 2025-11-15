import type { Metadata } from "next"
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Server, Database, Zap, Globe, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "System Status | Accessibility.build - Service Health & Uptime",
  description:
    "Check the current status of Accessibility.build services, including API uptime, tool availability, and recent incidents.",
  keywords: [
    "system status",
    "service health",
    "uptime",
    "accessibility tools status",
    "API status",
    "service monitoring"
  ],
  openGraph: {
    title: "System Status - Accessibility.build Service Health",
    description: "Real-time status of all Accessibility.build services and tools.",
    type: "website",
    url: "https://accessibility.build/status",
  },
  twitter: {
    card: "summary_large_image",
    title: "System Status - Accessibility.build",
    description: "Real-time status of all Accessibility.build services and tools.",
  },
  alternates: {
    canonical: "https://accessibility.build/status"
  }
}

// Mock data - in production, this would come from your monitoring system
const overallStatus = {
  status: "operational", // operational, degraded, outage
  uptime: 99.97,
  lastUpdated: new Date().toISOString()
}

const services = [
  {
    name: "Website",
    description: "Main website and dashboard",
    status: "operational",
    uptime: 99.99,
    responseTime: 245,
    icon: Globe
  },
  {
    name: "API",
    description: "REST API for integrations",
    status: "operational", 
    uptime: 99.95,
    responseTime: 180,
    icon: Server
  },
  {
    name: "Color Contrast Checker",
    description: "WCAG contrast testing tool",
    status: "operational",
    uptime: 100,
    responseTime: 120,
    icon: Zap
  },
  {
    name: "Alt Text Generator",
    description: "AI-powered alt text generation",
    status: "operational",
    uptime: 99.92,
    responseTime: 850,
    icon: Activity
  },
  {
    name: "Database",
    description: "User data and analytics storage",
    status: "operational",
    uptime: 99.98,
    responseTime: 45,
    icon: Database
  },
  {
    name: "Authentication",
    description: "User login and security",
    status: "operational",
    uptime: 99.99,
    responseTime: 95,
    icon: Shield
  }
]

const incidents = [
  {
    id: 1,
    title: "Scheduled Maintenance - Database Optimization",
    description: "Routine database maintenance to improve performance. No user impact expected.",
    status: "completed",
    severity: "maintenance",
    startTime: "2024-01-15T02:00:00Z",
    endTime: "2024-01-15T04:30:00Z",
    affectedServices: ["Database"],
    updates: [
      {
        time: "2024-01-15T04:30:00Z",
        message: "Maintenance completed successfully. All services are operating normally."
      },
      {
        time: "2024-01-15T02:00:00Z", 
        message: "Scheduled maintenance has begun. Database optimization in progress."
      }
    ]
  },
  {
    id: 2,
    title: "API Response Time Degradation",
    description: "Elevated response times for API endpoints due to increased traffic.",
    status: "resolved",
    severity: "minor",
    startTime: "2024-01-12T14:20:00Z",
    endTime: "2024-01-12T15:45:00Z",
    affectedServices: ["API"],
    updates: [
      {
        time: "2024-01-12T15:45:00Z",
        message: "Issue resolved. API response times have returned to normal levels."
      },
      {
        time: "2024-01-12T14:45:00Z",
        message: "We have identified the cause and are implementing a fix. Response times are improving."
      },
      {
        time: "2024-01-12T14:20:00Z",
        message: "We are investigating reports of slower API response times."
      }
    ]
  }
]

const metrics = [
  {
    name: "API Requests",
    value: "2.4M",
    change: "+12%",
    period: "Last 30 days"
  },
  {
    name: "Average Response Time",
    value: "245ms",
    change: "-8%",
    period: "Last 24 hours"
  },
  {
    name: "Success Rate",
    value: "99.97%",
    change: "+0.02%",
    period: "Last 7 days"
  },
  {
    name: "Active Users",
    value: "15.2K",
    change: "+18%",
    period: "Last 30 days"
  }
]

export default function StatusPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'outage':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'maintenance':
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'default'
      case 'degraded':
        return 'secondary'
      case 'outage':
        return 'destructive'
      case 'maintenance':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive'
      case 'major':
        return 'destructive'
      case 'minor':
        return 'secondary'
      case 'maintenance':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  return (
    <div className="container-wide py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">System Status</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Real-time status and performance metrics for all Accessibility.build services.
        </p>
      </div>

      {/* Overall Status */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(overallStatus.status)}
              <div>
                <h2 className="text-2xl font-bold">
                  {overallStatus.status === 'operational' ? 'All Systems Operational' : 'System Issues Detected'}
                </h2>
                <p className="text-muted-foreground">
                  Last updated: {formatDate(overallStatus.lastUpdated)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                {overallStatus.uptime}%
              </div>
              <div className="text-sm text-muted-foreground">
                30-day uptime
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <service.icon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </div>
                {getStatusIcon(service.status)}
              </div>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="font-medium">{service.uptime}%</span>
                </div>
                <Progress value={service.uptime} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="font-medium">{service.responseTime}ms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="incidents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="incidents">Recent Incidents</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="maintenance">Scheduled Maintenance</TabsTrigger>
        </TabsList>

        {/* Incidents */}
        <TabsContent value="incidents">
          <div className="space-y-6">
            {incidents.map((incident) => (
              <Card key={incident.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{incident.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(incident.severity) as any}>
                        {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                      </Badge>
                      <Badge variant={getStatusColor(incident.status) as any}>
                        {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{incident.description}</CardDescription>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(incident.startTime)} - {incident.endTime ? formatDate(incident.endTime) : 'Ongoing'}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Affected Services</h4>
                      <div className="flex gap-2">
                        {incident.affectedServices.map((service, index) => (
                          <Badge key={index} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Updates</h4>
                      <div className="space-y-2">
                        {incident.updates.map((update, index) => (
                          <div key={index} className="border-l-2 border-muted pl-4">
                            <div className="text-sm text-muted-foreground">
                              {formatDate(update.time)}
                            </div>
                            <div className="text-sm">
                              {update.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Metrics */}
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardDescription>{metric.name}</CardDescription>
                  <CardTitle className="text-2xl">{metric.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={metric.change.startsWith('+') ? 'default' : 'secondary'}>
                      {metric.change}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {metric.period}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance</CardTitle>
              <CardDescription>
                Upcoming maintenance windows and planned service updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Scheduled Maintenance</h3>
                <p className="text-muted-foreground">
                  There are currently no scheduled maintenance windows. 
                  We'll notify users in advance of any planned maintenance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Subscribe to Updates */}
      <Card className="mt-12">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to status updates and get notified about incidents and maintenance windows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Subscribe
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

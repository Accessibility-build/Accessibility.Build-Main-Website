"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Shield, 
  Copy, 
  Download, 
  Check, 
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  Key,
  Lock
} from "lucide-react"

interface PasswordStrength {
  score: number
  level: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong'
  color: string
  feedback: string[]
}

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

export default function PasswordGenerator() {
  const [passwords, setPasswords] = useState<string[]>([])
  const [passwordCount, setPasswordCount] = useState(1)
  const [showPasswords, setShowPasswords] = useState(true)
  const [copied, setCopied] = useState<number | null>(null)
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  })

  const analyzePasswordStrength = useCallback((password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    // Length scoring
    if (password.length >= 12) score += 25
    else if (password.length >= 8) score += 15
    else feedback.push("Use at least 12 characters")

    // Character variety
    if (/[a-z]/.test(password)) score += 5
    else feedback.push("Add lowercase letters")
    
    if (/[A-Z]/.test(password)) score += 5
    else feedback.push("Add uppercase letters")
    
    if (/[0-9]/.test(password)) score += 5
    else feedback.push("Add numbers")
    
    if (/[^A-Za-z0-9]/.test(password)) score += 10
    else feedback.push("Add symbols")

    // Pattern analysis
    if (password.length >= 16) score += 15
    if (password.length >= 20) score += 10
    
    // Entropy and randomness bonus
    const uniqueChars = new Set(password).size
    if (uniqueChars / password.length > 0.7) score += 15
    
    // Sequential or repeated character penalty
    if (/(.)\1{2,}/.test(password)) score -= 10
    if (/123|abc|qwe/i.test(password)) score -= 15

    // Determine level and color
    let level: PasswordStrength['level']
    let color: string

    if (score >= 85) {
      level = 'Very Strong'
      color = 'text-green-600'
    } else if (score >= 70) {
      level = 'Strong'
      color = 'text-green-500'
    } else if (score >= 55) {
      level = 'Good'
      color = 'text-blue-500'
    } else if (score >= 40) {
      level = 'Fair'
      color = 'text-yellow-500'
    } else if (score >= 25) {
      level = 'Weak'
      color = 'text-orange-500'
    } else {
      level = 'Very Weak'
      color = 'text-red-500'
    }

    return { score: Math.max(0, Math.min(100, score)), level, color, feedback }
  }, [])

  const generateSecurePassword = useCallback((opts: PasswordOptions): string => {
    let charset = ''
    
    if (opts.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (opts.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (opts.includeNumbers) charset += '0123456789'
    if (opts.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    // Remove similar characters if requested
    if (opts.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '')
    }
    
    // Remove ambiguous characters if requested
    if (opts.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;.<>]/g, '')
    }

    if (!charset) {
      throw new Error('No character set selected')
    }

    // Use crypto.getRandomValues for cryptographically secure randomness
    const array = new Uint32Array(opts.length)
    crypto.getRandomValues(array)
    
    return Array.from(array, (x) => charset[x % charset.length]).join('')
  }, [])

  const generatePasswords = useCallback(() => {
    try {
      const newPasswords: string[] = []
      for (let i = 0; i < passwordCount; i++) {
        newPasswords.push(generateSecurePassword(options))
      }
      setPasswords(newPasswords)
    } catch (error) {
      console.error('Error generating passwords:', error)
    }
  }, [options, passwordCount, generateSecurePassword])

  const copyToClipboard = async (password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(index)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadPasswords = () => {
    const content = passwords.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `passwords-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Generate initial passwords
  useEffect(() => {
    generatePasswords()
  }, [])

  const hasValidOptions = options.includeUppercase || options.includeLowercase || 
                         options.includeNumbers || options.includeSymbols

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Configuration
          </CardTitle>
          <CardDescription>
            Customize your password generation settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Length Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Password Length</Label>
              <span className="text-sm font-medium">{options.length} characters</span>
            </div>
            <Slider
              value={[options.length]}
              onValueChange={(value) => setOptions(prev => ({ ...prev, length: value[0] }))}
              min={8}
              max={128}
              step={1}
              className="w-full"
            />
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="uppercase"
                  checked={options.includeUppercase}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeUppercase: checked }))}
                />
                <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="lowercase"
                  checked={options.includeLowercase}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeLowercase: checked }))}
                />
                <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="numbers"
                  checked={options.includeNumbers}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeNumbers: checked }))}
                />
                <Label htmlFor="numbers">Numbers (0-9)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="symbols"
                  checked={options.includeSymbols}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeSymbols: checked }))}
                />
                <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="exclude-similar"
                  checked={options.excludeSimilar}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, excludeSimilar: checked }))}
                />
                <Label htmlFor="exclude-similar">Exclude Similar (i, l, 1, L, o, 0, O)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="exclude-ambiguous"
                  checked={options.excludeAmbiguous}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, excludeAmbiguous: checked }))}
                />
                <Label htmlFor="exclude-ambiguous">Exclude Ambiguous ({ }, [ ], ( ), /, \, ', ", ~, ,, ;, ., &lt;, &gt;)</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-count">Number of Passwords</Label>
                <Input
                  id="password-count"
                  type="number"
                  min="1"
                  max="50"
                  value={passwordCount}
                  onChange={(e) => setPasswordCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  className="w-24"
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex flex-col md:!flex-row gap-2">
            <Button
              onClick={generatePasswords}
              disabled={!hasValidOptions}
              className="flex items-center gap-2 w-full xs3:w-auto justify-center"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Generate {passwordCount > 1 ? 'Passwords' : 'Password'}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center gap-2 w-full xs3:w-auto justify-center"
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPasswords ? 'Hide' : 'Show'}
            </Button>
          </div>

          {!hasValidOptions && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Please select at least one character type
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Passwords */}
      {passwords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Generated Passwords
              {passwords.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPasswords}
                  className="ml-auto flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Click to copy individual passwords or download all
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {passwords.map((password, index) => {
              const strength = analyzePasswordStrength(password)
              return (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  {/* Password Display */}
                  <div className="flex flex-col md:!flex-row items-stretch md:items-center gap-2">
                    <div className="flex-1 font-mono text-lg bg-muted p-3 rounded border break-all">
                      {showPasswords ? password : '•'.repeat(password.length)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(password, index)}
                      className="flex items-center gap-2 sm:w-auto w-full justify-center"
                    >
                      {copied === index ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied === index ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>

                  {/* Strength Analysis */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Strength:</span>
                      <Badge variant="secondary" className={strength.color}>
                        {strength.level}
                      </Badge>
                    </div>
                    <Progress value={strength.score} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Score: {strength.score}/100
                    </div>
                    {strength.feedback.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Suggestions:</strong> {strength.feedback.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Security Notice
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your passwords are generated locally in your browser using cryptographically secure random number generation. 
                We never store, transmit, or log your passwords. For maximum security, use a unique password for each account 
                and enable two-factor authentication where available.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
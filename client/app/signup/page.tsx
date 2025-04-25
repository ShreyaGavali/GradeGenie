
"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, BookOpen, Shield, Sparkles, CheckIcon, ArrowLeft, ShieldCheck } from "lucide-react"
import { Logo } from "@/components/logo"

function GoogleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function MicrosoftIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="23" height="23" {...props}>
      <path fill="#f1511b" d="M1 1h10v10H1z" />
      <path fill="#80cc28" d="M12 1h10v10H12z" />
      <path fill="#00adef" d="M1 12h10v10H1z" />
      <path fill="#fbbc09" d="M12 12h10v10H12z" />
    </svg>
  )
}

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // const handleContinue = (e) => {
  //   e.preventDefault()
  //   setStep(step + 1)
  // }

  const handleContinue = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
  
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || "Signup failed")
      }
  
      setStep(step + 1) // move to next step
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  

  const handleBack = () => {
    setStep(step - 1)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
      <div className="mx-auto w-full max-w-4xl grid md:grid-cols-5 gap-6">
        {/* Left Side */}
        <div className="md:col-span-2 hidden md:flex flex-col justify-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Unlock Effortless Teaching with Your AI Assistant</h2>
            <p className="text-muted-foreground">Join a community of educators who are transforming their classrooms with the power of AI.</p>
          </div>
          <div className="space-y-6">
            {[{
              icon: <Zap className="h-5 w-5 text-primary" />, title: "Reclaim Your Time", text: "Automate tedious tasks and focus on what you love: connecting with students."
            }, {
              icon: <BookOpen className="h-5 w-5 text-primary" />, title: "Elevate Student Success", text: "Provide personalized feedback that fosters growth and understanding."
            }, {
              icon: <Shield className="h-5 w-5 text-primary" />, title: "Maintain Academic Integrity", text: "Confidently uphold standards with advanced AI and plagiarism detection."
            }].map((item, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="mt-0.5 bg-primary/10 p-2 rounded-full">{item.icon}</div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <Card className="md:col-span-3 w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <Logo size="md" />
            </div>
            <CardTitle className="text-center text-2xl font-bold">{step === 1 ? "Get Started" : "Complete Registration"}</CardTitle>
            <CardDescription className="text-center">
              {step === 1 ? "Join GradeGenie for free — no payment required" : "You're almost there — just a few more details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 ? (
              <form onSubmit={handleContinue} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <GoogleIcon className="mr-2 h-5 w-5" /> Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MicrosoftIcon className="mr-2 h-5 w-5" /> Microsoft
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
                  </div>
                </div>
                <Button className="w-full py-6 text-base" type="submit">Continue</Button>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">You now have full access to GradeGenie tools. Start exploring and enhancing your teaching experience!</p>
                <Button className="w-full py-6 text-base" asChild>
                  <Link href="/dashboard/assignments">Go to Dashboard</Link>
                </Button>
                <Button variant="ghost" onClick={handleBack} className="mt-2">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-sm">
              Already have an account? <Link href="/login" className="font-medium text-primary underline">Log in</Link>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500">
              <ShieldCheck className="mr-1 h-3 w-3" /> Secure login
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


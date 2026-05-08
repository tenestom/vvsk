"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions/auth"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
    }
    
    setIsPending(false)
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <Card className="w-full max-w-md shadow-soft border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold font-heading text-slate-900">Admin Login</CardTitle>
          <p className="text-slate-500 text-sm">Logga in för att hantera anmälningar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-postadress</Label>
              <Input id="email" name="email" type="email" placeholder="admin@exempel.se" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lösenord</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Loggar in..." : "Logga in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

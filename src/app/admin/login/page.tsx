import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions/auth"

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <Card className="w-full max-w-md shadow-soft border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold font-heading text-slate-900">Admin Login</CardTitle>
          <p className="text-slate-500 text-sm">Logga in för att hantera anmälningar</p>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-postadress</Label>
              <Input id="email" name="email" type="email" placeholder="admin@exempel.se" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lösenord</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Logga in
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

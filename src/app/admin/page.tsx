import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-heading text-slate-900">Admin Dashboard</h1>
        <form action={logout}>
          <Button variant="outline" type="submit">Logga ut</Button>
        </form>
      </header>
      
      <main>
        <p className="text-slate-600">Admin panelen byggs i steg 11.</p>
      </main>
    </div>
  )
}

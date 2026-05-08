import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, CreditCard } from "lucide-react"
import { AdminRegistrationsTable } from "@/components/AdminRegistrationsTable"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch all registrations
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching registrations:", error)
  }

  const regs = registrations || []

  // Calculate stats
  const totalParticipants = regs.length
  const expectedRevenue = regs.reduce((sum, r) => sum + r.total_price, 0)
  const paidRevenue = regs.filter(r => r.paid).reduce((sum, r) => sum + r.total_price, 0)

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Översikt över anmälningar till vattenskidskolan.</p>
        </div>
        <form action={logout}>
          <Button variant="outline" type="submit">Logga ut</Button>
        </form>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Totalt antal deltagare</p>
              <h2 className="text-3xl font-bold text-slate-900">{totalParticipants}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-soft">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Förväntad intäkt (Betalt)</p>
              <h2 className="text-3xl font-bold text-slate-900">
                {expectedRevenue} kr <span className="text-sm font-normal text-slate-500">({paidRevenue} kr inbetalt)</span>
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Registrations Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-soft overflow-hidden">
        <AdminRegistrationsTable initialRegistrations={regs} />
      </div>
    </div>
  )
}

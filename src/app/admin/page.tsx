import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard } from "lucide-react"

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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const sessionLabels: Record<string, string> = {
    session_1: "Tillfälle 1",
    session_2: "Tillfälle 2",
    both: "Båda",
  }

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

      {/* Registrations Table */}
      <Card className="border-0 shadow-soft overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
          <CardTitle className="text-xl">Alla anmälningar</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Datum</th>
                <th className="px-6 py-4 font-medium">Deltagare</th>
                <th className="px-6 py-4 font-medium">Målsman 1</th>
                <th className="px-6 py-4 font-medium">Tillfälle</th>
                <th className="px-6 py-4 font-medium">Pris</th>
                <th className="px-6 py-4 font-medium">Betald</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {regs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Inga anmälningar hittades.
                  </td>
                </tr>
              ) : (
                regs.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(reg.created_at)}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{reg.participant_name}</td>
                    <td className="px-6 py-4">
                      <div>{reg.guardian1_name}</div>
                      <div className="text-xs text-slate-400">{reg.guardian1_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sessionLabels[reg.selected_session] || reg.selected_session}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{reg.total_price} kr</td>
                    <td className="px-6 py-4">
                      {reg.paid ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Ja
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Nej
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

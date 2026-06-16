import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, CreditCard } from "lucide-react"
import Link from "next/link"
import { AdminRegistrationsTable } from "@/components/AdminRegistrationsTable"
import { AdminProductsTable } from "@/components/AdminProductsTable"
import { AdminMembers } from "@/components/AdminMembers"

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams
  const activeTab = tab || "registrations"
  
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

  // Fetch all products
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (prodError) {
    console.error("Error fetching products:", prodError)
  }

  const prods = products || []

  // Fetch members
  const { data: members, error: memError } = await supabase
    .from("members")
    .select("*")
    .order("name", { ascending: true })

  if (memError) {
    console.error("Error fetching members:", memError)
  }
  const mems = members || []

  // Fetch attendance
  const { data: attendance, error: attError } = await supabase
    .from("lok_attendance")
    .select("*")

  if (attError) {
    console.error("Error fetching attendance:", attError)
  }
  const atts = attendance || []

  // Calculate stats
  const totalParticipants = regs.length
  const expectedRevenue = regs.reduce((sum, r) => sum + r.total_price, 0)
  const paidRevenue = regs.filter(r => r.paid).reduce((sum, r) => sum + r.total_price, 0)

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900">
            {activeTab === 'members' ? 'Medlemsregister' : 'Admin Dashboard'}
          </h1>
          <p className="text-slate-500 mt-1">
            {activeTab === 'members' ? 'Hantera medlemmar och LOK-närvaro.' : 'Översikt över anmälningar till vattenskidskolan.'}
          </p>
        </div>
        <form action={logout}>
          <Button variant="outline" type="submit">Logga ut</Button>
        </form>
      </header>
      
      {/* Stats Cards */}
      {activeTab !== 'members' && (
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
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <Link 
          href="/admin?tab=registrations" 
          className={`pb-2 px-1 font-medium text-sm ${activeTab === 'registrations' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Anmälningar
        </Link>
        <Link 
          href="/admin?tab=products" 
          className={`pb-2 px-1 font-medium text-sm ${activeTab === 'products' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Produkter / Tillfällen
        </Link>
        <Link 
          href="/admin?tab=members" 
          className={`pb-2 px-1 font-medium text-sm ${activeTab === 'members' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Medlemmar (LOK)
        </Link>
      </div>

      {/* Interactive Content */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-soft overflow-hidden">
        {activeTab === 'members' ? (
          <AdminMembers initialMembers={mems} initialAttendance={atts} />
        ) : activeTab === 'products' ? (
          <AdminProductsTable initialProducts={prods} />
        ) : (
          <AdminRegistrationsTable initialRegistrations={regs} />
        )}
      </div>
    </div>
  )
}

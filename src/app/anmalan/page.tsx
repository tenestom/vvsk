import { Card, CardContent } from "@/components/ui/card"
import { RegistrationForm } from "@/components/RegistrationForm"
import { createClient } from "@/lib/supabase/server"

export default async function AnmalanPage() {
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("start_date", { ascending: true })

  if (error) {
    console.error("Error fetching products:", error)
  }

  const availableProducts = products || []

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900">Anmälan</h1>
          <p className="text-slate-600">Fyll i formuläret nedan för att anmäla dig till vattenskidskolan.</p>
        </div>
        
        <Card className="w-full shadow-soft border-0">
          <CardContent className="p-6 md:p-8">
            <RegistrationForm products={availableProducts} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

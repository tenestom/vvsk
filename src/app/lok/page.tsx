import { createClient } from "@/lib/supabase/server"
import { LokAttendanceForm } from "@/components/LokAttendanceForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function LokPage() {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching members for LOK:", error)
  }

  const mems = members || []

  const { data: attendance, error: attError } = await supabase
    .from("lok_attendance")
    .select("*")

  if (attError) {
    console.error("Error fetching attendance for LOK:", attError)
  }

  const atts = attendance || []

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <header className="max-w-3xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <Link href="/" className="inline-block">
            <Button variant="ghost" className="gap-2 -ml-4 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till startsidan
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold font-heading text-slate-900">Lokanmälningar</h1>
        <p className="text-slate-500 mt-1">Registrera närvaro för LOK-stöd.</p>
      </header>

      <LokAttendanceForm members={mems} initialAttendance={atts} />
    </div>
  )
}

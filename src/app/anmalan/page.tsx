import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnmalanPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 md:p-12">
      <Card className="w-full max-w-2xl shadow-soft border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-slate-900">Anmälan</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-slate-600">
          Registreringsformuläret byggs för närvarande. Vänligen återkom senare!
        </CardContent>
      </Card>
    </main>
  )
}

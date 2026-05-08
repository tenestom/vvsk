import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Anchor, ArrowRight, Download, Waves } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Header/Logo Area */}
      <header className="w-full px-6 py-8 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Waves className="w-7 h-7 text-primary" />
          </div>
          <span className="text-2xl font-bold font-heading tracking-tight text-slate-900">VVSK</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-6 md:px-12 py-12 md:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 max-w-7xl mx-auto">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-slate-900 leading-[1.1]">
            Anmälan till VVSK <span className="text-primary">vattenskidskola</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Välkommen till Vittsjös Vattenskidskola 2026! Använd länken nedan för att anmäla dig. Vi ses i sommar!
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/anmalan" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-lg h-14 px-8 gap-2 group">
                Anmäl dig här
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="aspect-[4/3] rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden relative shadow-soft flex items-center justify-center group">
            {/* Soft decorative background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-sky-300/20" />
            
            <div className="relative z-10 flex flex-col items-center gap-4 text-slate-400">
              <Anchor className="w-16 h-16 opacity-50" />
              <p className="font-medium">Platshållare för hjältebild</p>
            </div>
          </div>
        </div>
      </section>

      {/* Information / Invitation Section */}
      <section className="w-full px-6 md:px-12 py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-soft bg-white">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <h2 className="text-2xl font-bold font-heading text-slate-900">Ladda ner inbjudan</h2>
                <p className="text-slate-600">
                  Ladda ner vår officiella inbjudan för att läsa mer om tider, packlista och annan viktig information inför vattenskidskolan.
                </p>
              </div>
              <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Ladda ner inbjudan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

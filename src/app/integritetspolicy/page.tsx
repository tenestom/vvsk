import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function GDPRPage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="w-full max-w-3xl mx-auto space-y-8 bg-white p-8 md:p-12 rounded-2xl shadow-soft border border-slate-200">
        <div>
          <Link href="/">
            <Button variant="ghost" className="mb-6 -ml-4 gap-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till startsidan
            </Button>
          </Link>
          <h1 className="text-3xl font-bold font-heading text-slate-900 mb-6">Integritetspolicy (GDPR)</h1>
          
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">1. Vilka uppgifter vi samlar in</h2>
              <p>När du anmäler dig till VVSK vattenskidskola samlar vi in följande personuppgifter:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Deltagarens namn och personnummer</li>
                <li>Målsmans namn, telefonnummer och e-postadress</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">2. Varför vi samlar in uppgifterna</h2>
              <p>Vi använder dina uppgifter uteslutande för att administrera vattenskidskolan. Detta inkluderar hantering av grupper, säkerhet under aktiviteterna samt för att kunna kontakta målsman vid behov eller för att skicka ut viktig information inför tillfällena.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">3. Säker lagring</h2>
              <p>Dina uppgifter lagras på ett säkert sätt i vår krypterade databas (Supabase). Endast behöriga administratörer i föreningen har tillgång till informationen.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">4. Delning av data</h2>
              <p>Vi säljer, byter eller delar <strong>aldrig</strong> dina personuppgifter med tredje part. Informationen används enbart internt inom VVSK.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">5. Dina rättigheter (Radering)</h2>
              <p>Du har rätt att när som helst begära att få dina uppgifter raderade ur våra system. Efter att sommarens skidskola är avslutad och redovisad kommer vi automatiskt att rensa bort känsliga anmälningsuppgifter. Om du önskar få dina uppgifter raderade omedelbart, vänligen kontakta oss på vår e-postadress.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

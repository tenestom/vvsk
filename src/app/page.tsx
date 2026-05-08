import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-screen">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
        VVSK Vattenskidskola
      </h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-8">
        Välkommen till vår vattenskidskola! Här lägger vi grunden för sommarens bästa upplevelser på vattnet.
      </p>
      
      <Button size="lg" className="text-lg px-8">
        Anmäl dig här
      </Button>
    </main>
  );
}

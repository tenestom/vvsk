# VVSK - Vattenskidskola Anmälan

Ett modernt anmälningssystem för vattenskidskola, byggt med Next.js, Tailwind CSS och Supabase.

## Funktioner
- Anmälan för deltagare och målsmän
- Val av tillfällen
- Dynamisk prisberäkning
- Automatiskt bekräftelsemejl (kommer snart)
- Adminpanel för hantering av anmälningar (kommer snart)

## Kom igång lokalt

1. Klona arkivet
2. Kopiera `.env.example` till `.env.local` och fyll i dina Supabase-nycklar:
   ```bash
   cp .env.example .env.local
   ```
3. Installera beroenden:
   ```bash
   npm install
   ```
4. Starta utvecklingsservern:
   ```bash
   npm run dev
   ```

## Databas (Supabase)

Databasen innehåller en tabell `registrations`. 
För att sätta upp Supabase:
1. Skapa ett nytt projekt på Supabase.
2. Kör SQL-koden (som kommer att finnas i `/supabase/schema.sql`) i SQL Editor på Supabase.
3. Kopiera dina API-nycklar (URL och Anon Key) från Project Settings > API och klistra in i `.env.local`.

## Vercel Deployment

Detta projekt är optimerat för att driftsättas på Vercel. 
Anslut ditt GitHub-repository till Vercel och lägg till miljövariablerna i projektinställningarna.

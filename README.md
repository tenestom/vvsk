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
Anslut ditt GitHub-repository till Vercel. Innan du bygger, se till att lägga in följande miljövariabler under **Settings > Environment Variables**:

| Variabel | Beskrivning |
| :--- | :--- |
| \`NEXT_PUBLIC_SUPABASE_URL\` | Din Supabase projekt URL |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Din publika anon key från Supabase |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Din service role key (används för admin-funktioner) |
| \`RESEND_API_KEY\` | Din API-nyckel från Resend för att skicka bekräftelsemejl |

Klicka sedan på **Deploy**. Vercel kommer automatiskt att bygga och publicera applikationen.

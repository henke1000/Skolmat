# Skolmat röster

En gratis mobilanpassad Next.js/PWA där elever röstar på veckans skolmat genom att swipea höger eller vänster. Ingen inloggning behövs. Appen skapar ett anonymt `voter_id` i `localStorage` och Supabase-tabellen `votes` har en unik regel som hindrar samma webbläsare från att rösta flera gånger på samma maträtt.

## Funktioner

- `/` visar veckans maträtter ett kort i taget.
- Swipe höger eller knappen `❤️ Gillar` sparar en positiv röst.
- Swipe vänster eller knappen `👎 Gillar inte` sparar en negativ röst.
- `/topplista` visar alla maträtter sorterade efter högst andel positiva röster.
- `/admin?key=byt-denna-kod` låter dig lägga till och ta bort maträtter.
- PWA-stöd med manifest och service worker.

## Kom igång lokalt

1. Installera beroenden:

```bash
npm install
```

2. Skapa en Supabase-databas.

3. Öppna Supabase SQL Editor och kör filen:

```text
sql/schema.sql
```

4. Kopiera miljöfilen:

```bash
cp .env.example .env.local
```

5. Fyll i `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://din-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-key
ADMIN_KEY=byt-denna-kod
```

6. Starta utvecklingsservern:

```bash
npm run dev
```

Öppna `http://localhost:3000`.

## Supabase

Databasen består av:

- `meals`: maträtter och vecka.
- `votes`: röster med `meal_id`, `vote` och anonymt `voter_id`.

Viktig regel:

```sql
unique(meal_id, voter_id)
```

Den gör att samma webbläsare bara kan rösta en gång per maträtt.

## Admin

Adminsidan har ingen riktig inloggning. Den skyddas av URL-parametern `key`:

```text
/admin?key=byt-denna-kod
```

Byt `ADMIN_KEY` i `.env.local` och i Vercel. Detta är avsiktligt enkelt för en skol-/demoapp. Eftersom appen saknar riktig inloggning ska den inte användas för känsliga val.

## Publicera gratis på Vercel

1. Lägg projektet på GitHub.
2. Gå till [Vercel](https://vercel.com/) och välj `Add New Project`.
3. Importera GitHub-repot.
4. Lägg till dessa Environment Variables i Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_KEY`
5. Deploya.

Vercel känner normalt igen Next.js automatiskt. Build command är `npm run build` och output hanteras av Vercel.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```

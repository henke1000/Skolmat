export function SetupError({ message }: { message: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <section className="rounded-[28px] bg-white p-6 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">Konfiguration saknas</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Appen behöver Supabase-inställningar</h1>
        <p className="mt-4 text-base font-bold text-slate-700">{message}</p>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
          <p>Lägg in dessa Environment Variables i Vercel och deploya om:</p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-white">
            NEXT_PUBLIC_SUPABASE_URL{"\n"}
            NEXT_PUBLIC_SUPABASE_ANON_KEY{"\n"}
            ADMIN_KEY
          </pre>
        </div>
      </section>
    </main>
  );
}

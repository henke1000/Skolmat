import { AdminPanel } from "@/components/AdminPanel";
import { AppNav } from "@/components/AppNav";

export const dynamic = "force-dynamic";

export default function AdminPage({ searchParams }: { searchParams: { key?: string } }) {
  const adminKey = searchParams.key ?? "";
  const isConfigured = Boolean(process.env.ADMIN_KEY);
  const isAllowed = isConfigured && adminKey === process.env.ADMIN_KEY;

  return (
    <>
      <AppNav />
      <main className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6">
        <section className="py-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-700">Admin</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950 sm:text-5xl">Maträtter</h1>
        </section>

        {!isConfigured ? (
          <div className="rounded-[28px] bg-white p-6 text-lg font-bold text-rose-700 shadow-soft">
            ADMIN_KEY saknas i miljövariablerna.
          </div>
        ) : !isAllowed ? (
          <div className="rounded-[28px] bg-white p-6 text-lg font-bold text-slate-800 shadow-soft">
            Lägg till rätt kod i URL:en, till exempel <span className="break-all text-teal-700">/admin?key=byt-denna-kod</span>.
          </div>
        ) : (
          <AdminPanel adminKey={adminKey} />
        )}
      </main>
    </>
  );
}

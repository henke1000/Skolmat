import Link from "next/link";

export function AppNav() {
  return (
    <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
      <Link className="text-lg font-black tracking-normal text-slate-950" href="/">
        Skolmat
      </Link>
      <div className="flex items-center gap-2 text-sm font-bold">
        <Link className="rounded-full bg-white/70 px-4 py-2 text-slate-800 shadow-sm" href="/">
          Rösta
        </Link>
        <Link className="rounded-full bg-white/70 px-4 py-2 text-slate-800 shadow-sm" href="/topplista">
          Topplista
        </Link>
      </div>
    </nav>
  );
}

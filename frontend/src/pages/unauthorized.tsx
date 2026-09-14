import { Link } from "wouter";
import { LockKeyhole, Zap } from "lucide-react";

export function UnauthorizedPage() {
  return (
    <div className="grain flex min-h-[100dvh] items-center justify-center bg-[#f3f1e9] px-6 text-[#f3f1e9]">
      <div className="w-full max-w-md text-center animate-rise-in">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#c7f36b] text-[#182022] shadow-[4px_4px_0_#182022]">
          <LockKeyhole size={25} />
        </div>
        <h1 className="mt-8 font-display text-5xl tracking-[-.01em] text-[#182022]">
          401 - Unauthorized.
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-[#182022]/55">
          You need to be logged in to access this page, Please visit login page
        </p>
        <Link
          href="/login"
          data-testid="link-unauthorized-login"
          className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#c7f36b] px-5 py-3 text-sm font-bold text-[#182022] transition-transform hover:-translate-y-0.5"
        >
          <Zap size={16} /> Go to log in
        </Link>
      </div>
    </div>
  );
}

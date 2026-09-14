import { Clock3, LogIn } from "lucide-react";

export function SessionExpiredPage() {
  return (
    <div className="grain fixed inset-0 z-[100] flex h-[100dvh] items-center justify-center overflow-y-auto bg-[#182022]/80 px-6 py-8 text-[#f3f1e9] backdrop-blur-sm">
      <div className="w-full max-w-lg text-center animate-rise-in">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-expired-title"
          className="mt-8 rounded-[1.5rem] border border-[#f3f1e9]/15 bg-[#f3f1e9] p-7 shadow-2xl sm:p-10"
        >
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#c7f36b] text-[#182022] shadow-[4px_4px_0_#182022]">
            <Clock3 size={28} />
          </div>
          <h1
            id="session-expired-title"
            className="mt-4 font-display text-5xl tracking-[-.06em] text-[#182022] sm:text-6xl"
          >
            Session expired.
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-[#182022]/60">
            Your session expired. Please login again.
          </p>
          <a
            href="/login"
            data-testid="link-session-expired-login"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#c7f36b] px-5 py-3 text-sm font-bold text-[#182022] transition-transform hover:-translate-y-0.5"
          >
            <LogIn size={16} /> Go to login
          </a>
        </div>
      </div>
    </div>
  );
}

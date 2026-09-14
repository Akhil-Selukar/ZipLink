import { useState, type ReactNode } from "react";
import {
  BarChart3,
  ChevronRight,
  Clipboard,
  ExternalLink,
  History,
  LogOut,
  Plus,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { clearAuth, getUsername } from "@/lib/auth";
import { logout } from "@/lib/api";

function BrandMark() {
  return (
    <div className="flex items-center gap-3" data-testid="brand-ziplink">
      <span className="grid size-9 place-items-center rounded-xl bg-[#c7f36b] text-[#182022] shadow-[3px_3px_0_#182022]">
        <Zap size={18} strokeWidth={2.8} />
      </span>
      <span className="font-display text-[1.45rem] tracking-[-.045em]">
        ziplink
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const username = getUsername();
  const onLogout = async () => {
    await logout();
    clearAuth();
    setLocation("/login");
  };
  return (
    <div className="grain min-h-[100dvh] bg-[#f3f1e9] text-[#182022]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[246px] flex-col border-r border-[#182022]/10 bg-[#ebe9df] px-5 py-6 lg:flex">
        <BrandMark />
        <div className="mt-16 px-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#182022]/40">
          Quick links
        </div>
        <nav className="mt-3 space-y-1" aria-label="Primary">
          <Link
            href="/dashboard"
            data-testid="link-dashboard"
            className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${location === "/dashboard" ? "bg-[#182022] text-[#f3f1e9]" : "text-[#182022]/60 hover:bg-[#deddd2] hover:text-[#182022]"}`}
          >
            <Plus size={17} /> Create a link{" "}
            <ChevronRight
              size={14}
              className={`ml-auto transition-transform ${location === "/dashboard" ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"}`}
            />
          </Link>
          <Link
            href="/analytics"
            data-testid="link-analytics"
            className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${location === "/analytics" ? "bg-[#182022] text-[#f3f1e9]" : "text-[#182022]/60 hover:bg-[#deddd2] hover:text-[#182022]"}`}
          >
            <BarChart3 size={17} /> Analytics{" "}
            <ChevronRight
              size={14}
              className={`ml-auto transition-transform ${location === "/analytics" ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"}`}
            />
          </Link>
          <Link
            href="/urls"
            data-testid="link-urls"
            className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${location === "/urls" ? "bg-[#182022] text-[#f3f1e9]" : "text-[#182022]/60 hover:bg-[#deddd2] hover:text-[#182022]"}`}
          >
            <History size={17} /> Your URLs{" "}
            <ChevronRight
              size={14}
              className={`ml-auto transition-transform ${location === "/urls" ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"}`}
            />
          </Link>
        </nav>
        <div className="mt-auto">
          <div className="flex items-center gap-3 border-t border-[#182022]/10 pt-4">
            <div className="grid size-9 place-items-center rounded-full bg-[#f17b5a] font-mono text-xs font-bold text-[#182022]">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold">{username}</div>
              <div className="text-[11px] text-[#182022]/45">
                Personal workspace
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              data-testid="button-logout"
              aria-label="Log out"
              className="rounded-lg p-2 text-[#182022]/45 transition-colors hover:bg-[#deddd2] hover:text-[#182022]"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#182022]/10 bg-[#f3f1e9]/90 px-5 py-4 backdrop-blur lg:hidden">
        <BrandMark />
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          data-testid="button-mobile-menu"
          className="rounded-lg border border-[#182022]/15 px-3 py-2 text-xs font-bold"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>
      {menuOpen && (
        <div className="absolute right-4 top-[72px] z-40 w-56 rounded-2xl border border-[#182022]/15 bg-[#f8f6ef] p-2 shadow-xl lg:hidden">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            data-testid="link-mobile-dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-[#ebe9df]"
          >
            <Plus size={16} /> Create a link
          </Link>
          <Link
            href="/analytics"
            onClick={() => setMenuOpen(false)}
            data-testid="link-mobile-analytics"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-[#ebe9df]"
          >
            <BarChart3 size={16} /> Analytics
          </Link>
          <Link
            href="/urls"
            onClick={() => setMenuOpen(false)}
            data-testid="link-mobile-urls"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-[#ebe9df]"
          >
            <History size={16} /> Your URLs
          </Link>
          <button
            type="button"
            onClick={onLogout}
            data-testid="button-mobile-logout"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#a44834] hover:bg-[#f5ded7]"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
      <main className="min-h-[100dvh] lg:ml-[246px]">{children}</main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#182022]/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="animate-rise-in">
        <h1 className="mt-3 font-display text-4xl leading-[.96] tracking-[-.045em] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#182022]/55">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function CopyButton({
  value,
  compact = false,
}: {
  value: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      data-testid="button-copy-short-url"
      className={`inline-flex items-center gap-2 rounded-xl font-bold transition-all ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} ${copied ? "bg-[#c7f36b] text-[#182022]" : "bg-[#182022] text-[#f3f1e9] hover:bg-[#344346]"}`}
    >
      <Clipboard size={compact ? 14 : 16} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function ExternalLinkButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-testid="link-open-short-url"
      className="inline-flex items-center gap-2 rounded-xl border border-[#182022]/15 px-4 py-3 text-sm font-bold transition-colors hover:bg-[#ebe9df]"
    >
      <ExternalLink size={16} /> Open
    </a>
  );
}

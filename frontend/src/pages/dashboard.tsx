import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  CircleHelp,
  Link2,
  Loader2,
  Scissors,
  Sparkles,
} from "lucide-react";
import { shorten } from "@/lib/api";
import {
  CopyButton,
  ExternalLinkButton,
  PageHeader,
} from "@/components/ziplink-shell";

function FieldHint({ id, children }: { id: string; children: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={`More information about ${id}`}
        aria-describedby={`${id}-hint`}
        className="grid size-5 place-items-center rounded-full text-[#182022]/35 transition-colors hover:bg-[#deddd2] hover:text-[#182022] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75885d]"
      >
        <CircleHelp size={14} />
      </button>
      <span
        id={`${id}-hint`}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-64 rounded-xl bg-[#182022] p-3 text-left text-[11px] font-medium leading-relaxed text-[#f3f1e9] shadow-xl group-hover:block group-focus-within:block sm:left-1/2 sm:-translate-x-1/2"
      >
        {children}
      </span>
    </span>
  );
}

export function DashboardPage() {
  const [longUrl, setLongUrl] = useState("");
  const [urlName, setUrlName] = useState("");
  const [result, setResult] = useState<{ shortUrl: string } | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setResult(null);
    if (!longUrl.trim() || !urlName.trim()) {
      setError("Both fields are needed to make a link.");
      return;
    }
    setPending(true);
    try {
      setResult(await shorten(longUrl.trim(), urlName.trim()));
      setLongUrl("");
      setUrlName("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The link could not be shortened.",
      );
    } finally {
      setPending(false);
    }
  };
  // Render the parsed short-link response or the composed empty state.
  return (
    <div className="editorial-grid min-h-[100dvh] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-[1120px]">
        <PageHeader
          title={
            <>
              <span className="text-[#f17b5a]">Shrink </span> your links here!
            </>
          }
          description="Turn long, complicated URLs into short, simple links in just one click"
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <section
            className="animate-rise-in rounded-[1.5rem] border border-[#182022]/15 bg-[#f8f6ef] p-5 shadow-[6px_6px_0_rgba(24,32,34,.08)] sm:p-8"
            style={{ animationDelay: "90ms" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#182022]/45">
                  <Scissors size={14} /> Create your short link
                </div>
                <h2 className="mt-3 font-display text-3xl tracking-[-.04em]">
                  Start here.
                </h2>
              </div>
            </div>
            <form onSubmit={submit} className="mt-8 space-y-6">
              <label className="block" htmlFor="longUrl">
                <span className="mb-2 flex items-center justify-between text-xs font-bold text-[#182022]/65">
                  <span className="flex items-center gap-2">
                    Long URL{" "}
                    <FieldHint id="long-url">
                      Paste the complete destination URL you want to shorten,
                      including the "https://" part.
                    </FieldHint>
                  </span>
                </span>
                <input
                  id="longUrl"
                  type="url"
                  required
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://exampleDomain.com/..."
                  data-testid="input-long-url"
                  className="h-14 w-full rounded-xl border border-[#182022]/15 bg-[#ebe9df]/45 px-4 font-mono text-sm outline-none transition-all placeholder:text-[#182022]/25 focus:border-[#75885d] focus:bg-[#f8f6ef] focus:ring-4 focus:ring-[#c7f36b]/20"
                />
              </label>
              <label className="block" htmlFor="urlName">
                <span className="mb-2 flex items-center justify-between text-xs font-bold text-[#182022]/65">
                  <span className="flex items-center gap-2">
                    Short name{" "}
                    <FieldHint id="short-name">
                      Choose a memorable name for this link (This is NOT the
                      short url).
                    </FieldHint>
                  </span>
                </span>
                <div className="flex h-14 items-center rounded-xl border border-[#182022]/15 bg-[#ebe9df]/45 transition-all focus-within:border-[#75885d] focus-within:bg-[#f8f6ef] focus-within:ring-4 focus-within:ring-[#c7f36b]/20">
                  <span className="pl-4 font-mono text-sm text-[#182022]/35"></span>
                  <input
                    id="urlName"
                    required
                    value={urlName}
                    onChange={(e) => setUrlName(e.target.value)}
                    placeholder="your memorable name"
                    data-testid="input-url-name"
                    className="h-full min-w-0 flex-1 bg-transparent px-2 pr-4 font-mono text-sm outline-none placeholder:text-[#182022]/25"
                  />
                </div>
              </label>
              {error && (
                <div
                  role="alert"
                  data-testid="status-shortening-error"
                  className="rounded-xl border border-[#f17b5a]/45 bg-[#f5ded7] px-4 py-3 text-sm text-[#8d3d2b]"
                >
                  {error}
                </div>
              )}
              <button
                disabled={pending}
                type="submit"
                data-testid="button-shorten"
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#c7f36b] text-sm font-bold text-[#182022] shadow-[3px_3px_0_#182022] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#182022] active:translate-y-0 active:shadow-[2px_2px_0_#182022] disabled:cursor-wait disabled:opacity-70"
              >
                {pending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Making it
                    neat.
                  </>
                ) : (
                  <>
                    Shorten this link{" "}
                    <ArrowUpRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </>
                )}
              </button>
            </form>
          </section>
          <section
            className="animate-rise-in rounded-[1.5rem] border border-[#182022]/15 bg-[#182022] p-5 text-[#f3f1e9] sm:p-8"
            style={{ animationDelay: "160ms" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#c7f36b]">
                  <Sparkles size={14} /> Latest result
                </div>
                <h2 className="mt-3 font-display text-3xl tracking-[-.04em]">
                  Ready to share.
                </h2>
              </div>
            </div>
            {result ? (
              <div className="mt-12 animate-rise-in">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[.16em] text-[#f3f1e9]/45">
                  Your short URL is
                </div>
                <div
                  data-testid="text-short-url"
                  className="break-all rounded-xl border border-[#f3f1e9]/15 bg-[#f3f1e9]/[.06] p-4 font-mono text-lg leading-relaxed text-[#c7f36b]"
                >
                  {result.shortUrl}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <CopyButton value={result.shortUrl} />
                  <ExternalLinkButton href={result.shortUrl} />
                </div>
                <div className="mt-10 flex items-center gap-2 text-xs text-[#f3f1e9]/45">
                  <Check size={14} className="text-[#c7f36b]" /> Saved to your
                  links
                </div>
              </div>
            ) : (
              <div
                data-testid="empty-latest-result"
                className="flex min-h-[250px] flex-col items-center justify-center text-center"
              >
                <div className="grid size-16 place-items-center rounded-2xl border border-[#f3f1e9]/15 text-[#f3f1e9]/25">
                  <Link2 size={26} />
                </div>
                <p className="mt-5 font-display text-2xl text-[#f3f1e9]/75">
                  No url created yet.
                </p>
                <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-[#f3f1e9]/40">
                  Your newly created short link will appear here, ready to copy.
                </p>
              </div>
            )}
          </section>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border-t border-[#182022]/15 pt-4">
            <p className="mt-2 text-sm font-semibold">Step 1:</p>
            <p>- Paste your long url</p>
            <p>- Give a name you can identify</p>
            <p>- Click 'shorten this link button'</p>
          </div>
          <div className="border-t border-[#182022]/15 pt-4">
            <p className="mt-2 text-sm font-semibold">Step 2:</p>
            <p>- Seat back, relax and let us do the magic.</p>
            <p>- Share your short link to your contacts.</p>
          </div>
          <div className="border-t border-[#182022]/15 pt-4">
            <p className="mt-2 text-sm font-semibold">Step 3:</p>
            <p>- See what gets attention using analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import {
  ExternalLink,
  History,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { deleteUrl, getUrls, type UrlItem } from "@/lib/api";
import { CopyButton, PageHeader } from "@/components/ziplink-shell";
import { toast } from "@/hooks/use-toast";

const REDIRECT_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/r/";

function linkHref(shortUrl: string) {
  return /^https?:\/\//i.test(shortUrl)
    ? shortUrl
    : `${REDIRECT_BASE_URL}${shortUrl}`;
}

export function UrlsPage() {
  const [rows, setRows] = useState<UrlItem[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await getUrls());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No url's. to show, please try creating one..!!",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (row: UrlItem) => {
    setDeleting(row.shortUrl);
    try {
      const deleted = await deleteUrl(row.shortUrl);
      if (deleted > 0) {
        setRows(
          (current) =>
            current?.filter((item) => item.shortUrl !== row.shortUrl) ??
            current,
        );
        toast({ title: "URL deleted successfully" });
      } else {
        toast({ title: "No URL found to delete", variant: "destructive" });
      }
    } catch (err) {
      toast({
        title: "Could not delete URL",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="editorial-grid min-h-[100dvh] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-[1120px]">
        <PageHeader
          title={
            <>
              See
              <span className="text-[#f17b5a]"> all links </span>
              created by you
            </>
          }
          description="View and manage every short link you have created."
          action={
            <button
              type="button"
              onClick={() => void load()}
              data-testid="button-refresh-urls"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-[#182022]/15 bg-[#f8f6ef] px-4 py-3 text-xs font-bold transition-colors hover:bg-[#ebe9df] sm:self-auto"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />{" "}
              Refresh
            </button>
          }
        />

        {loading && (
          <div
            data-testid="state-urls-loading"
            className="mt-10 overflow-hidden rounded-[1.5rem] border border-[#182022]/10 bg-[#f8f6ef]"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border-b border-[#182022]/[.08] px-5 py-6 last:border-0 sm:px-7"
              >
                <div className="space-y-2">
                  <span className="block h-4 w-32 animate-pulse-soft rounded bg-[#deddd2]" />
                  <span className="block h-3 w-56 animate-pulse-soft rounded bg-[#ebe9df]" />
                </div>
                <span className="h-9 w-20 animate-pulse-soft rounded-xl bg-[#ebe9df]" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div
            data-testid="state-urls-error"
            className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-[#f17b5a]/40 bg-[#f5ded7] p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="font-bold text-[#8d3d2b]">
                Couldn’t read your URLs.
              </div>
              <p className="mt-1 text-sm text-[#8d3d2b]/75">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => void load()}
              data-testid="button-retry-urls"
              className="rounded-xl bg-[#182022] px-4 py-2.5 text-sm font-bold text-[#f3f1e9]"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && rows && (
          <section className="mt-10 overflow-hidden rounded-[1.5rem] border border-[#182022]/10 bg-[#f8f6ef] shadow-[6px_6px_0_rgba(24,32,34,.06)]">
            <div className="flex items-center justify-between border-b border-[#182022]/10 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <History size={18} className="text-[#75885d]" />
                <div>
                  <h2 className="font-display text-2xl tracking-[-.04em]">
                    All your links
                  </h2>
                  <p className="mt-1 text-xs text-[#182022]/45">
                    links generated by you.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#ebe9df] px-3 py-1.5 font-mono text-[10px] font-bold text-[#182022]/50">
                {rows.length} {rows.length === 1 ? "link" : "links"}
              </span>
            </div>
            {rows.length === 0 ? (
              <div
                data-testid="state-urls-empty"
                className="px-6 py-16 text-center"
              >
                <History size={28} className="mx-auto text-[#182022]/25" />
                <p className="mt-4 font-display text-2xl">
                  No links created yet.
                </p>
                <p className="mt-2 text-sm text-[#182022]/50">
                  Create your first short link from the dashboard.
                </p>
              </div>
            ) : (
              rows.map((row, index) => {
                const href = linkHref(row.shortUrl);
                const isDeleting = deleting === row.shortUrl;
                return (
                  <div
                    key={`${row.urlName}-${row.shortUrl}`}
                    data-testid={`row-url-${row.urlName}`}
                    className="flex items-center gap-4 border-b border-[#182022]/[.08] px-5 py-5 last:border-0 transition-colors hover:bg-[#ebe9df]/50 sm:px-7"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#ebe9df] font-mono text-[10px] font-bold text-[#182022]/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        data-testid={`text-url-name-${row.urlName}`}
                        className="truncate font-mono text-sm font-bold"
                      >
                        {row.urlName}
                      </div>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`link-url-${row.urlName}`}
                        className="mt-1 block truncate font-mono text-[11px] text-[#182022]/40 hover:text-[#182022]"
                      >
                        {row.shortUrl}
                      </a>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                      <CopyButton value={href} compact />
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${row.urlName}`}
                        className="hidden rounded-lg p-2 text-[#182022]/35 hover:bg-[#deddd2] hover:text-[#182022] sm:block"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <button
                        type="button"
                        onClick={() => void remove(row)}
                        disabled={isDeleting}
                        data-testid={`button-delete-url-${row.urlName}`}
                        aria-label={`Delete ${row.urlName}`}
                        className="rounded-lg p-2 text-[#a44834]/70 transition-colors hover:bg-[#f5ded7] hover:text-[#a44834] disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  ExternalLink,
  Link2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { getAnalytics, type AnalyticsItem } from "@/lib/api";
import { CopyButton, PageHeader } from "@/components/ziplink-shell";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/r/";

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsItem[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getAnalytics());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Analytics could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const rows = useMemo(
    () => [...(data || [])].sort((a, b) => b.count - a.count),
    [data],
  );
  const totalClicks = rows.reduce((sum, row) => sum + row.count, 0);
  // Render the parsed analytics mapping as summaries, an ordered table, or a useful state.
  return (
    <div className="editorial-grid min-h-[100dvh] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-[1120px]">
        <PageHeader
          title={
            <>
              Top
              <span className="text-[#f17b5a]"> performing </span> links
            </>
          }
          description="Every link you make, in one place. A quiet read on what people actually choose to click."
          action={
            <button
              type="button"
              onClick={() => void load()}
              data-testid="button-refresh-analytics"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-[#182022]/15 bg-[#f8f6ef] px-4 py-3 text-xs font-bold transition-colors hover:bg-[#ebe9df] sm:self-auto"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />{" "}
              Refresh
            </button>
          }
        />
        {loading && (
          <div
            data-testid="state-analytics-loading"
            className="mt-10 overflow-hidden rounded-[1.5rem] border border-[#182022]/10 bg-[#f8f6ef]"
          >
            <div className="grid grid-cols-[1fr_140px] border-b border-[#182022]/10 px-6 py-4">
              <span className="h-3 w-24 animate-pulse-soft rounded bg-[#deddd2]" />
              <span className="h-3 w-16 animate-pulse-soft rounded bg-[#deddd2]" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-[1fr_140px] px-6 py-6">
                <span className="h-4 w-2/5 animate-pulse-soft rounded bg-[#ebe9df]" />
                <span className="h-4 w-10 animate-pulse-soft rounded bg-[#ebe9df]" />
              </div>
            ))}
          </div>
        )}
        {error && !loading && (
          <div
            data-testid="state-analytics-error"
            className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-[#f17b5a]/40 bg-[#f5ded7] p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="font-bold text-[#8d3d2b]">
                Couldn’t read the numbers.
              </div>
              <p className="mt-1 text-sm text-[#8d3d2b]/75">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => void load()}
              data-testid="button-retry-analytics"
              className="rounded-xl bg-[#182022] px-4 py-2.5 text-sm font-bold text-[#f3f1e9]"
            >
              Try again
            </button>
          </div>
        )}
        {!loading && !error && data && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#182022] p-5 text-[#f3f1e9]">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.14em] text-[#f3f1e9]/45">
                  <span>Total clicks</span>
                  <TrendingUp size={16} className="text-[#c7f36b]" />
                </div>
                <div
                  data-testid="text-total-clicks"
                  className="mt-5 font-display text-4xl tracking-[-.05em]"
                >
                  {totalClicks.toLocaleString()}
                </div>
              </div>
              <div className="rounded-2xl border border-[#182022]/15 bg-[#f8f6ef] p-5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.14em] text-[#182022]/45">
                  <span>Links made</span>
                  <Link2 size={16} className="text-[#f17b5a]" />
                </div>
                <div
                  data-testid="text-link-count"
                  className="mt-5 font-display text-4xl tracking-[-.05em]"
                >
                  {rows.length}
                </div>
              </div>
              <div className="rounded-2xl border border-[#182022]/15 bg-[#c7f36b] p-5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.14em] text-[#182022]/55">
                  <span>Top performer</span>
                  <BarChart3 size={16} />
                </div>
                <div
                  data-testid="text-top-link"
                  className="mt-5 truncate font-mono text-base font-bold"
                >
                  {rows[0]?.urlName || "—"}
                </div>
              </div>
            </div>
            {rows.length === 0 ? (
              <div
                data-testid="state-analytics-empty"
                className="mt-8 rounded-[1.5rem] border border-dashed border-[#182022]/20 bg-[#f8f6ef] px-6 py-20 text-center"
              >
                <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#ebe9df] text-[#182022]/35">
                  <BarChart3 size={25} />
                </div>
                <h2 className="mt-5 font-display text-3xl tracking-[-.04em]">
                  No links created yet.!!
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#182022]/50">
                  Create your first short link and its click story will start
                  here.
                </p>
              </div>
            ) : (
              <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#182022]/15 bg-[#f8f6ef]">
                <div className="flex items-center justify-between border-b border-[#182022]/10 px-5 py-5 sm:px-7">
                  <div>
                    <h2 className="font-display text-2xl tracking-[-.03em]">
                      Your links
                    </h2>
                    <p className="mt-1 text-xs text-[#182022]/45">
                      Sorted by attention
                    </p>
                  </div>
                  <span className="rounded-full bg-[#ebe9df] px-3 py-1.5 font-mono text-[10px] font-bold text-[#182022]/50">
                    {rows.length} {rows.length === 1 ? "link" : "links"}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_92px] border-b border-[#182022]/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#182022]/35 sm:grid-cols-[1fr_140px_90px] sm:px-7">
                  <span>Short name</span>
                  <span className="hidden sm:block">Destination</span>
                  <span className="text-right">Clicks</span>
                </div>
                {rows.map((row, index) => {
                  const shortUrl = `${API_BASE_URL}${row.shortUrl}`;

                  return (
                    <div
                      key={`${row.urlName}-${row.shortUrl}`}
                      data-testid={`row-analytics-${row.urlName}`}
                      className="group grid grid-cols-[1fr_92px] items-center border-b border-[#182022]/[.08] px-5 py-5 transition-colors last:border-0 hover:bg-[#ebe9df]/50 sm:grid-cols-[1fr_140px_90px] sm:px-7"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`grid size-8 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-bold ${index === 0 ? "bg-[#f17b5a] text-[#182022]" : "bg-[#ebe9df] text-[#182022]/50"}`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <div
                            data-testid={`text-link-name-${row.urlName}`}
                            className="truncate font-mono text-sm font-bold"
                          >
                            {row.urlName}
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-[#182022]/35 sm:hidden">
                            <Link2 size={11} /> {row.shortUrl}
                          </div>
                        </div>
                      </div>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden truncate font-mono text-[11px] text-[#182022]/40 hover:text-[#182022] sm:block"
                        data-testid={`link-analytics-destination-${row.urlName}`}
                      >
                        {row.shortUrl}
                      </a>
                      <div className="flex items-center justify-end gap-3">
                        <span
                          data-testid={`text-click-count-${row.urlName}`}
                          className="font-mono text-sm font-bold"
                        >
                          {row.count.toLocaleString()}
                        </span>
                        <CopyButton value={shortUrl} compact />
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          data-testid={`link-analytics-open-${row.urlName}`}
                          className="hidden rounded-lg p-2 text-[#182022]/35 hover:bg-[#deddd2] hover:text-[#182022] sm:block"
                        >
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { AppShell } from "@/components/ziplink-shell";
import { LoginPage, SignupPage } from "@/pages/auth";
import { DashboardPage } from "@/pages/dashboard";
import { AnalyticsPage } from "@/pages/analytics";
import { UrlsPage } from "@/pages/urls";
import { UnauthorizedPage } from "@/pages/unauthorized";
import { SessionExpiredPage } from "@/pages/session-expired";
import NotFound from "@/pages/not-found";
import {
  AUTH_CHANGED_EVENT,
  expireSession,
  getToken,
  getTokenExpiryMs,
  SESSION_EXPIRED_EVENT,
} from "@/lib/auth";

const queryClient = new QueryClient();

function Protected({ children }: { children: ReactNode }) {
  return getToken() ? <AppShell>{children}</AppShell> : <UnauthorizedPage />;
}

function SessionGuard({ children }: { children: ReactNode }) {
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    const clearExpiryTimer = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
    const scheduleExpiry = () => {
      clearExpiryTimer();
      const expiry = getTokenExpiryMs();
      if (expiry === null) return;
      const delay = expiry - Date.now();
      if (delay <= 0) {
        expireSession();
        return;
      }
      timeoutId = window.setTimeout(expireSession, delay);
    };
    const handleSessionExpired = () => {
      clearExpiryTimer();
      setSessionExpired(true);
    };
    const handleAuthChanged = () => {
      setSessionExpired(false);
      scheduleExpiry();
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    scheduleExpiry();
    return () => {
      clearExpiryTimer();
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    };
  }, []);

  return (
    <div className="relative min-h-[100dvh]">
      {children}
      {sessionExpired && <SessionExpiredPage />}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/dashboard">
          {() => (
            <Protected>
              <DashboardPage />
            </Protected>
          )}
        </Route>
        <Route path="/analytics">
          {() => (
            <Protected>
              <AnalyticsPage />
            </Protected>
          )}
        </Route>
        <Route path="/urls">
          {() => (
            <Protected>
              <UrlsPage />
            </Protected>
          )}
        </Route>
        <Route path="/">
          <HomeRedirect />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function HomeRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(getToken() ? "/dashboard" : "/login");
  }, [setLocation]);
  return null;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <SessionGuard>
            <Router />
          </SessionGuard>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

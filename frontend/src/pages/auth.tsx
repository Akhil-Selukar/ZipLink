import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  Mail,
  UserRound,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { login, signup } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

function AuthBackdrop({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="relative hidden min-h-[100dvh] overflow-hidden bg-[#182022] p-10 text-[#f3f1e9] lg:flex lg:w-[48%] lg:flex-col">
      <div className="absolute -right-24 -top-20 size-[430px] rounded-full border-[70px] border-[#c7f36b]/90" />
      <div className="absolute -bottom-36 -left-28 size-[390px] rounded-full border-[55px] border-[#f17b5a]/80" />
      <div className="relative flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-[#c7f36b] text-[#182022]">
          <Zap size={18} />
        </span>
        <span className="font-display text-2xl tracking-[-.04em]">ziplink</span>
      </div>
      <div className="relative mt-auto max-w-xl">
        <h2 className="mt-6 font-display text-6xl leading-[.91] tracking-[-.001em] xl:text-8xl">
          You got messy links,
          <br />
          <span className="text-[#c7f36b]">We got you!</span>
        </h2>
        <p className="mt-8 max-w-XL text-xl leading-relaxed text-[#f3f1e9]">
          ZipLink - Short links, big impact.
        </p>
      </div>
      <div className="relative mt-70 flex justify-between border-t border-[#f3f1e9]/15 pt-4 font-mono text-[10px] uppercase tracking-[.16em] text-[#f3f1e9]/75">
        <span>made with ♥️ by Akhil</span>
        <span>
          Code repository at
          <a href="https://github.com/Akhil-Selukar/ZipLink"> - gitHub</a>
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder: string;
  icon: typeof UserRound;
}) {
  return (
    <label className="block" htmlFor={name}>
      <span className="mb-2 block text-xs font-bold text-[#182022]/65">
        {label}
      </span>
      <span className="relative block">
        <Icon
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#182022]/35"
        />
        <input
          id={name}
          name={name}
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid={`input-${name}`}
          className="h-12 w-full rounded-xl border border-[#182022]/15 bg-[#ebe9df]/35 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-[#182022]/30 focus:border-[#75885d] focus:bg-[#f8f6ef] focus:ring-4 focus:ring-[#c7f36b]/20"
        />
      </span>
    </label>
  );
}

export function LoginPage() {
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const result = await login(userName, password);
      saveAuth(result.token, userName);
      setLocation("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We could not sign you in.",
      );
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="grain flex min-h-[100dvh] bg-[#f3f1e9]">
      <AuthBackdrop mode="login" />
      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[410px]">
          <div className="mb-12 flex items-center gap-2 lg:hidden">
            <span className="grid size-8 place-items-center rounded-lg bg-[#c7f36b]">
              <Zap size={16} />
            </span>
            <span className="font-display text-2xl">ziplink</span>
          </div>
          <div className="mb-7">
            <h1 className="font-display text-5xl leading-none tracking-[-.05em]">
              Hey there,
            </h1>
            <h1 className="font-display text-5xl leading-none tracking-[-.05em]">
              Welcome back
            </h1>
            <p className="mt-4 text-m leading-relaxed text-[#182022]/75">
              Log in to access your links.
            </p>
          </div>
          <form onSubmit={submit} className="space-y-5">
            <Field
              label="Email"
              name="username"
              value={userName}
              onChange={setUserName}
              placeholder="e.g. sheldon.cooper@ziplink.com"
              icon={UserRound}
            />
            <Field
              label="Password"
              name="password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="Your password"
              icon={LockKeyhole}
            />
            {error && (
              <div
                role="alert"
                data-testid="status-login-error"
                className="rounded-xl border border-[#f17b5a]/45 bg-[#f5ded7] px-4 py-3 text-sm text-[#8d3d2b]"
              >
                {error}
              </div>
            )}
            <button
              disabled={pending}
              type="submit"
              data-testid="button-login"
              className="group mt-2 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#182022] text-sm font-bold text-[#f3f1e9] transition-all hover:-translate-y-0.5 hover:bg-[#344346] disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? (
                "Checking your details…"
              ) : (
                <>
                  Sign in{" "}
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-[#182022]/75">
            New here?{" "}
            <Link
              href="/signup"
              data-testid="link-signup"
              className="font-bold text-[#182022] underline decoration-[#c7f36b] decoration-2 underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export function SignupPage() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ userName: "", emailId: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState(false);
  const update = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      await signup(form.userName, form.emailId, form.password);
      setCreated(true);
      window.setTimeout(() => setLocation("/login"), 1400);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not create your account.",
      );
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="grain flex min-h-[100dvh] bg-[#f3f1e9]">
      <AuthBackdrop mode="signup" />
      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[410px]">
          <div className="mb-12 flex items-center gap-2 lg:hidden">
            <span className="grid size-8 place-items-center rounded-lg bg-[#c7f36b]">
              <Zap size={16} />
            </span>
            <span className="font-display text-2xl">ziplink</span>
          </div>
          <div className="mb-9">
            <h1 className="font-display text-5xl leading-none tracking-[-.05em]">
              Hey there,
            </h1>
            <h1 className="font-display text-5xl leading-none tracking-[-.05em]">
              Let's get started.
            </h1>
            <p className="mt-4 text-m leading-relaxed text-[#182022]/75">
              Create your account and start making short links.
            </p>
          </div>
          {created ? (
            <div
              data-testid="status-signup-success"
              className="rounded-2xl border border-[#75885d]/30 bg-[#e7f0d2] p-6"
            >
              <div className="grid size-10 place-items-center rounded-full bg-[#c7f36b]">
                <Check size={20} />
              </div>
              <h2 className="mt-5 font-display text-2xl">
                Your account is created successfully..!!
              </h2>
              <p className="mt-2 text-sm text-[#182022]/60">Sign in now.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <Field
                label="Name"
                name="username"
                value={form.userName}
                onChange={update("userName")}
                placeholder="e.g. Sheldon cooper"
                icon={UserRound}
              />
              <Field
                label="Email address"
                name="email"
                value={form.emailId}
                onChange={update("emailId")}
                type="email"
                placeholder="shepdon.cooper@ziplink.com"
                icon={Mail}
              />
              <Field
                label="Password"
                name="password"
                value={form.password}
                onChange={update("password")}
                type="password"
                placeholder="At least 8 characters"
                icon={LockKeyhole}
                hint="Use at least 8 characters with a mix of atleast one lower and upper case letter, numbers and any special characters from !, @, # and $"
              />
              {error && (
                <div
                  role="alert"
                  data-testid="status-signup-error"
                  className="rounded-xl border border-[#f17b5a]/45 bg-[#f5ded7] px-4 py-3 text-sm text-[#8d3d2b]"
                >
                  {error}
                </div>
              )}
              <button
                disabled={pending}
                type="submit"
                data-testid="button-signup"
                className="group mt-2 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#182022] text-sm font-bold text-[#f3f1e9] transition-all hover:-translate-y-0.5 hover:bg-[#344346] disabled:cursor-wait disabled:opacity-60"
              >
                {pending ? (
                  "Account creation is in progress…"
                ) : (
                  <>
                    Create account{" "}
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>
          )}
          <p className="mt-8 text-center text-sm text-[#182022]/75">
            Already have an account?{" "}
            <Link
              href="/login"
              data-testid="link-login"
              className="font-bold text-[#182022] underline decoration-[#f17b5a] decoration-2 underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

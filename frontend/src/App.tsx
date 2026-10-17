import { useCallback, useEffect, useState } from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BellRing,
  Check,
  CircleHelp,
  Code2,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Radio,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import NotificationForm from "./componets/NotificationForm";
import NotificationStatus from "./componets/NotificationStatus";

import {
  getCurrentSubscription,
  sendTestNotification,
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "./services/notificationService";

import { isPushSupported } from "./services/serviceWorkerService";

import type {
  NotificationPayload,
  SubscriptionStatus,
} from "./types/notification";

interface Feedback {
  type: "success" | "error";
  message: string;
}

function App() {
  const [status, setStatus] = useState<SubscriptionStatus>("checking");

  const [isSending, setIsSending] = useState(false);

  const [isSubscribing, setIsSubscribing] = useState(false);

  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [lastSent, setLastSent] = useState<string | null>(null);

  const refreshSubscriptionStatus = useCallback(async (): Promise<void> => {
    if (!isPushSupported()) {
      setStatus("unsupported");
      return;
    }

    try {
      const subscribed = await getCurrentSubscription();

      setStatus(subscribed ? "subscribed" : "unsubscribed");
    } catch {
      setStatus("unsubscribed");
    }
  }, []);

  useEffect(() => {
    void refreshSubscriptionStatus();
  }, [refreshSubscriptionStatus]);

  async function handleSubscribe(): Promise<void> {
    setIsSubscribing(true);
    setFeedback(null);

    try {
      await subscribeToNotifications();

      setStatus("subscribed");

      setFeedback({
        type: "success",
        message: "Your browser has been subscribed successfully.",
      });
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to subscribe to notifications.",
      });

      await refreshSubscriptionStatus();
    } finally {
      setIsSubscribing(false);
    }
  }

  async function handleUnsubscribe(): Promise<void> {
    setIsUnsubscribing(true);
    setFeedback(null);

    try {
      await unsubscribeFromNotifications();

      setStatus("unsubscribed");

      setFeedback({
        type: "success",
        message: "Your browser has been unsubscribed successfully.",
      });
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to unsubscribe.",
      });

      await refreshSubscriptionStatus();
    } finally {
      setIsUnsubscribing(false);
    }
  }

  async function handleSend(payload: NotificationPayload): Promise<void> {
    setIsSending(true);
    setFeedback(null);

    try {
      const result = await sendTestNotification(payload);

      setLastSent(new Date().toLocaleTimeString());

      if (result.sent === 0 && result.failed > 0) {
        setFeedback({
          type: "error",
          message: `No notifications were sent successfully. ${result.failed} failed.`,
        });

        return;
      }

      setFeedback({
        type: "success",
        message: `Notification sending completed. ${result.sent} sent successfully, ${result.failed} failed.`,
      });
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send the notification.",
      });
    } finally {
      setIsSending(false);
    }
  }

  const isSubscribed = status === "subscribed";

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#111827] text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/25">
            <BellRing size={21} />
          </div>

          <div>
            <h1 className="text-sm font-bold tracking-wide">PushPilot</h1>

            <p className="mt-0.5 text-xs text-slate-400">Notification Studio</p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

          <nav className="mt-3 space-y-1">
            <a
              href="#dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-indigo-500/15 px-3 py-3 text-sm font-medium text-indigo-300"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </a>

            <a
              href="#status"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Radio size={18} />
              Subscriptions
            </a>
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />

              <span className="text-xs font-semibold text-white">
                Developer workspace
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Test browser push notifications directly from your own
              application.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-[11px] text-slate-400">
                Local environment
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-white/10 px-2 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-bold">
              PP
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-white">Developer</p>

              <p className="mt-1 text-[11px] text-slate-500">
                Push notification project
              </p>
            </div>

            <LogOut size={16} className="ml-auto text-slate-500" />
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-xs text-slate-400">Workspace / Dashboard</p>

              <h2 className="mt-0.5 text-sm font-semibold text-slate-800">
                Overview
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "subscribed"
                    ? "bg-emerald-500"
                    : status === "unsupported"
                      ? "bg-rose-500"
                      : "bg-amber-400"
                }`}
              />

              <span className="text-xs font-medium text-slate-600">
                {status === "subscribed"
                  ? "Connected"
                  : status === "unsupported"
                    ? "Unsupported"
                    : status === "checking"
                      ? "Checking..."
                      : "Not connected"}
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Bell size={17} />
            </div>
          </div>
        </header>

        <main
          id="dashboard"
          className="mx-auto max-w-[1440px] px-4 py-7 sm:px-8 sm:py-9"
        >
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#312e81] via-[#4338ca] to-[#6366f1] p-6 text-white shadow-xl shadow-indigo-900/10 sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute -right-6 -top-12 h-52 w-52 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute bottom-[-100px] right-[20%] h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_260px]">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-50">
                  <Sparkles size={14} />
                  Web Push Notification Studio
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                  Notifications,
                  <br className="hidden sm:block" /> made simple.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
                  Manage browser subscriptions, compose messages, and test
                  real-time web push notifications from one clean workspace.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {isSubscribed ? (
                    <button
                      type="button"
                      onClick={handleUnsubscribe}
                      disabled={isUnsubscribing}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 disabled:opacity-60"
                    >
                      {isUnsubscribing ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <Bell size={17} />
                      )}
                      Unsubscribe
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={
                        isSubscribing ||
                        status === "unsupported" ||
                        status === "checking"
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubscribing ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <BellRing size={17} />
                      )}

                      {isSubscribing
                        ? "Subscribing..."
                        : "Enable notifications"}
                    </button>
                  )}

                  <a
                    href="#composer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Explore composer
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <BellRing size={20} />
                    </div>

                    <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-100">
                      LIVE PREVIEW
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white p-4 text-slate-900 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <BellRing size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-bold">PushPilot</p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          Just now
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      You're all set!
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your notification workflow is ready to test.
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-indigo-100">
                    <ShieldCheck size={15} />
                    Browser push workflow
                  </div>
                </div>
              </div>
            </div>
          </section>

          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {feedback.type === "success" ? (
                <Check size={19} className="mt-0.5 shrink-0" />
              ) : (
                <CircleHelp size={19} className="mt-0.5 shrink-0" />
              )}

              <p className="flex-1 text-sm leading-6">{feedback.message}</p>

              <button
                type="button"
                aria-label="Dismiss message"
                onClick={() => setFeedback(null)}
                className="rounded-lg p-1 opacity-70 hover:bg-black/5 hover:opacity-100"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Radio size={21} />
                </div>

                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  <Activity size={12} />
                  Browser
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500">Subscription status</p>

              <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {status === "subscribed"
                  ? "Active"
                  : status === "checking"
                    ? "Checking"
                    : status === "unsupported"
                      ? "Unavailable"
                      : "Inactive"}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                {status === "subscribed"
                  ? "A browser subscription is available."
                  : "Subscribe to enable browser push."}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Zap size={21} />
                </div>

                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                  <ArrowUpRight size={12} />
                  API
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500">Last send attempt</p>

              <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {lastSent || "Not yet"}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Updates after a successful API response.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <ShieldCheck size={21} />
                </div>

                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                  <ArrowDownRight size={12} />
                  Local
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500">Delivery setup</p>

              <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Web Push
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Delivery depends on browser and push-service support.
              </p>
            </article>
          </section>

          <section className="mt-9 grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
            <div id="composer" className="scroll-mt-24">
              <NotificationForm
                isSubscribed={isSubscribed}
                isSending={isSending}
                onSend={handleSend}
              />
            </div>

            <div id="status" className="space-y-6 scroll-mt-24">
              <NotificationStatus status={status} />

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Activity size={20} />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Quick actions
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Manage this browser.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={refreshSubscriptionStatus}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/50"
                  >
                    Refresh subscription status
                    <ArrowUpRight size={17} className="text-slate-400" />
                  </button>

                  {isSubscribed ? (
                    <button
                      type="button"
                      onClick={handleUnsubscribe}
                      disabled={isUnsubscribing}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 disabled:opacity-60"
                    >
                      {isUnsubscribing
                        ? "Unsubscribing..."
                        : "Disable notifications"}

                      <Bell size={17} className="text-slate-400" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={
                        isSubscribing ||
                        status === "unsupported" ||
                        status === "checking"
                      }
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/50 disabled:opacity-60"
                    >
                      {isSubscribing
                        ? "Subscribing..."
                        : "Enable notifications"}

                      <BellRing size={17} className="text-slate-400" />
                    </button>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-2">
                  <CircleHelp size={19} className="text-indigo-600" />

                  <h2 className="text-base font-semibold text-slate-900">
                    How it works
                  </h2>
                </div>

                <div className="mt-5 space-y-5">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                      01
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Subscribe
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Grant browser permission and create a push subscription.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                      02
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Compose
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Enter the notification title, message, and destination.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                      03
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">Send</p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Your backend sends the push through the browser's push
                        service.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 py-6 text-xs text-slate-400 sm:flex-row">
            <p>
              © {new Date().getFullYear()} PushPilot. Built with React,
              TypeScript & Web Push.
            </p>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-slate-700"
            >
              <Code2 size={16} />
              GitHub
              <ArrowUpRight size={13} />
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;

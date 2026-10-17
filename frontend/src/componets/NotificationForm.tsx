import { useState } from "react";

import { ArrowUpRight, BellRing, LoaderCircle, Send } from "lucide-react";

import type { FormEvent } from "react";

import type { NotificationPayload } from "../types/notification";

interface NotificationFormProps {
  isSubscribed: boolean;
  isSending: boolean;
  onSend: (payload: NotificationPayload) => Promise<void>;
}

export default function NotificationForm({
  isSubscribed,
  isSending,
  onSend,
}: NotificationFormProps) {
  const [title, setTitle] = useState("Your first notification");

  const [message, setMessage] = useState(
    "Congratulations! Your Web Push Notification application is working.",
  );

  const [url, setUrl] = useState("/");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!title.trim() || !message.trim()) {
      return;
    }

    await onSend({
      title: title.trim(),
      message: message.trim(),
      url: url.trim() || "/",
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <BellRing size={21} />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Compose notification
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create and send a push notification.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
        <div>
          <label
            htmlFor="notification-title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Notification title
          </label>

          <input
            id="notification-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a notification title"
            maxLength={100}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />

          <p className="mt-2 text-xs text-slate-400">
            Keep the title short and clear.
          </p>
        </div>

        <div>
          <label
            htmlFor="notification-message"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Message
          </label>

          <textarea
            id="notification-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your notification message"
            rows={4}
            maxLength={500}
            required
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />

          <div className="mt-2 flex justify-end">
            <span className="text-xs text-slate-400">
              {message.length}/500 characters
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="notification-url"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Destination URL
          </label>

          <div className="relative">
            <input
              id="notification-url"
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="/"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />

            <ArrowUpRight
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Use a path such as / or /settings. The service worker opens
            destinations on this website only.
          </p>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-indigo-600">
              <BellRing size={18} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800">
                Ready to send
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Your notification will be sent to the browser subscriptions
                stored by your backend.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isSubscribed || isSending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isSending ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Sending notification...
            </>
          ) : (
            <>
              <Send size={17} />
              Send test notification
            </>
          )}
        </button>

        {!isSubscribed && (
          <p className="text-center text-xs text-amber-600">
            Subscribe to notifications before sending a test.
          </p>
        )}
      </form>
    </section>
  );
}

import {
  Bell,
  BellOff,
  CheckCircle2,
  CircleDashed,
  ShieldCheck,
} from "lucide-react";

import type {
  SubscriptionStatus,
} from "../types/notification";

interface NotificationStatusProps {
  status: SubscriptionStatus;
}

const statusConfig = {
  checking: {
    title: "Checking status",
    description: "Checking your browser subscription.",
    icon: CircleDashed,
    color: "text-slate-500",
    background: "bg-slate-100",
  },

  subscribed: {
    title: "Notifications enabled",
    description: "Your browser is subscribed to push notifications.",
    icon: CheckCircle2,
    color: "text-emerald-600",
    background: "bg-emerald-50",
  },

  unsubscribed: {
    title: "Not subscribed",
    description: "Enable notifications to receive push messages.",
    icon: BellOff,
    color: "text-amber-600",
    background: "bg-amber-50",
  },

  unsupported: {
    title: "Browser unsupported",
    description: "This browser does not support the required APIs.",
    icon: BellOff,
    color: "text-rose-600",
    background: "bg-rose-50",
  },
};

export default function NotificationStatus({
  status,
}: NotificationStatusProps) {
  const currentStatus = statusConfig[status];

  const Icon = currentStatus.icon;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Subscription status
          </p>

          <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
            {currentStatus.title}
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {currentStatus.description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentStatus.background} ${currentStatus.color}`}
        >
          <Icon size={23} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
        <ShieldCheck
          size={16}
          className="text-emerald-600"
        />

        <span className="text-xs text-slate-500">
          Browser-managed notification permissions
        </span>
      </div>
    </section>
  );
}
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Briefcase,
  Heart,
  MapPin,
  ShoppingBag,
  Stethoscope,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { AppPage } from "../App";

const APPS = [
  {
    id: 1,
    icon: Wallet,
    label: "Wallet",
    color: "bg-orange-500",
    desc: "Manage coins",
  },
  {
    id: 2,
    icon: Users,
    label: "Refer & Earn",
    color: "bg-blue-500",
    desc: "Earn rewards",
  },
  {
    id: 3,
    icon: MapPin,
    label: "Ring Agent",
    color: "bg-red-500",
    desc: "Become agent",
  },
  {
    id: 4,
    icon: MapPin,
    label: "প্রবাসী Agent",
    color: "bg-emerald-500",
    desc: "Overseas agent",
  },
  {
    id: 5,
    icon: TrendingUp,
    label: "Investment",
    color: "bg-green-600",
    desc: "Grow wealth",
  },
  {
    id: 6,
    icon: Stethoscope,
    label: "Doctors",
    color: "bg-cyan-500",
    desc: "Health consult",
  },
  {
    id: 7,
    icon: Heart,
    label: "Islamic Floor",
    color: "bg-teal-700",
    desc: "🕌 Community",
  },
  {
    id: 8,
    icon: Briefcase,
    label: "Jobs",
    color: "bg-indigo-500",
    desc: "Find work",
  },
  {
    id: 9,
    icon: ShoppingBag,
    label: "Ring Store",
    color: "bg-pink-500",
    desc: "Shop now",
  },
];

export default function AppsPage({
  navigate: _navigate,
}: { navigate: (p: AppPage) => void }) {
  return (
    <ScrollArea className="h-full bg-gray-50">
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {APPS.map((app, i) => (
            <motion.button
              key={app.id}
              type="button"
              onClick={() => toast.info(`${app.label} coming soon!`)}
              className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-card hover:shadow-md transition-shadow active:scale-95"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              data-ocid={`apps.item.${i + 1}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center shadow-sm`}
              >
                <app.icon size={26} className="text-white" />
              </div>
              <span className="text-xs font-bold text-gray-800 text-center leading-tight">
                {app.label}
              </span>
              <span className="text-[10px] text-muted-foreground text-center">
                {app.desc}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <footer className="py-3 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </ScrollArea>
  );
}

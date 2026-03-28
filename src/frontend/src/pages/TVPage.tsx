import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";

const CATEGORIES = ["All", "News", "Entertainment", "Sports", "Religious"];

const CHANNELS = [
  {
    id: 1,
    name: "BTV",
    logo: "/assets/generated/ch-btv.dim_120x120.png",
    category: "Entertainment",
  },
  {
    id: 2,
    name: "Channel i",
    logo: "/assets/generated/ch-channeli.dim_120x120.png",
    category: "Entertainment",
  },
  {
    id: 3,
    name: "ATN Bangla",
    logo: "/assets/generated/ch-atn.dim_120x120.png",
    category: "Entertainment",
  },
  {
    id: 4,
    name: "NTV",
    logo: "/assets/generated/ch-ntv.dim_120x120.png",
    category: "News",
  },
  {
    id: 5,
    name: "Rtv",
    logo: "/assets/generated/ch-rtv.dim_120x120.png",
    category: "Entertainment",
  },
  {
    id: 6,
    name: "Somoy TV",
    logo: "/assets/generated/ch-somoy.dim_120x120.png",
    category: "News",
  },
  {
    id: 7,
    name: "Jamuna TV",
    logo: "/assets/generated/ch-jamuna.dim_120x120.png",
    category: "News",
  },
  {
    id: 8,
    name: "Desh TV",
    logo: "/assets/generated/ch-desh.dim_120x120.png",
    category: "Entertainment",
  },
  {
    id: 9,
    name: "Boishakhi TV",
    logo: "/assets/generated/ch-boishakhi.dim_120x120.png",
    category: "Entertainment",
  },
  {
    id: 10,
    name: "Maasranga TV",
    logo: "/assets/generated/ch-maasranga.dim_120x120.png",
    category: "Entertainment",
  },
  {
    id: 11,
    name: "GTV",
    logo: "/assets/generated/ch-gtv.dim_120x120.png",
    category: "Sports",
  },
  {
    id: 12,
    name: "Independent TV",
    logo: "/assets/generated/ch-independent.dim_120x120.png",
    category: "News",
  },
];

export default function TVPage({
  navigate,
}: { navigate: (p: AppPage) => void }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? CHANNELS
      : CHANNELS.filter((ch) => ch.category === activeCategory);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="orange-gradient px-4 pt-12 pb-5 flex-none">
        <div className="flex items-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => navigate({ name: "home" })}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            data-ocid="tv.close_button"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-bold flex-1">
            📺 TV Channels
          </h1>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-white text-primary shadow-sm"
                  : "bg-white/20 text-white"
              }`}
              data-ocid={`tv.${cat.toLowerCase()}.tab`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Channel grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((ch, i) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => toast.info(`${ch.name} — Coming Soon! 🎬`)}
              className="bg-white rounded-2xl overflow-hidden shadow-card flex flex-col items-center pb-3 active:scale-95 transition-transform"
              data-ocid={`tv.item.${i + 1}`}
            >
              <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-2">
                <img
                  src={ch.logo}
                  alt={ch.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <p className="text-xs font-bold text-gray-800 text-center mt-1 px-1 leading-tight">
                {ch.name}
              </p>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="tv.empty_state"
          >
            <p className="text-4xl mb-3">📺</p>
            <p className="font-semibold">No channels in this category</p>
          </div>
        )}
      </div>

      {/* Footer */}
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
    </div>
  );
}

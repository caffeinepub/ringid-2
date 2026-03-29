import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useState } from "react";
import type { AppPage } from "../App";

const CATEGORIES = ["All", "News", "Entertainment", "Sports", "Religious"];

const CHANNELS = [
  {
    id: 2,
    name: "Channel i",
    logo: "/assets/generated/ch-channeli.dim_120x120.png",
    category: "Entertainment",
    liveId: "ZnNLIRi75bQ",
  },
  {
    id: 3,
    name: "ATN Bangla",
    logo: "/assets/generated/ch-atn.dim_120x120.png",
    category: "Entertainment",
    liveId: "5nz-S0H_ltA",
  },
  {
    id: 4,
    name: "NTV",
    logo: "/assets/generated/ch-ntv.dim_120x120.png",
    category: "News",
    liveId: "KjQWFOPLf8Y",
  },
  {
    id: 5,
    name: "Rtv",
    logo: "/assets/generated/ch-rtv.dim_120x120.png",
    category: "Entertainment",
    liveId: "Tef0Mdg-Sig",
  },
  {
    id: 6,
    name: "Somoy TV",
    logo: "/assets/generated/ch-somoy.dim_120x120.png",
    category: "News",
    liveId: "23gFzkBnNrM",
  },
  {
    id: 7,
    name: "Jamuna TV",
    logo: "/assets/generated/ch-jamuna.dim_120x120.png",
    category: "News",
    liveId: "rmcwWzBmUws",
  },
  {
    id: 8,
    name: "Desh TV",
    logo: "/assets/generated/ch-desh.dim_120x120.png",
    category: "Entertainment",
    liveId: "qgBSe1Gn1Cc",
  },
  {
    id: 9,
    name: "Boishakhi TV",
    logo: "/assets/generated/ch-boishakhi.dim_120x120.png",
    category: "Entertainment",
    liveId: null,
  },
  {
    id: 10,
    name: "Maasranga TV",
    logo: "/assets/generated/ch-maasranga.dim_120x120.png",
    category: "Entertainment",
    liveId: null,
  },
  {
    id: 11,
    name: "GTV",
    logo: "/assets/generated/ch-gtv.dim_120x120.png",
    category: "Sports",
    liveId: null,
  },
  {
    id: 12,
    name: "Independent TV",
    logo: "/assets/generated/ch-independent.dim_120x120.png",
    category: "News",
    liveId: null,
  },
  {
    id: 13,
    name: "Ekattor TV",
    logo: "/assets/generated/ch-ekattor.dim_120x120.png",
    category: "News",
    liveId: null,
  },
  {
    id: 14,
    name: "SA TV",
    logo: "/assets/generated/ch-satv.dim_120x120.png",
    category: "Entertainment",
    liveId: null,
  },
  {
    id: 15,
    name: "Bangla Vision",
    logo: "/assets/generated/ch-banglavision.dim_120x120.png",
    category: "Entertainment",
    liveId: null,
  },
  {
    id: 16,
    name: "Islamic TV",
    logo: "/assets/generated/ch-islamictv.dim_120x120.png",
    category: "Religious",
    liveId: null,
  },
  {
    id: 17,
    name: "Peace TV",
    logo: "/assets/generated/ch-peacetv.dim_120x120.png",
    category: "Religious",
    liveId: null,
  },
  {
    id: 18,
    name: "T Sports",
    logo: "/assets/generated/ch-tsports.dim_120x120.png",
    category: "Sports",
    liveId: null,
  },
];

type Channel = (typeof CHANNELS)[number];

export default function TVPage({
  navigate: _navigate,
}: { navigate: (p: AppPage) => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [playing, setPlaying] = useState<Channel | null>(null);

  const filtered =
    activeCategory === "All"
      ? CHANNELS
      : CHANNELS.filter((ch) => ch.category === activeCategory);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Full-screen player overlay */}
      {playing && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Player header */}
          <div className="flex items-center gap-4 px-5 py-4 bg-black">
            <img
              src={playing.logo}
              alt={playing.name}
              className="w-11 h-11 object-contain rounded"
            />
            <span className="text-white font-bold text-lg flex-1">
              {playing.name}
            </span>
            <span className="bg-red-600 text-white text-base font-bold px-2 py-0.5 rounded">
              LIVE
            </span>
            <button
              type="button"
              onClick={() => setPlaying(null)}
              className="text-white ml-2 p-1"
              data-ocid="tv.player.close"
            >
              <X size={28} />
            </button>
          </div>

          {/* Embedded player */}
          <div className="flex-1 relative">
            <iframe
              key={playing.liveId}
              src={`https://www.youtube.com/embed/${playing.liveId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1&playsinline=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              title={playing.name}
            />
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="bg-white border-b border-gray-100 px-4 py-4.5">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-1.5 rounded-full text-base font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-600"
              }`}
              data-ocid={`tv.${cat.toLowerCase()}.tab`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((ch, i) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  if (ch.liveId) {
                    setPlaying(ch);
                  }
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-card flex flex-col items-center pb-3 active:scale-95 transition-transform relative"
                data-ocid={`tv.item.${i + 1}`}
              >
                {ch.liveId && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
                    LIVE
                  </span>
                )}
                <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-3">
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <p className="text-base font-bold text-gray-800 text-center mt-1 px-1 leading-tight">
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

        <footer className="py-5 text-center text-base text-muted-foreground border-t border-border">
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
    </div>
  );
}

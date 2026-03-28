import { Tv } from "lucide-react";
import type { AppPage } from "../App";
import BottomNav from "../components/BottomNav";

const CATEGORIES = [
  "All",
  "Drama",
  "News",
  "Sports",
  "Entertainment",
  "Islamic",
  "Kids",
];

const CHANNELS = [
  {
    id: 1,
    name: "ATN Bangla",
    category: "Entertainment",
    viewers: 12400,
    color: "bg-blue-500",
    emoji: "📺",
  },
  {
    id: 2,
    name: "Ekattor TV",
    category: "News",
    viewers: 8900,
    color: "bg-red-500",
    emoji: "📡",
  },
  {
    id: 3,
    name: "Gazi TV Sports",
    category: "Sports",
    viewers: 15200,
    color: "bg-green-600",
    emoji: "⚽",
  },
  {
    id: 4,
    name: "Islamic Channel BD",
    category: "Islamic",
    viewers: 5600,
    color: "bg-emerald-700",
    emoji: "🕌",
  },
  {
    id: 5,
    name: "Cartoon Network BD",
    category: "Kids",
    viewers: 9800,
    color: "bg-yellow-500",
    emoji: "🎠",
  },
  {
    id: 6,
    name: "Channel i",
    category: "Drama",
    viewers: 7300,
    color: "bg-purple-600",
    emoji: "🎭",
  },
  {
    id: 7,
    name: "RTV",
    category: "Entertainment",
    viewers: 11000,
    color: "bg-orange-500",
    emoji: "🎬",
  },
  {
    id: 8,
    name: "Somoy TV",
    category: "News",
    viewers: 19500,
    color: "bg-indigo-600",
    emoji: "📰",
  },
  {
    id: 9,
    name: "Maasranga TV",
    category: "Drama",
    viewers: 6700,
    color: "bg-pink-500",
    emoji: "🎥",
  },
  {
    id: 10,
    name: "NTV BD",
    category: "Entertainment",
    viewers: 14200,
    color: "bg-teal-500",
    emoji: "📻",
  },
  {
    id: 11,
    name: "Bangla Vision",
    category: "Entertainment",
    viewers: 8100,
    color: "bg-cyan-600",
    emoji: "🌟",
  },
  {
    id: 12,
    name: "SA TV",
    category: "Islamic",
    viewers: 4500,
    color: "bg-green-500",
    emoji: "☪️",
  },
];

export default function TVPage({
  navigate,
}: { navigate: (p: AppPage) => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#FF6B00] px-4 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Tv size={26} className="text-white" />
          <h1 className="text-white text-xl font-bold">Live TV</h1>
        </div>
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className="px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium whitespace-nowrap"
              data-ocid={`tv.${cat.toLowerCase()}.tab`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Grid */}
      <div className="flex-1 overflow-y-auto pb-24 p-3">
        <div className="grid grid-cols-2 gap-3">
          {CHANNELS.map((ch, i) => (
            <button
              key={ch.id}
              type="button"
              className="bg-white rounded-2xl overflow-hidden shadow-sm text-left active:scale-95 transition-transform"
              data-ocid={`tv.item.${i + 1}`}
            >
              {/* Thumbnail */}
              <div
                className={`${ch.color} h-28 flex items-center justify-center`}
              >
                <span className="text-5xl">{ch.emoji}</span>
              </div>
              <div className="p-2.5">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {ch.name}
                </p>
                <p className="text-xs text-gray-400">{ch.category}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500">
                    {ch.viewers.toLocaleString()} watching
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav navigate={navigate} active="tv" />
    </div>
  );
}

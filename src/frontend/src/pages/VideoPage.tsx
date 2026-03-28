import { ScrollArea } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { AppPage } from "../App";

const VIDEOS = [
  {
    id: 1,
    title: "মর্নিং ডান্স পার্টি 🎵",
    author: "Priya S.",
    views: "12.3K",
    time: "5:24",
    thumb: "https://picsum.photos/seed/vid1/400/225",
  },
  {
    id: 2,
    title: "বাংলাদেশের সেরা রান্না",
    author: "Ruma B.",
    views: "8.9K",
    time: "10:15",
    thumb: "https://picsum.photos/seed/vid2/400/225",
  },
  {
    id: 3,
    title: "Guitar Lessons EP3",
    author: "Nadia M.",
    views: "5.6K",
    time: "8:42",
    thumb: "https://picsum.photos/seed/vid3/400/225",
  },
  {
    id: 4,
    title: "Morning Yoga Routine",
    author: "Tanvir A.",
    views: "22.1K",
    time: "15:30",
    thumb: "https://picsum.photos/seed/vid4/400/225",
  },
  {
    id: 5,
    title: "Tech Talk: AI in 2026",
    author: "Arif H.",
    views: "9.4K",
    time: "12:08",
    thumb: "https://picsum.photos/seed/vid5/400/225",
  },
  {
    id: 6,
    title: "Live Art Drawing Session",
    author: "Karim R.",
    views: "3.2K",
    time: "25:00",
    thumb: "https://picsum.photos/seed/vid6/400/225",
  },
];

export default function VideoPage({
  navigate: _navigate,
}: { navigate: (p: AppPage) => void }) {
  return (
    <ScrollArea className="h-full bg-gray-50">
      <div className="pb-6">
        {/* Featured video */}
        <div className="relative bg-gray-900">
          <img
            src="https://picsum.photos/seed/featured/480/270"
            alt="Featured"
            className="w-full h-48 object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => toast.info("Video playback coming soon!")}
              className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
              data-ocid="video.play.button"
            >
              <Play
                size={28}
                className="text-primary ml-1"
                fill="currentColor"
              />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70">
            <p className="text-white font-bold text-sm">🔥 Trending Now</p>
            <p className="text-white/80 text-xs">Top videos this week</p>
          </div>
        </div>

        <div className="p-3 space-y-3">
          <h2 className="font-bold text-sm px-1">🎬 Recent Videos</h2>
          {VIDEOS.map((video, i) => (
            <motion.button
              key={video.id}
              type="button"
              onClick={() => toast.info("Video playback coming soon!")}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-card flex gap-3 p-3 text-left active:scale-[0.99] transition-transform"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              data-ocid={`video.item.${i + 1}`}
            >
              <div className="relative flex-none">
                <img
                  src={video.thumb}
                  alt={video.title}
                  className="w-24 h-16 object-cover rounded-xl"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                  {video.time}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
                    <Play
                      size={12}
                      className="text-white ml-0.5"
                      fill="white"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2">
                  {video.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {video.author}
                </p>
                <p className="text-xs text-muted-foreground">
                  {video.views} views
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <footer className="py-4 text-center text-xs text-muted-foreground">
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
    </ScrollArea>
  );
}

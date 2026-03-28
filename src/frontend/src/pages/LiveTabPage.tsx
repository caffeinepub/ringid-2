import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, Mic, Plus, Radio } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import type { Room } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateRoom, useGetLiveRooms } from "../hooks/useQueries";

const SAMPLE_ROOMS: Room[] = [
  {
    id: 1n,
    title: "Morning Dance Party 🎵",
    hostName: "Priya S.",
    thumbnailUrl: "https://picsum.photos/seed/dance1/300/300",
    isActive: true,
    viewerCount: 1243n,
    startTime: BigInt(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 2n,
    title: "Tech Talk: AI Trends",
    hostName: "Arif H.",
    thumbnailUrl: "https://picsum.photos/seed/tech2/300/300",
    isActive: true,
    viewerCount: 892n,
    startTime: BigInt(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 3n,
    title: "Cooking Bengali Biryani 🍛",
    hostName: "Ruma B.",
    thumbnailUrl: "https://picsum.photos/seed/cook3/300/300",
    isActive: true,
    viewerCount: 567n,
    startTime: BigInt(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 4n,
    title: "Live Drawing Session",
    hostName: "Karim R.",
    thumbnailUrl: "https://picsum.photos/seed/art4/300/300",
    isActive: true,
    viewerCount: 334n,
    startTime: BigInt(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 5n,
    title: "Guitar Lessons for Beginners",
    hostName: "Nadia M.",
    thumbnailUrl: "https://picsum.photos/seed/music5/300/300",
    isActive: true,
    viewerCount: 219n,
    startTime: BigInt(Date.now() - 45 * 60 * 1000),
  },
  {
    id: 6n,
    title: "Fitness Yoga Morning",
    hostName: "Tanvir A.",
    thumbnailUrl: "https://picsum.photos/seed/yoga6/300/300",
    isActive: true,
    viewerCount: 778n,
    startTime: BigInt(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 7n,
    title: "Bangla Gaan Live 🎶",
    hostName: "Sadia Islam",
    thumbnailUrl: "https://picsum.photos/seed/song7/300/300",
    isActive: true,
    viewerCount: 1450n,
    startTime: BigInt(Date.now() - 20 * 60 * 1000),
  },
  {
    id: 8n,
    title: "Cricket Talk BD vs IND",
    hostName: "Rafiq M.",
    thumbnailUrl: "https://picsum.photos/seed/cricket8/300/300",
    isActive: true,
    viewerCount: 3200n,
    startTime: BigInt(Date.now() - 10 * 60 * 1000),
  },
];

function LiveTimer({ startTime }: { startTime: bigint }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = Number(startTime);
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);
  const h = Math.floor(elapsed / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((elapsed % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (elapsed % 60).toString().padStart(2, "0");
  return (
    <span className="text-xs text-white/80 tabular-nums">
      {h}:{m}:{s}
    </span>
  );
}

export default function LiveTabPage({
  navigate,
}: {
  navigate: (p: AppPage) => void;
}) {
  const { identity } = useInternetIdentity();
  const { data: liveRooms } = useGetLiveRooms();
  const createRoom = useCreateRoom();

  const [liveTypeOpen, setLiveTypeOpen] = useState(false);
  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"audio" | "video">("video");
  const [newTitle, setNewTitle] = useState("");

  const principal = identity?.getPrincipal().toString() ?? "";
  const userName = principal ? `User ${principal.slice(0, 6)}` : "You";
  const userId = principal
    ? Math.abs(
        (principal.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
          9000000) +
          1000000,
      ).toString()
    : "0000000";

  const rooms = liveRooms && liveRooms.length > 0 ? liveRooms : SAMPLE_ROOMS;

  const handleSelectType = (type: "audio" | "video") => {
    setSelectedType(type);
    setLiveTypeOpen(false);
    setTitleDialogOpen(true);
  };

  const handleStartLive = async () => {
    if (!newTitle.trim()) return;
    let roomId: bigint = BigInt(Date.now());
    try {
      roomId = await createRoom.mutateAsync({
        title: newTitle,
        hostName: userName,
        thumbnailUrl: `https://picsum.photos/seed/${userId}/300/300`,
      });
    } catch {
      // use local id
    }
    setTitleDialogOpen(false);
    setNewTitle("");
    navigate({ name: "live", roomId, isHost: true, liveType: selectedType });
  };

  return (
    <ScrollArea className="h-full bg-gray-50">
      <div className="pb-8">
        {/* Go Live section */}
        <div className="bg-white px-4 py-5 mb-3">
          <h2 className="font-bold text-base mb-4 flex items-center gap-2">
            <Radio size={18} className="text-red-500 animate-pulse" />
            লাইভ শুরু করুন
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Audio Live */}
            <button
              type="button"
              onClick={() => handleSelectType("audio")}
              className="flex flex-col items-center gap-3 bg-accent border-2 border-primary/20 rounded-2xl py-7 px-3 hover:border-primary active:scale-95 transition-all"
              data-ocid="live.audio_live.button"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Mic size={30} className="text-white" />
              </div>
              <div className="text-center">
                <p className="text-primary font-bold text-sm">Audio Live</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  শুধু মাইক্রোফোন
                </p>
              </div>
            </button>

            {/* Video Live */}
            <button
              type="button"
              onClick={() => handleSelectType("video")}
              className="flex flex-col items-center gap-3 bg-accent border-2 border-primary/20 rounded-2xl py-7 px-3 hover:border-primary active:scale-95 transition-all"
              data-ocid="live.video_live.button"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Camera size={30} className="text-white" />
              </div>
              <div className="text-center">
                <p className="text-primary font-bold text-sm">Video Live</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  ক্যামেরা + মাইক
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Live List */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              এখন লাইভে আছেন ({rooms.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3">
            {rooms.map((room, idx) => (
              <motion.button
                key={room.id.toString()}
                type="button"
                onClick={() => navigate({ name: "live", roomId: room.id })}
                className="relative rounded-2xl overflow-hidden shadow-card active:scale-95 transition-transform"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                data-ocid={`live.item.${idx + 1}`}
              >
                {/* Thumbnail */}
                <img
                  src={
                    room.thumbnailUrl ||
                    `https://picsum.photos/seed/${room.id}/300/300`
                  }
                  alt={room.hostName}
                  className="w-full h-44 object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* LIVE badge */}
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>

                {/* Viewer count */}
                <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                  👁 {Number(room.viewerCount).toLocaleString()}
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
                  {/* Avatar + name row */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center flex-none">
                      <span className="text-white text-xs font-bold">
                        {room.hostName[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-xs truncate">
                        {room.hostName}
                      </p>
                      <LiveTimer startTime={room.startTime} />
                    </div>
                  </div>
                  {/* Join button */}
                  <button
                    type="button"
                    className="w-full bg-primary text-white text-xs font-bold py-1.5 rounded-xl flex items-center justify-center gap-1"
                    data-ocid={`live.join.button.${idx + 1}`}
                  >
                    <Plus size={12} /> Join
                  </button>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Live type select dialog */}
      <Dialog open={liveTypeOpen} onOpenChange={setLiveTypeOpen}>
        <DialogContent
          className="max-w-[360px] rounded-2xl"
          data-ocid="live.livetype.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-primary font-bold">
              লাইভের ধরন বেছে নিন
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2 pb-2">
            <button
              type="button"
              onClick={() => handleSelectType("audio")}
              className="flex flex-col items-center gap-3 bg-accent border-2 border-primary/20 rounded-2xl py-8 hover:border-primary"
              data-ocid="live.audio_live.dialog.button"
            >
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                <Mic size={28} className="text-white" />
              </div>
              <span className="text-primary font-bold text-sm">Audio Live</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectType("video")}
              className="flex flex-col items-center gap-3 bg-accent border-2 border-primary/20 rounded-2xl py-8 hover:border-primary"
              data-ocid="live.video_live.dialog.button"
            >
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                <Camera size={28} className="text-white" />
              </div>
              <span className="text-primary font-bold text-sm">Video Live</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Title input dialog */}
      <Dialog open={titleDialogOpen} onOpenChange={setTitleDialogOpen}>
        <DialogContent
          className="max-w-[360px] rounded-2xl"
          data-ocid="live.title.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-primary font-bold">
              {selectedType === "audio" ? "🎙 Audio Live" : "📹 Video Live"} শুরু
              করুন
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <Input
              placeholder="লাইভের শিরোনাম লিখুন..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStartLive()}
              data-ocid="live.title.input"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setTitleDialogOpen(false)}
                data-ocid="live.cancel.button"
              >
                বাতিল
              </Button>
              <Button
                className="flex-1 orange-gradient text-white"
                onClick={handleStartLive}
                disabled={createRoom.isPending || !newTitle.trim()}
                data-ocid="live.start.button"
              >
                {createRoom.isPending ? "শুরু হচ্ছে..." : "লাইভ শুরু"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}

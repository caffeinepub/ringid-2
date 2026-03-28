import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Heart,
  Mic,
  MicOff,
  Radio,
  Send,
  Share2,
  Users,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetChatMessages,
  useGetLiveRooms,
  useSendMessage,
} from "../hooks/useQueries";

const SAMPLE_ROOMS_MAP: Record<
  string,
  {
    title: string;
    hostName: string;
    thumbnailUrl: string;
    viewerCount: number;
    startTime: number;
  }
> = {
  "1": {
    title: "Morning Dance Party 🎵",
    hostName: "Priya S.",
    thumbnailUrl: "https://picsum.photos/seed/dance1/480/700",
    viewerCount: 1243,
    startTime: Date.now() - 5 * 3600000,
  },
  "2": {
    title: "Tech Talk: AI Trends",
    hostName: "Arif H.",
    thumbnailUrl: "https://picsum.photos/seed/tech2/480/700",
    viewerCount: 892,
    startTime: Date.now() - 2 * 3600000,
  },
  "3": {
    title: "Cooking Bengali Biryani 🍛",
    hostName: "Ruma B.",
    thumbnailUrl: "https://picsum.photos/seed/cook3/480/700",
    viewerCount: 567,
    startTime: Date.now() - 3600000,
  },
  "4": {
    title: "Live Drawing Session",
    hostName: "Karim R.",
    thumbnailUrl: "https://picsum.photos/seed/art4/480/700",
    viewerCount: 334,
    startTime: Date.now() - 30 * 60000,
  },
  "5": {
    title: "Guitar Lessons for Beginners",
    hostName: "Nadia M.",
    thumbnailUrl: "https://picsum.photos/seed/music5/480/700",
    viewerCount: 219,
    startTime: Date.now() - 45 * 60000,
  },
  "6": {
    title: "Fitness Yoga Morning",
    hostName: "Tanvir A.",
    thumbnailUrl: "https://picsum.photos/seed/yoga6/480/700",
    viewerCount: 778,
    startTime: Date.now() - 3 * 3600000,
  },
};

const SAMPLE_MESSAGES = [
  { id: "s1", sender: "Farhan", message: "🔥🔥🔥 amazing!" },
  { id: "s2", sender: "Mitu", message: "Love this stream!" },
  { id: "s3", sender: "Rubel", message: "Good evening everyone 👋" },
  { id: "s4", sender: "Sima", message: "❤️ beautiful!" },
  { id: "s5", sender: "Jahid", message: "Keep it up!" },
];

const COIN_GIFTS = [
  { amount: 500, label: "500" },
  { amount: 1000, label: "1K" },
  { amount: 5000, label: "5K" },
  { amount: 100000, label: "100K" },
  { amount: 200000, label: "200K" },
  { amount: 500000, label: "500K" },
];

function formatDuration(startMs: number): string {
  const diffMs = Date.now() - startMs;
  const secs = Math.floor(diffMs / 1000) % 60;
  const mins = Math.floor(diffMs / 60000) % 60;
  const hrs = Math.floor(diffMs / 3600000);
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function useScrollToBottom(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally scroll on dep change
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [dep]);
  return ref;
}

export default function LiveRoomPage({
  roomId,
  isHost = false,
  liveType = "video",
  navigate,
}: {
  roomId: bigint;
  isHost?: boolean;
  liveType?: "audio" | "video";
  navigate: (p: AppPage) => void;
}) {
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const { identity } = useInternetIdentity();
  const { data: rooms } = useGetLiveRooms();
  const { data: chatMessages } = useGetChatMessages(roomId);
  const sendMessage = useSendMessage();

  // Camera/mic state
  const [isLive, setIsLive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Gift sheet
  const [giftOpen, setGiftOpen] = useState(false);
  const [floatingCoins, setFloatingCoins] = useState<
    { id: number; label: string }[]
  >([]);

  // Vote overlay
  const [voteOpen, setVoteOpen] = useState(false);
  const [votes, setVotes] = useState({ a: 42, b: 31 });

  const room = rooms?.find((r) => r.id === roomId);
  const fallback = SAMPLE_ROOMS_MAP[roomId.toString()];

  const displayTitle = room?.title ?? fallback?.title ?? "Live Stream";
  const displayHost = room?.hostName ?? fallback?.hostName ?? "Host";
  const displayThumb =
    room?.thumbnailUrl ??
    fallback?.thumbnailUrl ??
    `https://picsum.photos/seed/${roomId}/480/700`;
  const displayViewers = room
    ? Number(room.viewerCount)
    : (fallback?.viewerCount ?? 0);
  const startMs = room
    ? Number(room.startTime) > 1e15
      ? Number(room.startTime) / 1_000_000
      : Number(room.startTime)
    : (fallback?.startTime ?? Date.now());

  useEffect(() => {
    const t = setInterval(() => setTimer((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      for (const track of streamRef.current?.getTracks() ?? []) {
        track.stop();
      }
    };
  }, []);

  // Auto-start camera when host enters
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run once on mount
  useEffect(() => {
    if (!isHost) return;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: liveType === "video",
          audio: true,
        });
        streamRef.current = stream;
        setIsLive(true);
        toast.success("🔴 You are now live!");
      } catch {
        toast.error("Camera permission denied. Please allow camera access.");
      }
    };
    startCamera();
  }, []); // eslint-disable-line

  // Attach stream to video element once isLive is true
  useEffect(() => {
    if (
      isLive &&
      liveType === "video" &&
      videoRef.current &&
      streamRef.current
    ) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [isLive, liveType]);

  const messagesEndRef = useScrollToBottom(chatMessages);

  const allMessages =
    chatMessages && chatMessages.length > 0
      ? chatMessages.map((m, i) => ({
          key: `chat-${i}-${m.senderName}`,
          senderName: m.senderName,
          message: m.message,
        }))
      : SAMPLE_MESSAGES.map((m) => ({
          key: m.id,
          senderName: m.sender,
          message: m.message,
        }));

  const handleSend = async () => {
    if (!message.trim()) return;
    const principal = identity?.getPrincipal().toString() ?? "guest";
    try {
      await sendMessage.mutateAsync({
        roomId,
        senderName: `User ${principal.slice(0, 8)}`,
        message,
      });
      setMessage("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleGoLive = useCallback(async () => {
    if (isLive) {
      for (const track of streamRef.current?.getTracks() ?? []) {
        track.stop();
      }
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsLive(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: liveType === "video",
        audio: true,
      });
      streamRef.current = stream;
      // srcObject is set via useEffect after isLive becomes true
      setIsLive(true);
      toast.success("🔴 You are now live!");
    } catch {
      toast.error("Camera permission denied. Please allow camera access.");
    }
  }, [isLive, liveType]);

  const toggleMic = () => {
    if (streamRef.current) {
      for (const t of streamRef.current.getAudioTracks()) {
        t.enabled = !micOn;
      }
    }
    setMicOn((p) => !p);
  };

  const toggleCam = () => {
    if (streamRef.current) {
      for (const t of streamRef.current.getVideoTracks()) {
        t.enabled = !camOn;
      }
    }
    setCamOn((p) => !p);
  };

  const handleSendGift = (gift: { amount: number; label: string }) => {
    setGiftOpen(false);
    toast.success(`🎁 Sent ${gift.label} coins!`);
    const coinId = Date.now();
    setFloatingCoins((prev) => [...prev, { id: coinId, label: gift.label }]);
    setTimeout(() => {
      setFloatingCoins((prev) => prev.filter((c) => c.id !== coinId));
    }, 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: displayTitle, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      } catch {
        toast.error("Could not share");
      }
    }
  };

  const totalVotes = votes.a + votes.b;
  const pctA = totalVotes > 0 ? Math.round((votes.a / totalVotes) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div className="flex flex-col h-screen bg-black relative overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0">
        {/* Video element always in DOM; shown only for video live */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover ${
            isLive && liveType === "video" ? "block" : "hidden"
          }`}
        />

        {isLive && liveType === "audio" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-orange-600 via-orange-500 to-orange-800">
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center shadow-2xl border-4 border-white/30">
                <Mic size={60} className="text-white animate-pulse" />
              </div>
              <span className="text-white text-4xl font-extrabold tracking-widest drop-shadow-lg">
                RingID 2
              </span>
              <span className="text-orange-100 text-lg font-semibold">
                🎵 Audio Live
              </span>
            </div>
          </div>
        )}

        {!isLive && (
          <img
            src={displayThumb}
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      </div>

      {/* Floating coin animations */}
      <AnimatePresence>
        {floatingCoins.map((coin) => (
          <motion.div
            key={coin.id}
            className="absolute bottom-36 right-12 z-50 text-2xl pointer-events-none"
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -150, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            🪙 {coin.label}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Top overlay */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-5 pb-2">
        <button
          type="button"
          onClick={() => navigate({ name: "home" })}
          className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"
          data-ocid="live.close_button"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">
              {isLive ? "🔴 LIVE" : "LIVE"}
            </span>
            <span className="text-white text-base font-semibold">
              {displayTitle}
            </span>
          </div>
          <span className="text-white/70 text-sm">
            {isHost
              ? `You · #${
                  identity?.getPrincipal().toString()
                    ? Math.abs(
                        (identity
                          .getPrincipal()
                          .toString()
                          .split("")
                          .reduce((a, c) => a + c.charCodeAt(0), 0) %
                          9000000) +
                          1000000,
                      ).toString()
                    : "0000000"
                }`
              : displayHost}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1.5 rounded-full">
          <Users size={14} className="text-white" />
          <span className="text-white text-sm">
            {(displayViewers + Math.floor(timer / 30)).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Timer */}
      <div className="relative z-10 flex justify-center">
        <span className="bg-black/40 text-white text-sm px-3 py-1 rounded-full">
          {formatDuration(startMs)}
        </span>
      </div>

      {/* Right-side action buttons (TikTok style) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4 items-center">
        {/* Heart */}
        <button
          type="button"
          onClick={() => toast.success("❤️ Liked!")}
          className="flex flex-col items-center gap-0.5"
          data-ocid="live.toggle"
        >
          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
            <Heart size={20} className="text-red-400" />
          </div>
          <span className="text-white text-xs">Like</span>
        </button>

        {/* Gift */}
        <button
          type="button"
          onClick={() => setGiftOpen(true)}
          className="flex flex-col items-center gap-0.5"
          data-ocid="live.open_modal_button"
        >
          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
            <span className="text-xl">🎁</span>
          </div>
          <span className="text-white text-xs">Gift</span>
        </button>

        {/* Vote */}
        <button
          type="button"
          onClick={() => setVoteOpen((v) => !v)}
          className="flex flex-col items-center gap-0.5"
          data-ocid="live.vote.button"
        >
          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
            <span className="text-xl">🗳️</span>
          </div>
          <span className="text-white text-xs">Vote</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center gap-0.5"
          data-ocid="live.share.button"
        >
          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
            <Share2 size={18} className="text-white" />
          </div>
          <span className="text-white text-xs">Share</span>
        </button>

        {/* Camera toggle - hidden for audio live */}
        {isLive && liveType === "video" && (
          <button
            type="button"
            onClick={toggleCam}
            className="flex flex-col items-center gap-0.5"
            data-ocid="live.camera.toggle"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                camOn ? "bg-black/40" : "bg-red-500/80"
              }`}
            >
              {camOn ? (
                <Camera size={18} className="text-white" />
              ) : (
                <CameraOff size={18} className="text-white" />
              )}
            </div>
            <span className="text-white text-xs">Cam</span>
          </button>
        )}

        {/* Mic toggle */}
        {isLive && (
          <button
            type="button"
            onClick={toggleMic}
            className="flex flex-col items-center gap-0.5"
            data-ocid="live.mic.toggle"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                micOn ? "bg-black/40" : "bg-red-500/80"
              }`}
            >
              {micOn ? (
                <Mic size={18} className="text-white" />
              ) : (
                <MicOff size={18} className="text-white" />
              )}
            </div>
            <span className="text-white text-xs">Mic</span>
          </button>
        )}
      </div>

      {/* Vote overlay */}
      <AnimatePresence>
        {voteOpen && (
          <motion.div
            className="absolute left-4 right-16 top-1/3 z-30 bg-black/70 rounded-2xl p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold text-base">
                🗳️ Live Vote
              </span>
              <button
                type="button"
                onClick={() => setVoteOpen(false)}
                className="text-white/60 text-xl"
              >
                ×
              </button>
            </div>
            {/* Team A */}
            <button
              type="button"
              onClick={() => setVotes((v) => ({ ...v, a: v.a + 1 }))}
              className="w-full mb-3 text-left"
              data-ocid="live.vote.button"
            >
              <div className="flex justify-between text-white text-sm mb-1">
                <span>🔵 Team A</span>
                <span>
                  {votes.a} ({pctA}%)
                </span>
              </div>
              <Progress value={pctA} className="h-3 bg-white/20" />
            </button>
            {/* Team B */}
            <button
              type="button"
              onClick={() => setVotes((v) => ({ ...v, b: v.b + 1 }))}
              className="w-full text-left"
            >
              <div className="flex justify-between text-white text-sm mb-1">
                <span>🔴 Team B</span>
                <span>
                  {votes.b} ({pctB}%)
                </span>
              </div>
              <Progress value={pctB} className="h-3 bg-white/20" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1" />

      {/* Chat panel */}
      <div className="relative z-10 max-h-64">
        <ScrollArea className="h-56 px-3">
          <AnimatePresence>
            {allMessages.map((msg, i) => (
              <motion.div
                key={msg.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 mb-1.5"
                data-ocid={`live.item.${i + 1}`}
              >
                <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-none">
                  <span className="text-white text-xs font-bold">
                    {msg.senderName[0]}
                  </span>
                </div>
                <div className="bg-black/40 rounded-xl px-3 py-1.5 max-w-[70%]">
                  <span className="text-orange-400 text-xs font-semibold">
                    {msg.senderName}
                  </span>
                  <p className="text-white text-sm">{msg.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>

      {/* Bottom action row */}
      <div className="relative z-10 px-3 pb-4 pt-2 flex items-center gap-2">
        <Input
          placeholder="Say something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/50 rounded-full"
          data-ocid="live.input"
        />
        <Button
          type="button"
          size="icon"
          className="w-10 h-10 rounded-full bg-orange-500 flex-none"
          onClick={handleSend}
          disabled={sendMessage.isPending || !message.trim()}
          data-ocid="live.submit_button"
        >
          <Send size={18} />
        </Button>

        {/* Go Live / Stop Live button */}
        <button
          type="button"
          onClick={handleGoLive}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-white text-sm font-bold ${
            isLive ? "bg-red-600" : "bg-orange-500"
          }`}
          data-ocid="live.primary_button"
        >
          {isLive ? (
            <>
              <Radio size={14} className="animate-pulse" /> Stop
            </>
          ) : (
            <>
              <Video size={14} /> Go Live
            </>
          )}
        </button>
      </div>

      {/* Gift Sheet */}
      <Sheet open={giftOpen} onOpenChange={setGiftOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl bg-orange-50 border-orange-200"
          data-ocid="live.sheet"
        >
          <SheetHeader>
            <SheetTitle className="text-orange-600 text-center text-lg">
              🎁 Send a Gift
            </SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3 mt-4 pb-4">
            {COIN_GIFTS.map((gift) => (
              <button
                key={gift.amount}
                type="button"
                onClick={() => handleSendGift(gift)}
                className="flex flex-col items-center gap-1.5 bg-white rounded-2xl py-4 shadow-sm border border-orange-100 active:bg-orange-50"
                data-ocid="live.gift.button"
              >
                <span className="text-3xl">🪙</span>
                <span className="text-orange-600 font-bold text-base">
                  {gift.label}
                </span>
                <span className="text-gray-400 text-xs">coins</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

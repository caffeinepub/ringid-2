import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Camera,
  Heart,
  Image,
  MessageCircle,
  Mic,
  PenLine,
  Plus,
  QrCode,
  Share2,
  ShoppingCart,
  User,
  Wallet,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import type { Room } from "../backend";
import { useCreateRoom, useGetLiveRooms } from "../hooks/useQueries";

const SAMPLE_ROOMS: Room[] = [
  {
    id: 1n,
    title: "Morning Dance Party 🎵",
    hostName: "Priya S.",
    thumbnailUrl: "https://picsum.photos/seed/dance1/300/200",
    isActive: true,
    viewerCount: 1243n,
    startTime: BigInt(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 2n,
    title: "Tech Talk: AI Trends",
    hostName: "Arif H.",
    thumbnailUrl: "https://picsum.photos/seed/tech2/300/200",
    isActive: true,
    viewerCount: 892n,
    startTime: BigInt(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 3n,
    title: "Cooking Bengali Biryani 🍛",
    hostName: "Ruma B.",
    thumbnailUrl: "https://picsum.photos/seed/cook3/300/200",
    isActive: true,
    viewerCount: 567n,
    startTime: BigInt(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 4n,
    title: "Live Drawing Session",
    hostName: "Karim R.",
    thumbnailUrl: "https://picsum.photos/seed/art4/300/200",
    isActive: true,
    viewerCount: 334n,
    startTime: BigInt(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 5n,
    title: "Guitar Lessons for Beginners",
    hostName: "Nadia M.",
    thumbnailUrl: "https://picsum.photos/seed/music5/300/200",
    isActive: true,
    viewerCount: 219n,
    startTime: BigInt(Date.now() - 45 * 60 * 1000),
  },
  {
    id: 6n,
    title: "Fitness Yoga Morning",
    hostName: "Tanvir A.",
    thumbnailUrl: "https://picsum.photos/seed/yoga6/300/200",
    isActive: true,
    viewerCount: 778n,
    startTime: BigInt(Date.now() - 3 * 60 * 60 * 1000),
  },
];

const SAMPLE_POSTS = [
  {
    id: 1,
    author: "Priya S.",
    time: "5 min ago",
    text: "Good morning Bangladesh! আজকের দিনটা সুন্দর হোক 🌅",
    likes: 24,
    comments: 7,
    liked: false,
    image: "https://picsum.photos/seed/post1/400/300",
  },
  {
    id: 2,
    author: "Arif H.",
    time: "20 min ago",
    text: "Just finished my live session! Thanks to everyone who joined 🙏",
    likes: 56,
    comments: 12,
    liked: false,
    image: null,
  },
  {
    id: 3,
    author: "Ruma B.",
    time: "1 hour ago",
    text: "রান্না করতে গিয়ে নতুন রেসিপি বানালাম! চেষ্টা করে দেখুন 👩‍🍳",
    likes: 89,
    comments: 23,
    liked: false,
    image: "https://picsum.photos/seed/post3/400/300",
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
    <span className="text-xs text-muted-foreground tabular-nums">
      {h}:{m}:{s}
    </span>
  );
}

export default function HomePage({
  navigate,
  openDrawer,
  openQr,
  userId,
  userName,
  userInitial,
}: {
  navigate: (page: AppPage) => void;
  openDrawer: () => void;
  openQr: () => void;
  userId: string;
  userName: string;
  userInitial: string;
}) {
  const [newTitle, setNewTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [liveTypeOpen, setLiveTypeOpen] = useState(false);
  const [selectedLiveType, setSelectedLiveType] = useState<"audio" | "video">(
    "video",
  );
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { data: liveRooms, isLoading } = useGetLiveRooms();
  const createRoom = useCreateRoom();

  const rooms = liveRooms && liveRooms.length > 0 ? liveRooms : SAMPLE_ROOMS;

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    let newRoomId: bigint = BigInt(Date.now());
    try {
      newRoomId = await createRoom.mutateAsync({
        title: newTitle,
        hostName: userName,
        thumbnailUrl: `https://picsum.photos/seed/${userId}/300/200`,
      });
    } catch {
      // backend failed, use local id
    }
    setDialogOpen(false);
    setNewTitle("");
    navigate({
      name: "live",
      roomId: newRoomId,
      isHost: true,
      liveType: selectedLiveType,
    });
  };

  const handleSelectLiveType = (type: "audio" | "video") => {
    setSelectedLiveType(type);
    setLiveTypeOpen(false);
    setDialogOpen(true);
  };

  const handlePost = () => {
    if (!postText.trim() && !postImage) return;
    setPosts((prev) => [
      {
        id: Date.now(),
        author: `User #${userId}`,
        time: "Just now",
        text: postText,
        likes: 0,
        comments: 0,
        liked: false,
        image: postImage,
      },
      ...prev,
    ]);
    setPostText("");
    setPostImage(null);
    toast.success("Post shared!");
  };

  const handleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") setPostImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ScrollArea className="flex-1">
        <div className="pb-20">
          {/* Quick action shortcuts */}
          <div className="bg-white px-3 py-3 mb-2">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
              {[
                {
                  icon: User,
                  label: "Profile",
                  bg: "bg-gray-200",
                  color: "text-gray-700",
                  onClick: () => navigate({ name: "profile" }),
                  ocid: "home.profile.button",
                },
                {
                  icon: PenLine,
                  label: "Add Status",
                  bg: "bg-blue-500",
                  color: "text-white",
                  onClick: () => toast.info("Add Status"),
                  ocid: "home.status.button",
                },
                {
                  icon: Wallet,
                  label: "Wallet",
                  bg: "bg-blue-600",
                  color: "text-white",
                  onClick: openDrawer,
                  ocid: "home.wallet.button",
                },
                {
                  icon: QrCode,
                  label: "My Code",
                  bg: "bg-gray-200",
                  color: "text-gray-700",
                  onClick: openQr,
                  ocid: "home.qrcode.button",
                },
                {
                  icon: Calendar,
                  label: "Events",
                  bg: "bg-gray-200",
                  color: "text-gray-700",
                  onClick: () => toast.info("Events"),
                  ocid: "home.calendar.button",
                },
                {
                  icon: Camera,
                  label: "Go Live",
                  bg: "bg-primary",
                  color: "text-white",
                  onClick: () => setLiveTypeOpen(true),
                  ocid: "home.golive.button",
                },
              ].map(({ icon: Icon, label, bg, color, onClick, ocid }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className="flex flex-col items-center gap-1.5 flex-none"
                  data-ocid={ocid}
                >
                  <div
                    className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center`}
                  >
                    <Icon size={22} className={color} />
                  </div>
                  <span className="text-[11px] text-gray-600 font-medium whitespace-nowrap">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* COVID-19 cards */}
          <div className="px-3 mb-2 grid grid-cols-2 gap-2">
            <div className="bg-gray-800 rounded-2xl p-3.5 flex flex-col gap-2">
              <div className="text-2xl">🦠</div>
              <p className="text-gray-300 text-[11px]">করোনা ভাইরাস</p>
              <p className="text-white font-bold text-base">COVID-19</p>
              <button
                type="button"
                className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg w-fit"
                onClick={() => toast.info("COVID-19 Update")}
                data-ocid="home.covid_update.button"
              >
                UPDATE
              </button>
            </div>
            <div className="bg-gray-800 rounded-2xl p-3.5 flex flex-col gap-2">
              <div className="text-2xl">🦠</div>
              <p className="text-gray-300 text-[11px]">করোনা ভাইরাস</p>
              <p className="text-white font-bold text-base">COVID-19</p>
              <button
                type="button"
                className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg w-fit"
                onClick={() => toast.info("তথ্য কেন্দ্র")}
                data-ocid="home.covid_info.button"
              >
                তথ্য কেন্দ্র
              </button>
            </div>
          </div>

          {/* Banner cards */}
          <div className="px-3 mb-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="bg-white rounded-2xl p-4 flex flex-col items-start gap-1 shadow-card border border-gray-100"
              onClick={() => navigate({ name: "live", roomId: BigInt(1) })}
              data-ocid="home.public_room.button"
            >
              <span className="text-gray-500 text-[11px] font-semibold">
                JOIN
              </span>
              <div className="flex items-center gap-1">
                <span className="text-red-600 font-black text-xl">LIVE</span>
                <span className="text-xl">📹</span>
              </div>
              <span className="text-gray-700 font-semibold text-xs">
                PUBLIC ROOM
              </span>
            </button>
            <button
              type="button"
              className="bg-white rounded-2xl p-4 flex flex-col items-start gap-2 shadow-card border border-gray-100"
              onClick={() => toast.info("Community Discount Zone")}
              data-ocid="home.discount.button"
            >
              <ShoppingCart size={22} className="text-primary" />
              <span className="text-gray-800 font-bold text-xs leading-tight">
                COMMUNITY DISCOUNT ZONE
              </span>
            </button>
          </div>

          {/* Live streamers - vertical list */}
          <div className="bg-white mb-2">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Now
              </h2>
              <button
                type="button"
                className="text-xs text-primary font-semibold"
                data-ocid="home.secondary_button"
              >
                See all
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {isLoading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <Skeleton className="w-16 h-16 rounded-xl flex-none" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-28 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))
                : rooms.slice(0, 6).map((room, idx) => (
                    <motion.div
                      key={room.id.toString()}
                      className="flex items-center gap-3 px-4 py-3"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      data-ocid={`home.item.${idx + 1}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          navigate({ name: "live", roomId: room.id })
                        }
                        className="relative flex-none"
                      >
                        <img
                          src={
                            room.thumbnailUrl ||
                            `https://picsum.photos/seed/${room.id}/200/200`
                          }
                          alt={room.title}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          LIVE
                        </span>
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate">
                          {room.hostName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          LIVE on{" "}
                          <span className="text-primary font-semibold">
                            RingID 2
                          </span>
                        </p>
                        <LiveTimer startTime={room.startTime} />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          navigate({ name: "live", roomId: room.id })
                        }
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-none"
                        data-ocid={`home.join.button.${idx + 1}`}
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </motion.div>
                  ))}
            </div>
          </div>

          {/* Post feed */}
          <div className="px-3">
            <h2 className="font-bold text-sm mb-3 px-1">📝 Feed</h2>
            {/* Create post */}
            <div className="bg-white rounded-2xl shadow-card mb-3 overflow-hidden">
              <div className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-none">
                  <span className="text-white font-bold text-sm">
                    {userInitial}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePost()}
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none"
                  data-ocid="home.input"
                />
              </div>
              {postImage && (
                <div className="relative mx-3 mb-2">
                  <img
                    src={postImage}
                    alt="preview"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setPostImage(null)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              )}
              <div className="flex border-t border-border">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagePick}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-muted-foreground hover:bg-gray-50 transition-colors"
                  data-ocid="home.upload_button"
                >
                  <Image size={16} className="text-green-500" />
                  <span className="text-sm">Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handlePost}
                  disabled={!postText.trim() && !postImage}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-primary font-semibold hover:bg-accent disabled:opacity-40 transition-colors"
                  data-ocid="home.post.button"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-2xl shadow-card mb-3 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                data-ocid={`home.feed.item.${idx + 1}`}
              >
                <div className="p-3">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-none">
                      <span className="text-white font-bold text-sm">
                        {post.author[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{post.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.time}
                      </p>
                    </div>
                  </div>
                  {post.text && (
                    <p className="text-sm text-foreground mb-2 leading-relaxed">
                      {post.text}
                    </p>
                  )}
                </div>
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full max-h-56 object-cover"
                  />
                )}
                <div className="flex border-t border-border">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 ${
                      post.liked ? "text-red-500" : "text-muted-foreground"
                    } hover:bg-gray-50 transition-colors`}
                    data-ocid={`home.like.button.${idx + 1}`}
                  >
                    <Heart
                      size={16}
                      fill={post.liked ? "currentColor" : "none"}
                    />
                    <span className="text-xs">{post.likes}</span>
                  </button>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-muted-foreground hover:bg-gray-50 transition-colors"
                    data-ocid={`home.comment.button.${idx + 1}`}
                  >
                    <MessageCircle size={16} />
                    <span className="text-xs">{post.comments}</span>
                  </button>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-muted-foreground hover:bg-gray-50 transition-colors"
                    onClick={() => toast.success("Link copied!")}
                    data-ocid={`home.share.button.${idx + 1}`}
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </motion.div>
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

      {/* Live type selection modal */}
      <Dialog open={liveTypeOpen} onOpenChange={setLiveTypeOpen}>
        <DialogContent
          className="max-w-[380px] rounded-2xl"
          data-ocid="home.livetype.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-primary">
              Choose Live Type
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4 pb-2">
            <button
              type="button"
              onClick={() => handleSelectLiveType("audio")}
              className="flex flex-col items-center gap-3 bg-accent border-2 border-primary/20 rounded-2xl py-8 px-4 hover:border-primary transition-colors"
              data-ocid="home.audio_live.button"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-orange">
                <Mic size={32} className="text-white" />
              </div>
              <span className="text-primary font-bold">Audio Live</span>
              <span className="text-muted-foreground text-xs text-center">
                Mic only, RingID 2 branding
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectLiveType("video")}
              className="flex flex-col items-center gap-3 bg-accent border-2 border-primary/20 rounded-2xl py-8 px-4 hover:border-primary transition-colors"
              data-ocid="home.video_live.button"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-orange">
                <Camera size={32} className="text-white" />
              </div>
              <span className="text-primary font-bold">Video Live</span>
              <span className="text-muted-foreground text-xs text-center">
                Camera + mic stream
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Go Live floating button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="absolute bottom-6 right-4 w-14 h-14 rounded-full text-white shadow-orange flex items-center justify-center z-10 orange-gradient"
            data-ocid="home.open_modal_button"
          >
            <Plus size={26} />
          </button>
        </DialogTrigger>
        <DialogContent
          className="max-w-[380px] rounded-2xl"
          data-ocid="home.dialog"
        >
          <DialogHeader>
            <DialogTitle>Go Live</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Stream title (e.g. Morning Yoga 🧘)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              data-ocid="home.input"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDialogOpen(false)}
                data-ocid="home.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 orange-gradient text-white"
                onClick={handleCreate}
                disabled={createRoom.isPending || !newTitle.trim()}
                data-ocid="home.submit_button"
              >
                {createRoom.isPending ? "Creating..." : "Start Live"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
  Bell,
  Briefcase,
  Camera,
  Heart,
  Home,
  Image,
  Menu,
  MessageCircle,
  Mic,
  MoreHorizontal,
  PhoneCall,
  Plus,
  QrCode,
  Radio,
  Search,
  Settings,
  Share2,
  ShoppingBag,
  Stethoscope,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import type { Room } from "../backend";
import BottomNav from "../components/BottomNav";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
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

function formatDuration(startTimeMs: number): string {
  const diffMs = Date.now() - startTimeMs;
  const secs = Math.floor(diffMs / 1000) % 60;
  const mins = Math.floor(diffMs / 60000) % 60;
  const hrs = Math.floor(diffMs / 3600000);
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function LiveTimer({ startTime }: { startTime: bigint }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const startMs =
    Number(startTime) > 1e15
      ? Number(startTime) / 1_000_000
      : Number(startTime);
  return <span>{formatDuration(startMs)}</span>;
}

const TOP_TABS = [
  { id: "home", icon: Home },
  { id: "camera", icon: Camera },
  { id: "live", icon: Radio },
  { id: "call", icon: PhoneCall },
  { id: "shop", icon: ShoppingBag },
];

export default function HomePage({
  navigate,
}: { navigate: (page: AppPage) => void }) {
  const [activeTab, setActiveTab] = useState("home");
  const [newTitle, setNewTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [liveTypeOpen, setLiveTypeOpen] = useState(false);
  const [selectedLiveType, setSelectedLiveType] = useState<"audio" | "video">(
    "video",
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { identity } = useInternetIdentity();
  const { data: liveRooms, isLoading } = useGetLiveRooms();
  const createRoom = useCreateRoom();

  const rooms = liveRooms && liveRooms.length > 0 ? liveRooms : SAMPLE_ROOMS;

  const principal = identity?.getPrincipal().toString() ?? "";
  const userId = principal
    ? Math.abs(
        (principal.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
          9000000) +
          1000000,
      ).toString()
    : "1234567";

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const shortId = principal.slice(0, 8);
    let newRoomId: bigint = BigInt(Date.now());
    try {
      newRoomId = await createRoom.mutateAsync({
        title: newTitle,
        hostName: `User ${shortId}`,
        thumbnailUrl: `https://picsum.photos/seed/${shortId}/300/200`,
      });
    } catch {
      // backend failed, use local id — still proceed to live
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

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "camera") {
      setLiveTypeOpen(true);
    }
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* ===== TOP HEADER ===== */}
      <header className="bg-white flex-none shadow-sm">
        {/* Search bar slide-in */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="absolute top-0 left-0 right-0 z-30 bg-white px-3 h-14 flex items-center gap-2 shadow-md"
              initial={{ y: -56 }}
              animate={{ y: 0 }}
              exit={{ y: -56 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1"
                data-ocid="home.search_input"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                data-ocid="home.close_button"
              >
                <X size={22} className="text-gray-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification panel */}
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              className="absolute top-0 left-0 right-0 z-30 bg-white shadow-xl rounded-b-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-bold text-base">Notifications</span>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  data-ocid="home.close_button"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="px-4 py-6 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-30" />
                <p>No new notifications</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR modal */}
        <AnimatePresence>
          {qrOpen && (
            <motion.div
              className="absolute inset-0 z-40 bg-black/50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 mx-6 w-full max-w-[320px]"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                data-ocid="home.modal"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-lg">Your QR Code</span>
                  <button
                    type="button"
                    onClick={() => setQrOpen(false)}
                    data-ocid="home.close_button"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <QrCode size={80} className="text-[#FF6B00]" />
                  </div>
                  <p className="text-sm text-gray-500">ID: #{userId}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Share your QR to connect
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 1 */}
        <div className="flex items-center justify-between px-3 h-14">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
              data-ocid="home.menu_button"
            >
              <Menu size={26} className="text-gray-700" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Settings size={24} className="text-gray-700" />
            </button>
          </div>
          <span className="text-lg font-semibold text-gray-800">Home</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setSearchOpen(true)}
              data-ocid="home.search_input"
            >
              <Search size={24} className="text-gray-700" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setNotifOpen(true)}
              data-ocid="home.bell.button"
            >
              <Bell size={24} className="text-gray-700" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setQrOpen(true)}
              data-ocid="home.qrcode.button"
            >
              <QrCode size={22} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Row 2: 5 icon tabs */}
        <div className="flex border-t border-gray-100">
          {TOP_TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex-1 flex flex-col items-center py-2.5 relative"
              data-ocid={`home.${tab.id}.tab`}
            >
              <tab.icon
                size={22}
                className={
                  activeTab === tab.id ? "text-orange-500" : "text-gray-500"
                }
              />
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ===== SCROLLABLE BODY ===== */}
      <ScrollArea className="flex-1">
        <div className="pb-24">
          {/* Quick Actions Row */}
          <div className="bg-white px-3 py-3 mb-2">
            <div className="flex justify-around">
              <button
                type="button"
                onClick={() => navigate({ name: "profile" })}
                className="flex flex-col items-center gap-1.5"
                data-ocid="home.profile.button"
              >
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={28} className="text-gray-500" />
                </div>
                <span className="text-xs text-gray-600">Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setLiveTypeOpen(true)}
                className="flex flex-col items-center gap-1.5"
                data-ocid="home.status.button"
              >
                <div className="relative w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Camera size={24} className="text-gray-500" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <Radio size={10} className="text-white" />
                  </span>
                </div>
                <span className="text-xs text-gray-600">Go Live</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center gap-1.5"
                data-ocid="home.wallet.button"
              >
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                  <Wallet size={28} className="text-orange-500" />
                </div>
                <span className="text-xs text-gray-600">Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setQrOpen(true)}
                className="flex flex-col items-center gap-1.5"
                data-ocid="home.qrcode.button"
              >
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                  <QrCode size={28} className="text-orange-500" />
                </div>
                <span className="text-xs text-gray-600">My Code</span>
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="bg-white px-3 py-3 mb-2">
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm"
                data-ocid="home.islamic.button"
              >
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🕌</span>
                </div>
                <span className="text-xs text-gray-700 text-center leading-tight">
                  ইসলামিক ফ্লোর
                </span>
              </button>

              <button
                type="button"
                className="bg-green-500 rounded-2xl p-3 flex flex-col items-start gap-1 shadow-sm"
                data-ocid="home.jobs.button"
              >
                <div className="flex items-center gap-1">
                  <Heart size={14} className="text-white" />
                  <Users size={14} className="text-white" />
                </div>
                <span className="text-xs text-green-100">Community</span>
                <span className="text-lg font-bold text-white leading-tight">
                  Jobs
                </span>
              </button>

              <button
                type="button"
                className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm"
                data-ocid="home.doctors.button"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope size={22} className="text-blue-500" />
                </div>
                <span className="text-xs text-gray-700 text-center">
                  Doctors
                </span>
              </button>

              <button
                type="button"
                className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm"
                data-ocid="home.agent.button"
              >
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-bold text-orange-500">
                    ring
                  </span>
                  <span className="text-lg font-bold text-gray-800">agent</span>
                </div>
                <Briefcase size={18} className="text-gray-500" />
              </button>

              <button
                type="button"
                className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm relative"
                data-ocid="home.notice.button"
              >
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
                <span className="text-xl">📋</span>
                <span className="text-xs font-bold text-gray-800">Notice</span>
              </button>

              <button
                type="button"
                className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm"
                data-ocid="home.more.button"
              >
                <MoreHorizontal size={22} className="text-orange-500" />
                <span className="text-xs font-semibold text-orange-500">
                  More &gt;&gt;&gt;
                </span>
              </button>
            </div>
          </div>

          {/* Ringstore Banner */}
          <div className="mx-3 mb-3 rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-0.5 mb-2">
                  <span className="text-2xl font-extrabold text-orange-500">
                    ring
                  </span>
                  <span className="text-2xl font-extrabold text-gray-900">
                    store
                  </span>
                </div>
                <button
                  type="button"
                  className="bg-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full"
                  data-ocid="home.shop.button"
                >
                  Shop Now
                </button>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-5xl">📱</span>
                <span className="text-4xl">📱</span>
              </div>
            </div>
          </div>

          {/* ===== SOCIAL POST FEED ===== */}
          <div className="px-3 mb-3">
            <h2 className="text-base font-bold mb-2">📝 Feed</h2>

            {/* Create Post */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-3 overflow-hidden">
              <div className="p-3 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePost()}
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
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
              <div className="flex border-t border-gray-100">
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
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-gray-500 hover:bg-gray-50"
                  data-ocid="home.upload_button"
                >
                  <Image size={18} className="text-green-500" />
                  <span className="text-sm">Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handlePost}
                  disabled={!postText.trim() && !postImage}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[#FF6B00] font-semibold hover:bg-orange-50 disabled:opacity-40"
                  data-ocid="home.post.button"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts list */}
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-3 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                data-ocid={`home.feed.item.${idx + 1}`}
              >
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B00] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-base">
                        {post.author[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {post.author}
                      </p>
                      <p className="text-xs text-gray-400">{post.time}</p>
                    </div>
                  </div>
                  {post.text && (
                    <p className="text-sm text-gray-800 mb-2 leading-relaxed">
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
                <div className="flex border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 ${
                      post.liked ? "text-red-500" : "text-gray-500"
                    } hover:bg-gray-50`}
                    data-ocid={`home.like.button.${idx + 1}`}
                  >
                    <Heart
                      size={18}
                      fill={post.liked ? "currentColor" : "none"}
                    />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-gray-500 hover:bg-gray-50"
                    data-ocid={`home.comment.button.${idx + 1}`}
                  >
                    <MessageCircle size={18} />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-gray-500 hover:bg-gray-50"
                    onClick={() => toast.success("Link copied!")}
                    data-ocid={`home.share.button.${idx + 1}`}
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Live streamers section */}
          <div className="px-3 pb-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold">🔴 Live Now</h2>
              <span className="text-sm text-orange-500 font-medium">
                See all
              </span>
            </div>

            {isLoading ? (
              <div
                className="grid grid-cols-2 gap-2"
                data-ocid="home.loading_state"
              >
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <div
                className="text-center py-10 text-gray-400"
                data-ocid="home.empty_state"
              >
                <Radio size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-base">No live streams yet</p>
                <p className="text-sm mt-1">Be the first to go live!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2" data-ocid="home.list">
                {rooms.map((room, idx) => (
                  <motion.button
                    type="button"
                    key={room.id.toString()}
                    onClick={() => navigate({ name: "live", roomId: room.id })}
                    className="relative rounded-xl overflow-hidden text-left shadow-sm bg-white"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    data-ocid={`home.item.${idx + 1}`}
                  >
                    <img
                      src={
                        room.thumbnailUrl ||
                        `https://picsum.photos/seed/${room.id}/300/200`
                      }
                      alt={room.title}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        LIVE
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/50 px-1.5 py-0.5 rounded text-white text-xs">
                      <Users size={10} />
                      <span>{Number(room.viewerCount).toLocaleString()}</span>
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-semibold truncate">
                        {room.title}
                      </p>
                      <p className="text-xs text-gray-500">{room.hostName}</p>
                      <p className="text-xs text-orange-500 mt-0.5">
                        LIVE · <LiveTimer startTime={room.startTime} />
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Live Type Selection Modal */}
      <Dialog open={liveTypeOpen} onOpenChange={setLiveTypeOpen}>
        <DialogContent
          className="max-w-[380px] rounded-2xl"
          data-ocid="home.livetype.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-orange-600">
              Choose Live Type
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4 pb-2">
            <button
              type="button"
              onClick={() => handleSelectLiveType("audio")}
              className="flex flex-col items-center gap-3 bg-orange-50 border-2 border-orange-200 rounded-2xl py-8 px-4 active:bg-orange-100 hover:border-orange-400 transition-colors"
              data-ocid="home.audio_live.button"
            >
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                <Mic size={32} className="text-white" />
              </div>
              <span className="text-orange-700 font-bold text-base">
                Audio Live
              </span>
              <span className="text-gray-500 text-xs text-center">
                Microphone only, RingID 2 branding shown
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectLiveType("video")}
              className="flex flex-col items-center gap-3 bg-orange-50 border-2 border-orange-200 rounded-2xl py-8 px-4 active:bg-orange-100 hover:border-orange-400 transition-colors"
              data-ocid="home.video_live.button"
            >
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                <Camera size={32} className="text-white" />
              </div>
              <span className="text-orange-700 font-bold text-base">
                Video Live
              </span>
              <span className="text-gray-500 text-xs text-center">
                Camera + microphone, full video stream
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Go Live button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="absolute bottom-24 right-4 w-16 h-16 rounded-full bg-orange-500 text-white shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors z-10"
            data-ocid="home.open_modal_button"
          >
            <Plus size={30} />
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
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
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

      <BottomNav navigate={navigate} active="home" />
    </div>
  );
}

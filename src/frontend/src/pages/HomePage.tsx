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
  ArrowLeftRight,
  Bell,
  Briefcase,
  Camera,
  CreditCard,
  Heart,
  Image,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Plus,
  QrCode,
  Radio,
  Search,
  Share2,
  ShoppingCart,
  Stethoscope,
  TrendingUp,
  Tv,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
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

export default function HomePage({
  navigate,
}: { navigate: (page: AppPage) => void }) {
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
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    : "2415 5412";
  const userInitial = principal ? principal[0].toUpperCase() : "U";
  const userName = principal ? `User ${principal.slice(0, 6)}` : "Uptodown";

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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* SIDE DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-50 w-[300px] bg-white flex flex-col shadow-2xl overflow-hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              data-ocid="home.drawer.panel"
            >
              {/* Drawer header */}
              <div className="orange-gradient px-5 pt-12 pb-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center flex-none">
                    <span className="text-white font-bold text-3xl">
                      {userInitial}
                    </span>
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-white font-bold text-base">{userName}</p>
                    <p className="text-white/80 text-sm mt-0.5">
                      ID: #{userId}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                        🪙 0
                      </span>
                      <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                        🥇 25K
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                {/* Wallet */}
                <div className="mx-3 mt-3 bg-white rounded-2xl shadow-card overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                    <Wallet size={18} className="text-primary" />
                    <span className="font-bold text-sm">Wallet</span>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-gray-100">
                    {[
                      {
                        icon: ShoppingCart,
                        label: "Buy",
                        ocid: "home.drawer.buy.button",
                      },
                      {
                        icon: ArrowLeftRight,
                        label: "Transfer",
                        ocid: "home.drawer.transfer.button",
                      },
                      {
                        icon: CreditCard,
                        label: "Cash Out",
                        ocid: "home.drawer.cashout.button",
                      },
                    ].map(({ icon: Icon, label, ocid }) => (
                      <button
                        key={label}
                        type="button"
                        className="flex flex-col items-center gap-1.5 py-4 hover:bg-accent transition-colors"
                        data-ocid={ocid}
                      >
                        <Icon size={20} className="text-primary" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* My Page button */}
                <div className="mx-3 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate({ name: "profile" });
                    }}
                    className="w-full text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-bold text-sm shadow-orange transition-opacity hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.64 0.22 38) 0%, oklch(0.70 0.20 50) 100%)",
                    }}
                    data-ocid="home.drawer.mypage.button"
                  >
                    <Lock size={16} />
                    My Page
                  </button>
                </div>

                {/* Menu items */}
                <div className="mx-3 mt-3 bg-white rounded-2xl shadow-card overflow-hidden mb-6">
                  {[
                    {
                      icon: Users,
                      label: "Refer & Earn",
                      color: "text-blue-500",
                      bg: "bg-blue-50",
                      ocid: "home.drawer.refer.button",
                    },
                    {
                      icon: MapPin,
                      label: "Ring Agent",
                      color: "text-primary",
                      bg: "bg-accent",
                      ocid: "home.drawer.ringagent.button",
                    },
                    {
                      icon: MapPin,
                      label: "প্রবাসী Agent",
                      color: "text-red-500",
                      bg: "bg-red-50",
                      ocid: "home.drawer.probasi.button",
                    },
                    {
                      icon: TrendingUp,
                      label: "Investment",
                      color: "text-green-600",
                      bg: "bg-green-50",
                      ocid: "home.drawer.investment.button",
                    },
                    {
                      icon: Briefcase,
                      label: "Jobs",
                      color: "text-indigo-600",
                      bg: "bg-indigo-50",
                      ocid: "home.drawer.jobs.button",
                    },
                    {
                      icon: Stethoscope,
                      label: "Doctors",
                      color: "text-cyan-600",
                      bg: "bg-cyan-50",
                      ocid: "home.drawer.doctors.button",
                    },
                  ].map(({ icon: Icon, label, color, bg, ocid }, i) => (
                    <button
                      key={label}
                      type="button"
                      className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${i < 5 ? "border-b border-gray-100" : ""}`}
                      data-ocid={ocid}
                    >
                      <div
                        className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center flex-none`}
                      >
                        <Icon size={17} className={color} />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="bg-white flex-none shadow-sm relative z-10">
        {/* Search bar */}
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
                <X size={22} className="text-muted-foreground" />
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
                <span className="font-bold">Notifications</span>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  data-ocid="home.close_button"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>
              <div className="px-4 py-8 text-center text-muted-foreground">
                <Bell size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No new notifications</p>
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
                className="bg-white rounded-2xl p-6 mx-6 w-full max-w-[320px] shadow-xl"
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
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <QrCode size={80} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">ID: #{userId}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Share your QR to connect
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header row */}
        <div className="flex items-center justify-between px-3 h-14">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-accent transition-colors"
            onClick={() => setDrawerOpen(true)}
            data-ocid="home.menu_button"
          >
            <Menu size={24} className="text-foreground" />
          </button>
          <div className="flex items-center gap-1.5">
            <img
              src="/assets/generated/ringid-logo.dim_120x120.png"
              alt="RingID 2"
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-bold text-base">RingID 2</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              onClick={() => setSearchOpen(true)}
              data-ocid="home.search_input"
            >
              <Search size={20} className="text-foreground" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              onClick={() => setNotifOpen(true)}
              data-ocid="home.bell.button"
            >
              <Bell size={20} className="text-foreground" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              onClick={() => setQrOpen(true)}
              data-ocid="home.qrcode.button"
            >
              <QrCode size={19} className="text-foreground" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              onClick={() => navigate({ name: "tv" })}
              data-ocid="home.tv.button"
            >
              <Tv size={19} className="text-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* SCROLLABLE BODY */}
      <ScrollArea className="flex-1">
        <div className="pb-8">
          {/* Quick Actions */}
          <div className="bg-white px-4 py-4 mb-3">
            <div className="flex justify-between">
              {[
                {
                  icon: User,
                  label: "Profile",
                  bg: "bg-gray-100",
                  color: "text-gray-600",
                  onClick: () => navigate({ name: "profile" }),
                  ocid: "home.profile.button",
                  live: false,
                },
                {
                  icon: Camera,
                  label: "Go Live",
                  bg: "bg-primary",
                  color: "text-white",
                  onClick: () => setLiveTypeOpen(true),
                  ocid: "home.status.button",
                  live: true,
                },
                {
                  icon: Wallet,
                  label: "Wallet",
                  bg: "bg-accent",
                  color: "text-primary",
                  onClick: () => setDrawerOpen(true),
                  ocid: "home.wallet.button",
                  live: false,
                },
                {
                  icon: MessageCircle,
                  label: "Chat",
                  bg: "bg-accent",
                  color: "text-primary",
                  onClick: () => navigate({ name: "chat" }),
                  ocid: "home.chat.button",
                  live: false,
                },
              ].map(({ icon: Icon, label, bg, color, onClick, ocid, live }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className="flex flex-col items-center gap-2"
                  data-ocid={ocid}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center shadow-sm relative`}
                  >
                    <Icon size={26} className={color} />
                    {live && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Radio size={10} className="text-white" />
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Streamers */}
          <div className="bg-white py-4 mb-3">
            <div className="flex items-center justify-between px-4 mb-3">
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
            <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
              {isLoading
                ? [1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      className="w-20 h-24 rounded-2xl flex-none"
                    />
                  ))
                : rooms.slice(0, 8).map((room, idx) => (
                    <motion.button
                      key={room.id.toString()}
                      type="button"
                      onClick={() =>
                        navigate({ name: "live", roomId: room.id })
                      }
                      className="flex-none w-20 flex flex-col items-center gap-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      data-ocid={`home.item.${idx + 1}`}
                    >
                      <div className="relative w-20 h-20">
                        <img
                          src={
                            room.thumbnailUrl ||
                            `https://picsum.photos/seed/${room.id}/200/200`
                          }
                          alt={room.title}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          LIVE
                        </span>
                        <span className="absolute bottom-1 left-0 right-0 flex items-center justify-center">
                          <span className="bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                            {Number(room.viewerCount).toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-center leading-tight truncate w-full">
                        {room.hostName}
                      </p>
                    </motion.button>
                  ))}
            </div>
          </div>

          {/* Feature grid */}
          <div className="bg-white px-4 py-4 mb-3">
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="bg-gray-50 border border-border rounded-2xl p-3.5 flex flex-col items-center gap-2"
                data-ocid="home.islamic.button"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🕌</span>
                </div>
                <span className="text-xs text-foreground text-center font-semibold leading-tight">
                  ইসলামিক ফ্লোর
                </span>
              </button>
              <button
                type="button"
                className="rounded-2xl p-3.5 flex flex-col items-start gap-1 shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                }}
                data-ocid="home.jobs.button"
              >
                <div className="flex gap-1">
                  <Heart size={12} className="text-white" />
                  <Users size={12} className="text-white" />
                </div>
                <span className="text-[10px] text-green-100">Community</span>
                <span className="font-bold text-white text-lg leading-tight">
                  Jobs
                </span>
              </button>
              <button
                type="button"
                className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 flex flex-col items-center gap-2"
                data-ocid="home.doctors.button"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope size={20} className="text-blue-500" />
                </div>
                <span className="text-xs text-center font-semibold text-foreground">
                  Doctors
                </span>
              </button>
              <button
                type="button"
                className="bg-gray-50 border border-border rounded-2xl p-3.5 flex flex-col items-center gap-1"
                data-ocid="home.agent.button"
              >
                <div className="flex items-baseline">
                  <span className="text-base font-bold text-primary">ring</span>
                  <span className="text-base font-bold text-foreground">
                    agent
                  </span>
                </div>
                <Briefcase size={16} className="text-muted-foreground" />
              </button>
              <button
                type="button"
                className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3.5 flex flex-col items-center gap-1 relative"
                data-ocid="home.notice.button"
              >
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
                <span className="text-2xl">📋</span>
                <span className="text-xs font-bold text-foreground">
                  Notice
                </span>
              </button>
              <button
                type="button"
                className="bg-gray-50 border border-border rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1"
                data-ocid="home.more.button"
              >
                <MoreHorizontal size={20} className="text-primary" />
                <span className="text-xs font-bold text-primary">
                  More &gt;&gt;&gt;
                </span>
              </button>
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
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 ${post.liked ? "text-red-500" : "text-muted-foreground"} hover:bg-gray-50 transition-colors`}
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
            className="absolute bottom-6 right-4 w-14 h-14 rounded-full text-white shadow-orange flex items-center justify-center z-10"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.64 0.22 38) 0%, oklch(0.70 0.20 50) 100%)",
            }}
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
                className="flex-1"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.64 0.22 38) 0%, oklch(0.70 0.20 50) 100%)",
                }}
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

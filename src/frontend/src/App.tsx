import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import {
  ArrowLeftRight,
  Bell,
  Briefcase,
  Camera,
  Grid,
  Home,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  QrCode,
  Radio,
  Search,
  Settings,
  Stethoscope,
  TrendingUp,
  Tv,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { CreditCard, Lock, ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import { useCoinBalance } from "./hooks/useCoinBalance";
import { usePhoneAuth } from "./hooks/usePhoneAuth";
import AppsPage from "./pages/AppsPage";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import LiveRoomPage from "./pages/LiveRoomPage";
import LiveTabPage from "./pages/LiveTabPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import TVPage from "./pages/TVPage";
import WalletPage from "./pages/WalletPage";

export type AppPage =
  | { name: "home" }
  | { name: "livetab" }
  | { name: "tv" }
  | { name: "chat" }
  | { name: "apps" }
  | {
      name: "live";
      roomId: bigint;
      isHost?: boolean;
      liveType?: "audio" | "video";
    }
  | { name: "profile" }
  | { name: "wallet" };

const MAIN_TABS = [
  { name: "home" as const, label: "Home", icon: Home },
  { name: "livetab" as const, label: "Live", icon: Radio },
  { name: "tv" as const, label: "TV", icon: Tv },
  { name: "chat" as const, label: "Chat", icon: MessageCircle },
  { name: "apps" as const, label: "Apps", icon: Grid },
];

export default function App() {
  const { session, isLoading, logout } = usePhoneAuth();
  const { coins, goldCoins } = useCoinBalance();
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState<AppPage>({ name: "home" });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const userId = session
    ? Math.abs(
        (session.phone.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
          9000000) +
          1000000,
      ).toString()
    : "2415 5412";
  const userName = session?.name ?? "User";
  const userInitial = userName[0]?.toUpperCase() ?? "U";

  const isMainPage = ["home", "livetab", "tv", "chat", "apps"].includes(
    page.name,
  );
  const activeTab = isMainPage
    ? (page.name as "home" | "livetab" | "tv" | "chat" | "apps")
    : "home";

  if (showSplash) {
    return (
      <AnimatePresence>
        <SplashScreen onDone={() => setShowSplash(false)} />
      </AnimatePresence>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="relative w-full max-w-[480px] min-h-screen bg-background overflow-hidden shadow-xl flex flex-col">
        {/* SIDE DRAWER */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/50"
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
                      <p className="text-white font-bold text-base">
                        {userName}
                      </p>
                      <p className="text-white/80 text-sm mt-0.5">
                        ID: #{userId}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                          🪙 {coins.toLocaleString()}
                        </span>
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                          🥇 {goldCoins.toLocaleString()}
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
                          action: () => {
                            setPage({ name: "wallet" });
                            setDrawerOpen(false);
                          },
                        },
                        {
                          icon: ArrowLeftRight,
                          label: "Transfer",
                          ocid: "home.drawer.transfer.button",
                          action: undefined,
                        },
                        {
                          icon: CreditCard,
                          label: "Cash Out",
                          ocid: "home.drawer.cashout.button",
                          action: undefined,
                        },
                      ].map(({ icon: Icon, label, ocid, action }) => (
                        <button
                          key={label}
                          type="button"
                          className="flex flex-col items-center gap-1.5 py-4 hover:bg-accent transition-colors"
                          data-ocid={ocid}
                          onClick={action}
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
                        setPage({ name: "profile" });
                      }}
                      className="w-full text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-bold text-sm shadow-orange transition-opacity hover:opacity-90 orange-gradient"
                      data-ocid="home.drawer.mypage.button"
                    >
                      <Lock size={16} />
                      My Page
                    </button>
                  </div>
                  {/* Menu items */}
                  <div className="mx-3 mt-3 bg-white rounded-2xl shadow-card overflow-hidden mb-4">
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

                  {/* Logout button */}
                  <div className="mx-3 mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setDrawerOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-xl py-3.5 font-bold text-sm hover:bg-red-100 transition-colors border border-red-200"
                      data-ocid="home.drawer.logout.button"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* SHARED HEADER (only for main pages, not live room or profile) */}
        {isMainPage && (
          <header className="bg-white flex-none shadow-sm z-10 relative">
            {/* Search overlay */}
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
                    <button type="button" onClick={() => setNotifOpen(false)}>
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
                      <p className="text-sm text-muted-foreground">
                        ID: #{userId}
                      </p>
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
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  onClick={() => setDrawerOpen(true)}
                  data-ocid="home.menu_button"
                >
                  <Menu size={22} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  data-ocid="home.settings.button"
                >
                  <Settings size={20} className="text-foreground" />
                </button>
              </div>

              <img
                src="/assets/generated/rid2-logo.dim_400x400.png"
                alt="RingID"
                className="h-8 object-contain"
              />

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
              </div>
            </div>

            {/* TOP TAB BAR */}
            <div className="flex border-b border-gray-100">
              {MAIN_TABS.map(({ name, label, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setPage({ name } as AppPage)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 relative transition-colors ${
                    activeTab === name
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  data-ocid={`nav.${name}.tab`}
                >
                  <Icon size={18} />
                  <span className="text-[10px] font-semibold">{label}</span>
                  {activeTab === name && (
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-primary rounded-full"
                      layoutId="tab-indicator"
                    />
                  )}
                </button>
              ))}
            </div>
          </header>
        )}

        {/* PAGE CONTENT */}
        <div className="flex-1 min-h-0 relative">
          {page.name === "home" && (
            <HomePage
              navigate={setPage}
              openDrawer={() => setDrawerOpen(true)}
              openQr={() => setQrOpen(true)}
              userId={userId}
              userName={userName}
              userInitial={userInitial}
            />
          )}
          {page.name === "livetab" && <LiveTabPage navigate={setPage} />}
          {page.name === "tv" && <TVPage navigate={setPage} />}
          {page.name === "chat" && <ChatPage navigate={setPage} />}
          {page.name === "apps" && <AppsPage navigate={setPage} />}
          {page.name === "live" && (
            <LiveRoomPage
              roomId={page.roomId}
              isHost={page.isHost ?? false}
              liveType={page.liveType ?? "video"}
              navigate={setPage}
            />
          )}
          {page.name === "profile" && <ProfilePage navigate={setPage} />}
          {page.name === "wallet" && <WalletPage navigate={setPage} />}
        </div>

        <Toaster />
      </div>
    </div>
  );
}

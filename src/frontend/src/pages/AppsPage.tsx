import {
  BarChart2,
  ChevronRight,
  Lock,
  MapPin,
  Search,
  ShoppingCart,
  UserPlus,
  Wallet,
} from "lucide-react";
import type { AppPage } from "../App";
import BottomNav from "../components/BottomNav";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

function getUserId(principal: string): string {
  if (!principal) return "1234567";
  const num = Math.abs(
    (principal.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 9000000) +
      1000000,
  );
  return num.toString();
}

const menuItems = [
  {
    id: 1,
    label: "refer & EARN",
    sublabel: "Invite friends and earn rewards",
    icon: UserPlus,
    iconBg: "bg-orange-100",
    iconColor: "text-[#FF6B00]",
  },
  {
    id: 2,
    label: "ring AGENT",
    sublabel: "Become a RingID agent",
    icon: MapPin,
    iconBg: "bg-orange-100",
    iconColor: "text-[#FF6B00]",
  },
  {
    id: 3,
    label: "প্রবাসী AGENT",
    sublabel: "Expatriate agent program",
    icon: MapPin,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 4,
    label: "Investment",
    sublabel: "Grow your money with RingID",
    icon: BarChart2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
];

export default function AppsPage({
  navigate,
}: { navigate: (p: AppPage) => void }) {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? "";
  const userId = getUserId(principal);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Orange header */}
      <div className="bg-[#FF6B00] px-4 pt-10 pb-8 rounded-b-3xl relative">
        {/* Top right icons */}
        <div className="absolute top-10 right-4 flex gap-3">
          <button
            type="button"
            className="text-white"
            data-ocid="apps.search.button"
          >
            <Search size={24} />
          </button>
          <button
            type="button"
            className="text-white"
            data-ocid="apps.profile.button"
          >
            <UserPlus size={24} />
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-20 h-20 rounded-full bg-orange-300 border-4 border-white flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">U</span>
          </div>
          <div>
            <p className="text-white/80 text-sm">ID: #{userId}</p>
            <p className="text-white text-xl font-bold">My Account</p>
            {/* Gold coins */}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-base">🪙</span>
              <span className="text-white/90 text-sm font-medium">
                25,000 Gold
              </span>
            </div>
          </div>
        </div>

        {/* Wallet card */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={20} className="text-[#FF6B00]" />
            <span className="font-bold text-gray-800 text-base">Wallet</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Buy", icon: ShoppingCart },
              { label: "Transfer", icon: ChevronRight },
              { label: "Cash Out", icon: Wallet },
            ].map(({ label, icon: Icon }, i) => (
              <button
                key={label}
                type="button"
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 active:bg-gray-100"
                data-ocid={`apps.wallet.button.${i + 1}`}
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Icon size={20} className="text-[#FF6B00]" />
                </div>
                <span className="text-xs text-gray-700 font-medium">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* My Page button */}
      <div className="px-4 mt-4">
        <button
          type="button"
          className="w-full bg-[#FF6B00] text-white rounded-full py-3.5 flex items-center justify-center gap-2 font-semibold text-base shadow"
          data-ocid="apps.my_page.button"
        >
          <Lock size={18} />
          My Page
        </button>
      </div>

      {/* Menu list */}
      <div className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
        {menuItems.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`w-full flex items-center px-4 py-4 ${
              i < menuItems.length - 1 ? "border-b border-gray-100" : ""
            } active:bg-gray-50`}
            data-ocid={`apps.item.${i + 1}`}
          >
            <div
              className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center mr-3`}
            >
              <item.icon size={20} className={item.iconColor} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-800 text-base">
                {item.label}
              </p>
              <p className="text-xs text-gray-400">{item.sublabel}</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        ))}
      </div>

      <div className="flex-1" />
      <BottomNav navigate={navigate} active="apps" />
    </div>
  );
}

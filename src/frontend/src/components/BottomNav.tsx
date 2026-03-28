import { Grid3X3, Home, MessageCircle, Radio, Tv, Video } from "lucide-react";
import type { AppPage } from "../App";

const tabs = [
  { id: "home", label: "Home", icon: Home, page: { name: "home" } as AppPage },
  {
    id: "video",
    label: "Video",
    icon: Video,
    page: { name: "home" } as AppPage,
  },
  { id: "live", label: "Live", icon: Radio, page: { name: "home" } as AppPage },
  {
    id: "chat",
    label: "Chat",
    icon: MessageCircle,
    page: { name: "chat" } as AppPage,
  },
  { id: "tv", label: "TV", icon: Tv, page: { name: "tv" } as AppPage },
  {
    id: "apps",
    label: "Apps",
    icon: Grid3X3,
    page: { name: "apps" } as AppPage,
  },
];

export default function BottomNav({
  navigate,
  active,
}: { navigate: (p: AppPage) => void; active: string }) {
  return (
    <nav
      className="absolute bottom-0 left-0 right-0 bg-background border-t border-border flex h-20 z-20"
      data-ocid="nav.tab"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => navigate(tab.page)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
            data-ocid={`nav.${tab.id}.link`}
          >
            <tab.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className={`text-[10px] ${isActive ? "font-semibold" : ""}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

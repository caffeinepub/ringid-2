import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AppsPage from "./pages/AppsPage";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import LiveRoomPage from "./pages/LiveRoomPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import TVPage from "./pages/TVPage";

export type AppPage =
  | { name: "home" }
  | {
      name: "live";
      roomId: bigint;
      isHost?: boolean;
      liveType?: "audio" | "video";
    }
  | { name: "profile" }
  | { name: "chat" }
  | { name: "apps" }
  | { name: "tv" };

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [page, setPage] = useState<AppPage>({ name: "home" });

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!identity) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="relative w-full max-w-[480px] min-h-screen bg-background overflow-hidden shadow-xl">
        {page.name === "home" && <HomePage navigate={setPage} />}
        {page.name === "live" && (
          <LiveRoomPage
            roomId={page.roomId}
            isHost={page.isHost ?? false}
            liveType={page.liveType ?? "video"}
            navigate={setPage}
          />
        )}
        {page.name === "profile" && <ProfilePage navigate={setPage} />}
        {page.name === "chat" && <ChatPage navigate={setPage} />}
        {page.name === "apps" && <AppsPage navigate={setPage} />}
        {page.name === "tv" && <TVPage navigate={setPage} />}
      </div>
      <Toaster />
    </div>
  );
}

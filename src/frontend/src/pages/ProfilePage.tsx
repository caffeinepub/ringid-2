import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Camera, Edit2, Mic, Radio } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import BottomNav from "../components/BottomNav";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateRoom,
  useGetCallerProfile,
  useUpdateProfile,
} from "../hooks/useQueries";

function getUserId(principal: string): string {
  if (!principal) return "1234567";
  const num = Math.abs(
    (principal.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 9000000) +
      1000000,
  );
  return num.toString();
}

export default function ProfilePage({
  navigate,
}: { navigate: (page: AppPage) => void }) {
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerProfile();
  const updateProfile = useUpdateProfile();
  const createRoom = useCreateRoom();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live flow state
  const [liveTypeOpen, setLiveTypeOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLiveType, setSelectedLiveType] = useState<"audio" | "video">(
    "video",
  );
  const [newTitle, setNewTitle] = useState("");

  const principal = identity?.getPrincipal().toString() ?? "";
  const shortId = principal.slice(0, 8);
  const userId = getUserId(principal);
  const currentName = profile?.displayName || `User ${shortId}`;
  const savedAvatarUrl =
    profile?.avatarUrl &&
    profile.avatarUrl !==
      `https://api.dicebear.com/9.x/thumbs/svg?seed=${shortId}`
      ? profile.avatarUrl
      : null;
  const defaultAvatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${shortId}`;
  const avatarUrl = avatarPreview ?? savedAvatarUrl ?? defaultAvatarUrl;

  const startEditing = () => {
    setDisplayName(currentName);
    setEditing(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setAvatarPreview(result);
        updateProfile
          .mutateAsync({
            displayName: currentName,
            avatarUrl: result,
          })
          .then(() => {
            toast.success("Profile picture updated!");
          })
          .catch(() => {
            toast.error("Failed to update picture");
          });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!displayName.trim()) return;
    try {
      await updateProfile.mutateAsync({
        displayName,
        avatarUrl: avatarPreview ?? savedAvatarUrl ?? defaultAvatarUrl,
      });
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleSelectLiveType = (type: "audio" | "video") => {
    setSelectedLiveType(type);
    setLiveTypeOpen(false);
    setDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    let newRoomId: bigint = BigInt(Date.now());
    try {
      newRoomId = await createRoom.mutateAsync({
        title: newTitle,
        hostName: currentName,
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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-[#FF6B00] text-white flex items-center px-3 h-16 flex-none">
        <button
          type="button"
          onClick={() => navigate({ name: "home" })}
          className="p-2 rounded-full hover:bg-white/10"
          data-ocid="profile.close_button"
        >
          <ArrowLeft size={22} />
        </button>
        <span className="font-bold text-lg absolute left-1/2 -translate-x-1/2">
          My Profile
        </span>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profile hero */}
        <div className="bg-[#FF6B00] h-32 relative" />
        <div className="px-4 -mt-12 mb-4 flex flex-col items-center">
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative block"
              data-ocid="profile.upload_button"
            >
              <Avatar className="w-28 h-28 border-4 border-background shadow-lg">
                {avatarUrl.startsWith("data:") ||
                avatarUrl.startsWith("http") ? (
                  <AvatarImage src={avatarUrl} className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-[#FF6B00] text-white text-3xl">
                  {currentName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-9 h-9 bg-[#FF6B00] rounded-full flex items-center justify-center border-2 border-background">
                <Camera size={16} className="text-white" />
              </div>
            </button>
          </div>

          <motion.div
            className="mt-3 text-center w-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {editing ? (
              <div className="flex gap-2 items-center mt-1 justify-center">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-center h-10 max-w-[200px]"
                  autoFocus
                  data-ocid="profile.input"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <h2 className="text-2xl font-bold">
                  {isLoading ? "Loading..." : currentName}
                </h2>
                <button
                  type="button"
                  onClick={startEditing}
                  data-ocid="profile.edit_button"
                >
                  <Edit2 size={18} className="text-muted-foreground" />
                </button>
              </div>
            )}
            <p className="text-sm font-semibold text-[#FF6B00] mt-1">
              ID: {userId}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {principal.slice(0, 20)}...
            </p>
          </motion.div>

          {/* Gold Coins */}
          <div className="flex items-center gap-2 mt-3 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
            <span className="text-xl">🪙</span>
            <span className="text-sm font-semibold text-yellow-700">
              Gold Coins: 25,000
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-5">
            <div className="text-center">
              <p className="text-xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Streams</p>
            </div>
          </div>

          {/* Go Live from profile */}
          <button
            type="button"
            onClick={() => setLiveTypeOpen(true)}
            className="mt-4 w-full bg-[#FF6B00] text-white rounded-full py-3 flex items-center justify-center gap-2 font-semibold text-base shadow"
            data-ocid="profile.primary_button"
          >
            <Radio size={18} />
            Go Live
          </button>

          {editing && (
            <div className="flex gap-2 mt-4 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditing(false)}
                data-ocid="profile.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#FF6B00] hover:bg-orange-600 text-white"
                onClick={handleSave}
                disabled={updateProfile.isPending}
                data-ocid="profile.save_button"
              >
                {updateProfile.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="px-4 mt-4">
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => clear()}
            data-ocid="profile.delete_button"
          >
            Sign Out
          </Button>
        </div>

        {/* Footer */}
        <footer className="mt-8 pb-4 text-center text-sm text-muted-foreground">
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

      {/* Live Type Selection Dialog */}
      <Dialog open={liveTypeOpen} onOpenChange={setLiveTypeOpen}>
        <DialogContent
          className="max-w-[380px] rounded-2xl"
          data-ocid="profile.livetype.dialog"
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
              data-ocid="profile.audio_live.button"
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
              data-ocid="profile.video_live.button"
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

      {/* Go Live Title Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-[380px] rounded-2xl"
          data-ocid="profile.dialog"
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
              data-ocid="profile.input"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDialogOpen(false)}
                data-ocid="profile.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleCreate}
                disabled={createRoom.isPending || !newTitle.trim()}
                data-ocid="profile.submit_button"
              >
                {createRoom.isPending ? "Creating..." : "Start Live"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav navigate={navigate} active="profile" />
    </div>
  );
}

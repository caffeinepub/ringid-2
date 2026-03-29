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
import { useCoinBalance } from "../hooks/useCoinBalance";
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
  const { coins, goldCoins } = useCoinBalance();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setAvatarPreview(result);
        updateProfile
          .mutateAsync({ displayName: currentName, avatarUrl: result })
          .then(() => toast.success("Profile picture updated!"))
          .catch(() => toast.error("Failed to update picture"));
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

  const SAMPLE_POSTS = [
    { id: 1, img: "https://picsum.photos/seed/p1/200/200" },
    { id: 2, img: "https://picsum.photos/seed/p2/200/200" },
    { id: 3, img: "https://picsum.photos/seed/p3/200/200" },
    { id: 4, img: "https://picsum.photos/seed/p4/200/200" },
    { id: 5, img: "https://picsum.photos/seed/p5/200/200" },
    { id: 6, img: "https://picsum.photos/seed/p6/200/200" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="orange-gradient text-white flex items-center px-5 h-16 flex-none">
        <button
          type="button"
          onClick={() => navigate({ name: "home" })}
          className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-3"
          data-ocid="profile.close_button"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold text-xl flex-1 text-center mr-9">
          My Profile
        </span>
      </header>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Orange banner */}
        <div className="orange-gradient h-28 relative" />

        {/* Avatar & info */}
        <div className="px-5 -mt-14 flex flex-col items-center">
          <div className="relative mb-3">
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
              data-ocid="profile.upload_button"
            >
              <Avatar className="w-28 h-28 border-4 border-white shadow-card">
                {avatarUrl.startsWith("data:") ||
                avatarUrl.startsWith("http") ? (
                  <AvatarImage src={avatarUrl} className="object-cover" />
                ) : null}
                <AvatarFallback
                  className="text-white text-3xl font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.64 0.22 38) 0%, oklch(0.70 0.20 50) 100%)",
                  }}
                >
                  {currentName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 w-11 h-11 rounded-full bg-primary flex items-center justify-center border-2 border-white">
                <Camera size={18} className="text-white" />
              </div>
            </button>
          </div>

          {editing ? (
            <div className="flex gap-3 items-center mb-2">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="text-center h-10 max-w-[200px]"
                autoFocus
                data-ocid="profile.input"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold">
                {isLoading ? "Loading..." : currentName}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setDisplayName(currentName);
                  setEditing(true);
                }}
                data-ocid="profile.edit_button"
              >
                <Edit2 size={20} className="text-muted-foreground" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 mb-1">
            <span className="bg-accent text-primary text-base font-bold px-4 py-1 rounded-full">
              ID: #{userId}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-3 mb-4">
            {[
              { label: "Followers", val: "0" },
              { label: "Following", val: "0" },
              { label: "Posts", val: "6" },
            ].map((s, i) => (
              <div key={s.label} className="text-center">
                {i > 0 && <div className="absolute" />}
                <p className="text-2xl font-bold">{s.val}</p>
                <p className="text-base text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Coin balances */}
          <div className="w-full grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4">
              <span className="text-3xl">🪙</span>
              <div>
                <p className="text-base text-muted-foreground">Coins</p>
                <p className="font-bold text-base">{coins.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4">
              <span className="text-3xl">🥇</span>
              <div>
                <p className="text-base text-muted-foreground">Gold Coins</p>
                <p className="font-bold text-base text-yellow-600">
                  {goldCoins.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Go Live */}
          <button
            type="button"
            onClick={() => setLiveTypeOpen(true)}
            className="w-full text-white rounded-2xl py-5.5 flex items-center justify-center gap-3 font-bold text-lg shadow-orange mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.64 0.22 38) 0%, oklch(0.70 0.20 50) 100%)",
            }}
            data-ocid="profile.primary_button"
          >
            <Radio size={22} />
            Go Live
          </button>

          {editing && (
            <div className="flex gap-3 w-full mb-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditing(false)}
                data-ocid="profile.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.64 0.22 38) 0%, oklch(0.70 0.20 50) 100%)",
                }}
                onClick={handleSave}
                disabled={updateProfile.isPending}
                data-ocid="profile.save_button"
              >
                {updateProfile.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        {/* Posts grid */}
        <div className="px-5 mb-4">
          <h3 className="font-bold text-base mb-3 text-foreground">Posts</h3>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_POSTS.map((post, i) => (
              <motion.div
                key={post.id}
                className="aspect-square rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`profile.item.${i + 1}`}
              >
                <img
                  src={post.img}
                  alt="post"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div className="px-5 mb-4">
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => clear()}
            data-ocid="profile.delete_button"
          >
            Sign Out
          </Button>
        </div>

        <footer className="py-4 text-center text-base text-muted-foreground">
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

      {/* Live Type Dialog */}
      <Dialog open={liveTypeOpen} onOpenChange={setLiveTypeOpen}>
        <DialogContent
          className="max-w-[380px] rounded-2xl"
          data-ocid="profile.livetype.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-primary">
              Choose Live Type
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4 pb-2">
            <button
              type="button"
              onClick={() => handleSelectLiveType("audio")}
              className="flex flex-col items-center gap-4 bg-accent border-2 border-primary/20 rounded-2xl py-8 px-5 hover:border-primary transition-colors"
              data-ocid="profile.audio_live.button"
            >
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-orange">
                <Mic size={38} className="text-white" />
              </div>
              <span className="text-primary font-bold text-lg">Audio Live</span>
              <span className="text-muted-foreground text-base text-center">
                Microphone only, RingID 2 branding
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectLiveType("video")}
              className="flex flex-col items-center gap-4 bg-accent border-2 border-primary/20 rounded-2xl py-8 px-5 hover:border-primary transition-colors"
              data-ocid="profile.video_live.button"
            >
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-orange">
                <Camera size={38} className="text-white" />
              </div>
              <span className="text-primary font-bold text-lg">Video Live</span>
              <span className="text-muted-foreground text-base text-center">
                Camera + microphone stream
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Go Live title dialog */}
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
              placeholder="Stream title (e.g. Morning Talk 🎙️)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              data-ocid="profile.input"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDialogOpen(false)}
                data-ocid="profile.cancel_button"
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
                data-ocid="profile.submit_button"
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

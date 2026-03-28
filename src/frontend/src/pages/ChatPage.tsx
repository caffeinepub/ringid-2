import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Edit,
  Lock,
  MessageCircle,
  Phone,
  Send,
  Users,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import type { AppPage } from "../App";
import BottomNav from "../components/BottomNav";

const contacts = [
  {
    id: 1,
    name: "Riri",
    message: "Hey wanna know a secret?",
    time: "2m",
    unread: 3,
    online: true,
  },
  {
    id: 2,
    name: "Farhan",
    message: "Good idea!!",
    time: "15m",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Mitu",
    message: "Love this stream!",
    time: "1h",
    unread: 1,
    online: true,
  },
  {
    id: 4,
    name: "Rubel",
    message: "Good evening",
    time: "2h",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: "Sima",
    message: "❤️ beautiful!",
    time: "3h",
    unread: 2,
    online: true,
  },
  {
    id: 6,
    name: "Jahid",
    message: "Keep it up!",
    time: "5h",
    unread: 0,
    online: false,
  },
];

const PUBLIC_CHAT_SEED = [
  { id: "p1", sender: "Farhan", text: "Hello everyone! 👋", time: "2m" },
  { id: "p2", sender: "Mitu", text: "আজকের লাইভ কেমন লাগছে?", time: "3m" },
  { id: "p3", sender: "Rubel", text: "সবাই কেমন আছেন?", time: "5m" },
  { id: "p4", sender: "Sima", text: "RingID zindabad 🎉", time: "7m" },
];

type CallState = { type: "voice" | "video"; name: string } | null;

export default function ChatPage({
  navigate,
}: { navigate: (p: AppPage) => void }) {
  const [activeTab, setActiveTab] = useState<"chat" | "secret" | "public">(
    "chat",
  );
  const [callState, setCallState] = useState<CallState>(null);
  const [publicMessages, setPublicMessages] = useState(
    PUBLIC_CHAT_SEED.map((m) => ({ ...m, isMe: false })),
  );
  const [publicInput, setPublicInput] = useState("");

  const sendPublicMessage = () => {
    if (!publicInput.trim()) return;
    setPublicMessages((prev) => [
      ...prev,
      {
        id: `u${Date.now()}`,
        sender: "You",
        text: publicInput,
        time: "now",
        isMe: true,
      },
    ]);
    setPublicInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Calling overlay */}
      {callState && (
        <div className="absolute inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#FF6B00] flex items-center justify-center mb-6 shadow-2xl">
            <span className="text-white text-4xl font-bold">
              {callState.name[0]}
            </span>
          </div>
          <p className="text-white text-2xl font-bold mb-2">{callState.name}</p>
          <p className="text-white/70 text-base mb-10">
            {callState.type === "voice"
              ? "📞 Calling..."
              : "📹 Video Calling..."}
          </p>
          <button
            type="button"
            onClick={() => setCallState(null)}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
            data-ocid="chat.cancel_button"
          >
            <Phone size={24} className="text-white rotate-[135deg]" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#FF6B00] px-4 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => navigate({ name: "home" })}
            className="text-white p-1"
            data-ocid="chat.back.button"
          >
            <ArrowLeft size={26} />
          </button>
          <h1 className="text-white text-xl font-bold flex-1">Chat</h1>
        </div>
        {/* Tabs */}
        <div className="flex bg-white/20 rounded-full p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "chat" ? "bg-white text-[#FF6B00]" : "text-white"
            }`}
            data-ocid="chat.tab"
          >
            Chat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("public")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === "public" ? "bg-white text-[#FF6B00]" : "text-white"
            }`}
            data-ocid="chat.public.tab"
          >
            <Users size={13} />
            Public
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("secret")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === "secret" ? "bg-white text-[#FF6B00]" : "text-white"
            }`}
            data-ocid="chat.secret.tab"
          >
            <Lock size={13} />
            Secret
          </button>
        </div>
      </div>

      {/* Public Chat */}
      {activeTab === "public" && (
        <div className="flex flex-col flex-1 pb-24">
          <ScrollArea
            className="flex-1 px-4 pt-3"
            style={{ height: "calc(100vh - 260px)" }}
          >
            <div className="space-y-3">
              {publicMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    msg.isMe ? "flex-row-reverse" : ""
                  }`}
                >
                  {!msg.isMe && (
                    <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {msg.sender[0]}
                      </span>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] ${
                      msg.isMe
                        ? "bg-[#FF6B00] text-white"
                        : "bg-white text-gray-800"
                    } rounded-2xl px-3 py-2 shadow-sm`}
                  >
                    {!msg.isMe && (
                      <p className="text-xs font-semibold text-[#FF6B00] mb-0.5">
                        {msg.sender}
                      </p>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-[10px] mt-0.5 ${
                        msg.isMe ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {/* Input */}
          <div className="absolute bottom-20 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 flex gap-2">
            <Input
              value={publicInput}
              onChange={(e) => setPublicInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendPublicMessage()}
              placeholder="Message everyone..."
              className="flex-1"
              data-ocid="chat.input"
            />
            <button
              type="button"
              onClick={sendPublicMessage}
              className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center flex-shrink-0"
              data-ocid="chat.submit_button"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Chat / Secret List */}
      {(activeTab === "chat" || activeTab === "secret") && (
        <div className="flex-1 bg-white pb-24">
          {contacts.map((contact, i) => (
            <div
              key={contact.id}
              className="flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-50 cursor-pointer"
              data-ocid={`chat.item.${i + 1}`}
            >
              <div className="relative mr-3">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-[#FF6B00] text-white text-lg font-bold">
                    {contact.name[0]}
                  </AvatarFallback>
                </Avatar>
                {contact.online && (
                  <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-base">
                    {contact.name}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {contact.time}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {activeTab === "secret" && (
                    <Lock size={12} className="text-[#FF6B00] flex-shrink-0" />
                  )}
                  <span className="text-sm text-gray-500 truncate">
                    {contact.message}
                  </span>
                  {activeTab === "secret" && (
                    <Badge className="ml-1 bg-[#FF6B00] text-white text-[10px] px-1 py-0 h-4">
                      Secret
                    </Badge>
                  )}
                </div>
              </div>
              {contact.unread > 0 && (
                <span className="ml-2 bg-[#FF6B00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {contact.unread}
                </span>
              )}
              {/* Voice call button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCallState({ type: "voice", name: contact.name });
                }}
                className="ml-2 w-9 h-9 rounded-full bg-[#FF6B00] flex items-center justify-center flex-shrink-0 shadow-sm"
                data-ocid={`chat.call.button.${i + 1}`}
              >
                <Phone size={15} className="text-white" />
              </button>
              {/* Video call button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCallState({ type: "video", name: contact.name });
                }}
                className="ml-1 w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm"
                data-ocid={`chat.video.button.${i + 1}`}
              >
                <Video size={15} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Compose FAB */}
      {(activeTab === "chat" || activeTab === "secret") && (
        <button
          type="button"
          className="absolute bottom-24 right-5 w-14 h-14 bg-[#FF6B00] rounded-full flex items-center justify-center shadow-lg z-10"
          data-ocid="chat.open_modal_button"
        >
          <Edit size={24} className="text-white" />
        </button>
      )}

      {/* Message icon FAB for public */}
      {activeTab === "public" && (
        <button
          type="button"
          className="absolute bottom-24 right-5 w-14 h-14 bg-[#FF6B00] rounded-full flex items-center justify-center shadow-lg z-10"
          data-ocid="chat.open_modal_button"
        >
          <MessageCircle size={24} className="text-white" />
        </button>
      )}

      <BottomNav navigate={navigate} active="chat" />
    </div>
  );
}

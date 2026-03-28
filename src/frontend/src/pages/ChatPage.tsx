import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Phone, Search, Video } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";

const CONTACTS = [
  {
    id: 1,
    name: "Priya Sharma",
    lastMsg: "Good morning! 🌞",
    time: "2m",
    unread: 2,
    color: "bg-pink-500",
  },
  {
    id: 2,
    name: "Arif Hossain",
    lastMsg: "Are you coming to the live?",
    time: "15m",
    unread: 0,
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Ruma Begum",
    lastMsg: "Loved your cooking stream 🍛",
    time: "1h",
    unread: 1,
    color: "bg-emerald-500",
  },
  {
    id: 4,
    name: "Karim Rahman",
    lastMsg: "Thanks for watching!",
    time: "3h",
    unread: 0,
    color: "bg-purple-500",
  },
  {
    id: 5,
    name: "Nadia Malik",
    lastMsg: "New guitar lesson tomorrow 🎸",
    time: "5h",
    unread: 3,
    color: "bg-orange-500",
  },
  {
    id: 6,
    name: "Tanvir Ahmed",
    lastMsg: "Yoga at 7am tomorrow",
    time: "8h",
    unread: 0,
    color: "bg-teal-500",
  },
  {
    id: 7,
    name: "Sadia Islam",
    lastMsg: "See you in the stream!",
    time: "1d",
    unread: 0,
    color: "bg-rose-500",
  },
  {
    id: 8,
    name: "Rahul Dev",
    lastMsg: "Great content today 👏",
    time: "2d",
    unread: 0,
    color: "bg-indigo-500",
  },
];

export default function ChatPage({
  navigate: _navigate,
}: { navigate: (p: AppPage) => void }) {
  const [search, setSearch] = useState("");

  const filtered = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Search bar */}
      <div className="bg-white px-3 py-2.5 border-b border-gray-100">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm outline-none"
            data-ocid="chat.search_input"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {filtered.map((contact, i) => (
            <motion.button
              key={contact.id}
              type="button"
              onClick={() => toast.info(`Opening chat with ${contact.name}`)}
              className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 text-left shadow-card hover:shadow-md transition-shadow active:scale-[0.99]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              data-ocid={`chat.item.${i + 1}`}
            >
              <div className="relative flex-none">
                <Avatar className="w-14 h-14">
                  <AvatarFallback
                    className={`${contact.color} text-white font-bold text-lg`}
                  >
                    {contact.name[0]}
                  </AvatarFallback>
                </Avatar>
                {contact.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {contact.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-sm text-foreground">
                    {contact.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {contact.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {contact.lastMsg}
                </p>
              </div>
              <div className="flex gap-1.5 flex-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info("Starting voice call...");
                  }}
                  className="w-9 h-9 rounded-full bg-accent flex items-center justify-center"
                  data-ocid={`chat.button.${i + 1}`}
                >
                  <Phone size={15} className="text-primary" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info("Starting video call...");
                  }}
                  className="w-9 h-9 rounded-full bg-accent flex items-center justify-center"
                  data-ocid={`chat.button.${i + 1}`}
                >
                  <Video size={15} className="text-primary" />
                </button>
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16" data-ocid="chat.empty_state">
              <MessageCircle
                size={48}
                className="mx-auto mb-3 text-muted-foreground opacity-30"
              />
              <p className="text-muted-foreground">No contacts found</p>
            </div>
          )}
        </div>

        <footer className="py-3 text-center text-xs text-muted-foreground border-t border-border">
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
      </ScrollArea>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col overflow-hidden">
        {/* Hero gradient */}
        <div className="orange-gradient flex-none h-72 flex flex-col items-center justify-center gap-5 relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <motion.div
            className="w-24 h-24 rounded-3xl shadow-orange overflow-hidden border-4 border-white/40"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <img
              src="/assets/generated/ringid-logo.dim_120x120.png"
              alt="RingID 2"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-4xl font-bold text-white tracking-tight">
              RingID 2
            </h1>
            <p className="text-white/80 text-base mt-1">
              Live Streaming & Community
            </p>
          </motion.div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-background flex flex-col items-center justify-center px-8 gap-6">
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sign in to watch & host live streams, chat with your community,
              and more.
            </p>
          </motion.div>

          <motion.div
            className="w-full space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-orange"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.64 0.22 38) 0%, oklch(0.70 0.20 50) 100%)",
              }}
              onClick={() => login()}
              disabled={isLoggingIn}
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? "Signing in..." : "🔐 Sign In"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Secure login powered by Internet Identity
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            className="flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            {[
              "🔴 Live Streaming",
              "💬 Chat",
              "🎁 Coin Gifts",
              "📺 TV Channels",
            ].map((feat) => (
              <span
                key={feat}
                className="text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full font-semibold"
              >
                {feat}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-muted-foreground">
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
    </div>
  );
}

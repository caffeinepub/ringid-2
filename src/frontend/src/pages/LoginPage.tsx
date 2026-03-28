import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="w-full max-w-[480px] min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="bg-primary flex-none h-60 flex flex-col items-center justify-center gap-4">
          <motion.img
            src="/assets/uploads/12941_4-77548173-logo-019d3586-2fad-7059-b460-6fe62defa3cb-1.webp"
            alt="RingID 2"
            className="w-24 h-24 rounded-2xl shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          />
          <motion.h1
            className="text-4xl font-bold text-primary-foreground tracking-tight"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            RingID 2
          </motion.h1>
          <motion.p
            className="text-primary-foreground/80 text-base"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Live Streaming & Community
          </motion.p>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-2xl font-semibold mb-2">Welcome Back!</h2>
            <p className="text-muted-foreground text-base">
              Sign in to watch and host live streams, chat with your community,
              and more.
            </p>
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <Button
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              onClick={() => login()}
              disabled={isLoggingIn}
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          </motion.div>

          <p className="text-sm text-muted-foreground text-center">
            Secure login powered by Internet Identity
          </p>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-sm text-muted-foreground">
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

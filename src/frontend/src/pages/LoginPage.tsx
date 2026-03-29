import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { usePhoneAuth } from "../hooks/usePhoneAuth";

type Mode = "login" | "register";

export default function LoginPage() {
  const { register, login, saveSession } = usePhoneAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!phone.trim()) {
      setError("ফোন নম্বর দিন");
      return;
    }
    if (!password) {
      setError("পাসওয়ার্ড দিন");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("নাম দিন");
      return;
    }

    if (mode === "register") {
      const result = register(phone.trim(), password, name.trim());
      if (!result.success) {
        setError(result.error ?? "Error");
        return;
      }
      saveSession(phone.trim(), name.trim());
    } else {
      const result = login(phone.trim(), password);
      if (!result.success) {
        setError(result.error ?? "Error");
        return;
      }
      const accounts: Record<string, { passwordHash: string; name: string }> =
        JSON.parse(localStorage.getItem("ringid_accounts") ?? "{}");
      saveSession(phone.trim(), accounts[phone.trim()]?.name ?? "User");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col overflow-hidden">
        {/* Hero gradient */}
        <div className="orange-gradient flex-none h-72 flex flex-col items-center justify-center gap-4 relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <motion.div
            className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <img
              src="/assets/generated/ringid2-logo-r2.dim_400x400.png"
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
            <h1 className="text-3xl font-bold text-white tracking-tight">
              RingID 2
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Live Streaming & Community
            </p>
          </motion.div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-background flex flex-col px-6 pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Welcome Back heading */}
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold text-foreground">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {mode === "login" ? "আপনার অ্যাকাউন্টে লগইন করুন" : "নতুন অ্যাকাউন্ট খুলুন"}
              </p>
            </div>

            {/* Mode toggle tabs */}
            <div className="flex rounded-2xl overflow-hidden border border-gray-200 mb-6">
              {(["login", "register"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`flex-1 py-3 text-base font-bold transition-colors ${
                    mode === m
                      ? "orange-gradient text-white"
                      : "bg-white text-muted-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    setMode(m);
                    setError("");
                  }}
                  data-ocid={`login.${m}.tab`}
                >
                  {m === "login" ? "লগইন" : "রেজিস্ট্রেশন"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="text"
                    placeholder="আপনার নাম"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11 h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-primary"
                    data-ocid="login.input"
                  />
                </div>
              )}

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="tel"
                  placeholder="+880xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-11 h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-primary"
                  data-ocid="login.input"
                />
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="পাসওয়ার্ড"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-12 h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-primary"
                  data-ocid="login.input"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p
                  className="text-red-500 text-sm font-medium text-center"
                  data-ocid="login.error_state"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold rounded-2xl shadow-orange orange-gradient border-0 mt-2"
                data-ocid="login.submit_button"
              >
                {mode === "login" ? "লগইন করুন" : "রেজিস্ট্রেশন করুন"}
              </Button>
            </form>
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

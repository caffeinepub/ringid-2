import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Coins, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import { useCoinBalance } from "../hooks/useCoinBalance";

const COIN_PACKAGES = [
  { price: 500, coins: 10000 },
  { price: 1000, coins: 25000 },
  { price: 2000, coins: 50000 },
  { price: 6000, coins: 100000 },
  { price: 10000, coins: 300000 },
];

const GOLD_PACKAGES = [
  { price: 1000, coins: 100 },
  { price: 2000, coins: 250 },
  { price: 3000, coins: 400 },
  { price: 5000, coins: 600 },
  { price: 8000, coins: 1100 },
  { price: 10000, coins: 1500 },
];

type PendingPurchase = {
  type: "coin" | "gold";
  price: number;
  amount: number;
};

export default function WalletPage({
  navigate,
}: { navigate: (page: AppPage) => void }) {
  const { coins, goldCoins, addCoins, addGoldCoins } = useCoinBalance();
  const [pending, setPending] = useState<PendingPurchase | null>(null);

  const handleBuy = (type: "coin" | "gold", price: number, amount: number) => {
    setPending({ type, price, amount });
  };

  const handleConfirm = () => {
    if (!pending) return;
    if (pending.type === "coin") {
      addCoins(pending.amount);
      toast.success(
        `সফল! ${pending.amount.toLocaleString()} কয়েন যোগ হয়েছে 🪙`,
      );
    } else {
      addGoldCoins(pending.amount);
      toast.success(
        `সফল! ${pending.amount.toLocaleString()} গোল্ড কয়েন যোগ হয়েছে 🥇`,
      );
    }
    setPending(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="flex-none text-white px-4 pt-12 pb-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.22 38) 0%, oklch(0.68 0.20 48) 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate({ name: "home" })}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            data-ocid="wallet.close_button"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xl font-bold flex-1">Wallet</span>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            className="bg-white/20 backdrop-blur rounded-2xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🪙</span>
              <span className="text-white/80 text-xs font-medium">Coins</span>
            </div>
            <p className="text-white text-2xl font-bold">
              {coins.toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            className="bg-white/20 backdrop-blur rounded-2xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🥇</span>
              <span className="text-white/80 text-xs font-medium">
                Gold Coins
              </span>
            </div>
            <p className="text-white text-2xl font-bold">
              {goldCoins.toLocaleString()}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex-1 px-4 pt-4 pb-6">
        <Tabs defaultValue="coin" data-ocid="wallet.tab">
          <TabsList className="w-full mb-4 h-12 bg-white shadow-sm rounded-xl">
            <TabsTrigger
              value="coin"
              className="flex-1 flex items-center gap-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              data-ocid="wallet.coin.tab"
            >
              <Coins size={16} />
              কয়েন রিচার্জ
            </TabsTrigger>
            <TabsTrigger
              value="gold"
              className="flex-1 flex items-center gap-2 text-sm font-bold data-[state=active]:bg-yellow-500 data-[state=active]:text-white rounded-lg"
              data-ocid="wallet.gold.tab"
            >
              <Star size={16} />
              গোল্ড কয়েন
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coin" className="space-y-3">
            {COIN_PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.price}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`wallet.coin.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.95 0.10 48) 0%, oklch(0.90 0.14 42) 100%)",
                    }}
                  >
                    🪙
                  </div>
                  <div>
                    <p className="font-bold text-base">
                      {pkg.coins.toLocaleString()}{" "}
                      <span className="text-muted-foreground font-normal text-sm">
                        Coins
                      </span>
                    </p>
                    <p className="text-primary font-bold text-sm">
                      ৳{pkg.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="rounded-xl px-5 font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.64 0.22 38) 0%, oklch(0.70 0.20 50) 100%)",
                  }}
                  onClick={() => handleBuy("coin", pkg.price, pkg.coins)}
                  data-ocid={`wallet.coin.buy.button.${i + 1}`}
                >
                  Buy
                </Button>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="gold" className="space-y-3">
            {GOLD_PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.price}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`wallet.gold.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl">
                    🥇
                  </div>
                  <div>
                    <p className="font-bold text-base">
                      {pkg.coins.toLocaleString()}{" "}
                      <span className="text-muted-foreground font-normal text-sm">
                        Gold Coins
                      </span>
                    </p>
                    <p className="text-yellow-600 font-bold text-sm">
                      ৳{pkg.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="rounded-xl px-5 font-bold text-white bg-yellow-500 hover:bg-yellow-600"
                  onClick={() => handleBuy("gold", pkg.price, pkg.coins)}
                  data-ocid={`wallet.gold.buy.button.${i + 1}`}
                >
                  Buy
                </Button>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent
          className="max-w-[340px] rounded-2xl"
          data-ocid="wallet.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-base font-bold">
              ক্রয় নিশ্চিত করুন
            </DialogTitle>
          </DialogHeader>
          {pending && (
            <p className="text-center text-sm text-muted-foreground py-2">
              ৳{pending.price.toLocaleString()} এর বিনিময়ে{" "}
              <span className="font-bold text-foreground">
                {pending.amount.toLocaleString()}{" "}
                {pending.type === "coin" ? "কয়েন" : "গোল্ড কয়েন"}
              </span>{" "}
              কিনবেন?
            </p>
          )}
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setPending(null)}
              data-ocid="wallet.cancel_button"
            >
              বাতিল
            </Button>
            <Button
              className="flex-1 text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.64 0.22 38) 0%, oklch(0.70 0.20 50) 100%)",
              }}
              onClick={handleConfirm}
              data-ocid="wallet.confirm_button"
            >
              নিশ্চিত করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

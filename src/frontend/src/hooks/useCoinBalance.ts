import { useState } from "react";

const STORAGE_KEY = "ringid_balance";

function loadBalance(): { coins: number; goldCoins: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { coins: 0, goldCoins: 0 };
}

function saveBalance(coins: number, goldCoins: number) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ coins, goldCoins }));
}

export function useCoinBalance() {
  const [balance, setBalance] = useState(loadBalance);

  const addCoins = (amount: number) => {
    setBalance((prev) => {
      const next = { ...prev, coins: prev.coins + amount };
      saveBalance(next.coins, next.goldCoins);
      return next;
    });
  };

  const addGoldCoins = (amount: number) => {
    setBalance((prev) => {
      const next = { ...prev, goldCoins: prev.goldCoins + amount };
      saveBalance(next.coins, next.goldCoins);
      return next;
    });
  };

  return {
    coins: balance.coins,
    goldCoins: balance.goldCoins,
    addCoins,
    addGoldCoins,
  };
}

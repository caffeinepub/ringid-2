// BottomNav is kept for backward compatibility but renders nothing
// Navigation is done via the hamburger drawer
import type { AppPage } from "../App";

export default function BottomNav(_props: {
  navigate: (p: AppPage) => void;
  active: string;
}) {
  return null;
}

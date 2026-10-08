import { User } from "@/types/user";
import { Video, Menu } from "lucide-react";

export default function MobileNav({ user }: { user: User | null }) {
  return (
    <header className="md:hidden h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2 text-primary font-bold text-lg">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white">
          <Video className="w-4 h-4" />
        </div>
        ZoomClone
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-medium uppercase text-sm">
          {user?.name?.charAt(0) || "U"}
        </div>
        <button className="text-[var(--color-text-secondary)]">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}

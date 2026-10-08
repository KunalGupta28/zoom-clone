"use client";

import { User } from "@/types/user";
import { Video } from "lucide-react";
import Link from "next/link";

export default function Navbar({ user }: { user: User | null }) {
  return (
    <nav className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-4 md:px-8">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[var(--color-zoom-primary)]">
        <Video className="w-6 h-6" />
        Zoom Clone
      </Link>
      
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{user.name}</span>
            <div className="w-8 h-8 rounded-full bg-[var(--color-zoom-primary)] text-white flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        ) : (
          <div className="text-sm">Guest</div>
        )}
      </div>
    </nav>
  );
}

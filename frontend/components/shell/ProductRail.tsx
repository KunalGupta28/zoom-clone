"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Video, Users, Settings } from "lucide-react";

export default function ProductRail() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Meetings", href: "/meetings", icon: Video },
    { name: "Contacts", href: "/contacts", icon: Users },
  ];

  return (
    <nav className="hidden md:flex flex-col w-[80px] shrink-0 bg-white border-r border-[var(--color-border)] h-[calc(100vh-68px)] sticky top-[68px]">
      <div className="py-4 flex flex-col gap-2 items-center">
        {links.map((link) => {
          // Home route exact match, others prefix match
          const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center w-[64px] h-[64px] rounded-xl transition-colors group ${
                isActive 
                  ? "text-[#0B5CFF] bg-blue-50/50 outline outline-1 outline-[#0B5CFF]" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <link.icon className={`w-5 h-5 mb-1 ${isActive ? "fill-current opacity-20" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="py-4 flex flex-col items-center border-t border-[var(--color-border)]">
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center w-[64px] h-[64px] rounded-xl transition-colors group ${
            pathname.startsWith("/settings") 
              ? "text-[#0B5CFF] bg-blue-50/50 outline outline-1 outline-[#0B5CFF]" 
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Settings className={`w-5 h-5 mb-1 ${pathname.startsWith("/settings") ? "fill-current opacity-20" : ""}`} strokeWidth={pathname.startsWith("/settings") ? 2.5 : 2} />
          <span className={`text-[10px] ${pathname.startsWith("/settings") ? "font-semibold" : "font-medium"}`}>
            Settings
          </span>
        </Link>
      </div>
    </nav>
  );
}

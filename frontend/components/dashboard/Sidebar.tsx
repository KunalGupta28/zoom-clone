import Link from "next/link";
import { User } from "@/types/user";
import { Video, Home, Calendar, Users, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Meetings", href: "/meetings", icon: Video },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[240px] h-screen bg-white border-r border-[var(--color-border)] sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white">
            <Video className="w-5 h-5" />
          </div>
          ZoomClone
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                isActive
                  ? "bg-[var(--color-dashboard-bg)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-dashboard-bg)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold uppercase shrink-0">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {user?.name || "Guest"}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] truncate">
              {user?.email || "guest@example.com"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

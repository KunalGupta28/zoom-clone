import { Bell, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { User } from "@/types/user";
import { useUserStore } from "@/stores/user-store";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AppHeader({ user }: { user: User | null }) {
  const { logout } = useUserStore();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="h-[68px] bg-white border-b border-[var(--color-border)] flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-50">
      {/* Left section: Logo & Nav */}
      <div className="flex items-center gap-6 h-full">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <span className="text-[#0B5CFF] font-bold text-4xl tracking-tighter pt-1 pb-1">zoom</span>
        </Link>
      </div>

      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-4 lg:gap-5 relative">
        <button className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          Admin Center
        </button>

        <button className="relative text-gray-500 hover:text-gray-700 transition-colors p-1">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {!user ? (
           <div className="flex items-center gap-2">
             <button 
               onClick={() => router.push("/login")}
               className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors cursor-pointer"
             >
               Log in
             </button>
             <button 
               onClick={() => router.push("/signup")}
               className="bg-[#0B5CFF] hover:bg-[#0043C9] text-white text-sm font-semibold py-2 px-4 rounded-full transition-colors cursor-pointer shadow-sm"
             >
               Sign Up Free
             </button>
           </div>
        ) : (
          <div className="relative">
            <div 
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0B5CFF] to-blue-400 flex items-center justify-center text-white text-sm font-semibold uppercase cursor-pointer ring-2 ring-transparent hover:ring-blue-200 transition-all shadow-sm"
            >
              {user?.name?.charAt(0) || "U"}
            </div>
            
            {profileOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold uppercase">
                     {user.name.charAt(0)}
                   </div>
                   <div className="overflow-hidden">
                     <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                     <p className="text-xs text-gray-500 truncate">{user.email}</p>
                   </div>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                    <UserIcon className="w-4 h-4" /> Profile
                  </button>
                </div>
                <div className="h-px bg-gray-50 my-1"></div>
                <div className="py-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/search", label: "아파트", icon: "🏢" },
  { href: "/subscriptions", label: "분양·청약", icon: "📅" },
  { href: "/redevelopment", label: "재개발", icon: "🔨" },
  { href: "/community", label: "커뮤니티", icon: "💬" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe transition-all"
      aria-label="모바일 하단 네비게이션"
    >
      <div className="flex items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 touch-manipulation relative ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              }`}
            >
              <div className="relative">
                <span className={`text-xl leading-none transition-transform ${isActive ? "scale-110" : ""}`}>
                  {item.icon}
                </span>
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight whitespace-nowrap shrink-0 ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

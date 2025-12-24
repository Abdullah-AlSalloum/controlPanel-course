"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "لوحة التحكم" },
  { href: "/courses", label: "الدورات" },
  { href: "/videos", label: "الفيديوهات" },
  { href: "/quizzes", label: "الاختبارات" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed top-0 right-0 h-full w-56 bg-zinc-900 text-white flex flex-col p-4 z-40" style={{ minHeight: '100vh' }}>
      <h2 className="text-xl font-bold mb-8 text-right">لوحة الإدارة</h2>
      <nav className="flex flex-col gap-4 text-right">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded transition-colors ${
              pathname === item.href ? "bg-zinc-700" : "hover:bg-zinc-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

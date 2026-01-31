
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBookOpen, FiVideo, FiEdit3, FiMenu } from "react-icons/fi";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";

import { FiUser } from "react-icons/fi";

const navItems = [
  { href: "/", label: "لوحة التحكم", icon: <FiHome size={20} /> },
  { href: "/courses", label: "الدورات", icon: <FiBookOpen size={20} /> },
  { href: "/profile", label: "الملف الشخصي", icon: <FiUser size={20} /> },
  // Removed global videos and quizzes links
];

function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 bg-slate-800 text-white p-2 rounded focus:outline-none shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-label="فتح القائمة الجانبية"
      >
        <FiMenu size={24} />
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-60 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex flex-col p-6 z-40 shadow-lg rounded-l-2xl transition-transform duration-200 md:translate-x-0 ${open ? "translate-x-0" : "translate-x-full"} md:block`}
        style={{ minHeight: '100vh' }}
      >
        <h2 className="text-2xl font-bold mb-10 text-right tracking-tight">لوحة الإدارة</h2>
        <div className="flex flex-col flex-1 h-full">
          <nav className="flex flex-col gap-3 text-right flex-grow">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-150 text-lg ${
                  pathname === item.href
                    ? "bg-teal-600 text-white shadow-md"
                    : "hover:bg-slate-700 hover:text-teal-300"
                }`}
                style={{ direction: 'rtl' }}
                onClick={() => setOpen(false)}
              >
                <span className="ml-2">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-8 mb-20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-150 text-lg bg-red-600 hover:bg-red-700 text-white w-full"
              style={{ direction: 'rtl', textAlign: 'right' }}
            >
              <span className="ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </span>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;

"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
      if (!user && pathname !== "/login" && pathname !== "/register") {
        router.replace("/login");
      }
      if (user && (pathname === "/login" || pathname === "/register")) {
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center text-2xl font-bold text-blue-700">جاري التحقق من تسجيل الدخول...</div>;
  }

  // Only render children if authenticated or on login/register page
  if (isAuthenticated || pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }
  // Otherwise, nothing (redirect will happen)
  return null;
}

"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6"
        dir="rtl"
        style={{ fontFamily: 'Cairo, Noto Sans Arabic, sans-serif' }}
      >
        <h1 className="text-2xl font-extrabold mb-4 text-blue-700 dark:text-blue-300 text-center">تسجيل الدخول</h1>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-700 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-700 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
        {error && <div className="text-red-600 font-bold text-right mt-2">{error}</div>}
        <div className="text-center mt-4">
          <span className="text-zinc-600 dark:text-zinc-300">ليس لديك حساب؟ </span>
          <a
            href="/register"
            className="text-blue-600 hover:underline font-bold"
          >
            سجل الآن
          </a>
        </div>
      </form>
    </div>
  );
}

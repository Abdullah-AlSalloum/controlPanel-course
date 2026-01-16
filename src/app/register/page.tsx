"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      router.push("/");
    } catch (err: any) {
      setError("حدث خطأ أثناء التسجيل. تأكد من صحة البيانات أو أن البريد الإلكتروني غير مستخدم.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6"
        dir="rtl"
        style={{ fontFamily: 'Cairo, Noto Sans Arabic, sans-serif' }}
      >
        <h1 className="text-2xl font-extrabold mb-4 text-blue-700 dark:text-blue-300 text-center">تسجيل حساب جديد</h1>
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-700 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
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
          {loading ? "جاري التسجيل..." : "تسجيل"}
        </button>
        {error && <div className="text-red-600 font-bold text-right mt-2">{error}</div>}
        <div className="text-center mt-4">
          <span className="text-zinc-600 dark:text-zinc-300">لديك حساب بالفعل؟ </span>
          <a
            href="/login"
            className="text-blue-600 hover:underline font-bold"
          >
            تسجيل الدخول
          </a>
        </div>
      </form>
    </div>
  );
}

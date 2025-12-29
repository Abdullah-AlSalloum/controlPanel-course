"use client";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { auth } from "../../firebase";

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    // Listen for auth state changes to get the actual user
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setDisplayName(firebaseUser?.displayName || "");
      setEmail(firebaseUser?.email || "");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (password && password !== confirmPassword) {
      setError("كلمة المرور غير متطابقة.");
      return;
    }
    try {
      if (user) {
        if (displayName !== user.displayName) {
          await updateProfile(user, { displayName });
        }
        if (password) {
          await updatePassword(user, password);
        }
        setMessage("تم تحديث الملف الشخصي بنجاح.");
      }
    } catch (err: any) {
      setError("حدث خطأ أثناء التحديث: " + (err.message || err));
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto w-full px-2 md:px-0 mt-10 text-center text-blue-700 font-bold text-xl">جاري تحميل البيانات...</div>
    );
  }
  return (
    <div className="max-w-xl mx-auto w-full px-2 md:px-0 mt-10" dir="rtl" style={{ fontFamily: 'Cairo, Noto Sans Arabic, sans-serif' }}>
      <h1 className="text-3xl font-extrabold mb-8 text-blue-700 dark:text-blue-300 text-right">الملف الشخصي</h1>
      <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 mb-10">
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-zinc-700 dark:text-zinc-200">اسم المستخدم</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-zinc-700 dark:text-zinc-200">البريد الإلكتروني</label>
          <div
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-right text-zinc-400 select-none cursor-default"
            style={{ userSelect: 'none' }}
          >
            {email}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-zinc-700 dark:text-zinc-200">كلمة المرور الجديدة (اختياري)</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="اتركه فارغًا إذا لم ترغب في التغيير"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-zinc-700 dark:text-zinc-200">تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="أعد كتابة كلمة المرور الجديدة"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-blue-700 transition">تحديث الملف الشخصي</button>
        {message && <div className="text-green-600 font-bold text-right mt-2">{message}</div>}
        {error && <div className="text-red-600 font-bold text-right mt-2">{error}</div>}
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../firebase";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  // gender?: string;
}

export function UsersCountCard() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const db = getFirestore(app);
    getDocs(collection(db, "users")).then((snap) => setCount(snap.size));
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col items-center border border-slate-200 dark:border-slate-700 min-w-[260px] max-w-[340px] w-full">
      <span className="text-4xl font-extrabold text-teal-600 dark:text-teal-300 mb-2">{count === null ? "..." : count}</span>
      <span className="text-lg font-bold text-slate-700 dark:text-slate-200">عدد المستخدمين</span>
    </div>
  );
}

export function UsersTable() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore(app);
    getDocs(collection(db, "users")).then((snap) => {
      setUsers(
        snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.displayName || d.name || "-",
            email: d.email || "-",
            // gender: d.gender || "-",
          };
        })
      );
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full overflow-x-auto mt-8">
      <table className="min-w-full bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 text-right" dir="rtl">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-700">
            <th className="p-3 font-bold text-slate-700 dark:text-slate-100">الاسم</th>
            <th className="p-3 font-bold text-slate-700 dark:text-slate-100">البريد الإلكتروني</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={3} className="p-6 text-center">جاري التحميل...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={3} className="p-6 text-center">لا يوجد مستخدمون.</td></tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 text-slate-800 dark:text-slate-100">{u.name}</td>
                <td className="p-3 text-slate-800 dark:text-slate-100">{u.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

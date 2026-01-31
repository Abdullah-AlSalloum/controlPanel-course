import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../firebase";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  finalExamDate?: string;
  finalExamGrade?: number;
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
    const fetchUsers = async () => {
      const userSnaps = await getDocs(collection(db, "users"));
      const userList: UserInfo[] = userSnaps.docs.map((doc) => {
        const d = doc.data();
        let createdAt = "-";
        if (d.createdAt && d.createdAt.seconds) {
          const date = new Date(d.createdAt.seconds * 1000);
          createdAt = date.toLocaleDateString();
        }
        return {
          id: doc.id,
          name: d.displayName || d.name || "-",
          email: d.email || "-",
          createdAt,
        };
      });

      // Fetch final exam attempts for each user
      const attemptsSnaps = await getDocs(collection(db, "user_quiz_attempts"));
      const attempts = attemptsSnaps.docs.filter(doc => doc.data().videoId === "final");
      const attemptsMap: Record<string, { date: string, grade: number }> = {};
      attempts.forEach(doc => {
        const d = doc.data();
        if (d.userId) {
          let date = "-";
          if (d.timestamp && d.timestamp.seconds) {
            date = new Date(d.timestamp.seconds * 1000).toLocaleDateString();
          }
          attemptsMap[d.userId] = { date, grade: d.score || 0 };
        }
      });

      // Merge attempts into users
      setUsers(userList.map(u => ({
        ...u,
        finalExamDate: attemptsMap[u.id]?.date || "-",
        finalExamGrade: attemptsMap[u.id]?.grade ?? undefined,
      })));
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-full overflow-x-auto mt-8">
      <table className="min-w-full bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 text-right" dir="rtl">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-700">
            <th className="p-3 font-bold text-slate-700 dark:text-slate-100">الاسم</th>
            <th className="p-3 font-bold text-slate-700 dark:text-slate-100">البريد الإلكتروني</th>
            <th className="p-3 font-bold text-slate-700 dark:text-slate-100">تاريخ التسجيل</th>
            <th className="p-3 font-bold text-slate-700 dark:text-slate-100">تاريخ اختبار النهاية</th>
            <th className="p-3 font-bold text-slate-700 dark:text-slate-100">درجة اختبار النهاية</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="p-6 text-center">جاري التحميل...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={5} className="p-6 text-center">لا يوجد مستخدمون.</td></tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 text-slate-800 dark:text-slate-100">{u.name}</td>
                <td className="p-3 text-slate-800 dark:text-slate-100">{u.email}</td>
                <td className="p-3 text-slate-800 dark:text-slate-100">{u.createdAt || "-"}</td>
                <td className="p-3 text-slate-800 dark:text-slate-100">{u.finalExamDate || "-"}</td>
                <td className="p-3 text-slate-800 dark:text-slate-100">{u.finalExamGrade !== undefined ? u.finalExamGrade : "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

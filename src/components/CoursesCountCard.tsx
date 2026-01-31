import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../firebase";

export default function CoursesCountCard() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const db = getFirestore(app);
      const snapshot = await getDocs(collection(db, "courses"));
      setCount(snapshot.size);
    };
    fetchCount();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col items-center border border-slate-200 dark:border-slate-700 min-w-[260px] max-w-[340px] w-full">
      <span className="text-4xl font-extrabold text-teal-600 dark:text-teal-300 mb-2">{count === null ? "..." : count}</span>
      <span className="text-lg font-bold text-slate-700 dark:text-slate-200">عدد الدورات</span>
    </div>
  );
}

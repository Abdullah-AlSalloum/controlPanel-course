"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../firebase";
import { getDocs, query, collection, where, updateDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
const VideoQuiz = dynamic(() => import("../../videos/VideoQuiz"), { ssr: false });
import type { Question } from "../../videos/VideoQuiz";

export default function FinalQuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [finalQuiz, setFinalQuiz] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFinalQuiz = async () => {
      setLoading(true);
      setError("");
      try {
        const courseSnap = await getDocs(query(collection(db, "courses"), where("id", "==", courseId)));
        const docSnap = courseSnap.docs[0];
        if (docSnap && docSnap.data().final_quiz) {
          setFinalQuiz(docSnap.data().final_quiz);
        } else {
          setFinalQuiz([]);
        }
      } catch (err) {
        setError("تعذر تحميل اختبار نهاية الدورة.");
      }
      setLoading(false);
    };
    if (courseId) fetchFinalQuiz();
  }, [courseId]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const courseSnap = await getDocs(query(collection(db, "courses"), where("id", "==", courseId)));
      const docRef = courseSnap.docs[0]?.ref;
      if (!docRef) throw new Error("لم يتم العثور على الدورة.");
      await updateDoc(docRef, { final_quiz: finalQuiz });
    } catch (err) {
      setError("تعذر حفظ اختبار نهاية الدورة.");
    }
    setSaving(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 md:px-10 mt-10" dir="rtl" style={{ fontFamily: 'Cairo, Noto Sans Arabic, sans-serif' }}>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-green-700 dark:text-green-300 text-right">إدارة اختبار نهاية الدورة</h1>
      {loading ? (
        <div className="text-green-700 dark:text-green-200 font-bold text-center py-8">جاري التحميل...</div>
      ) : (
        <>
          <VideoQuiz questions={finalQuiz} setQuestions={setFinalQuiz} />
          <div className="flex gap-3 justify-end mt-4">
            <button
              className="bg-green-600 text-white px-7 py-2.5 rounded-xl font-bold shadow hover:bg-green-700 transition disabled:opacity-60 text-base"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "جاري الحفظ..." : "حفظ اختبار نهاية الدورة"}
            </button>
            <button
              className="bg-gray-400 text-white px-7 py-2.5 rounded-xl font-bold shadow hover:bg-gray-500 transition text-base"
              onClick={() => router.back()}
            >
              رجوع
            </button>
          </div>
          {error && <div className="text-red-600 font-bold text-right mt-2">{error}</div>}
        </>
      )}
    </div>
  );
}

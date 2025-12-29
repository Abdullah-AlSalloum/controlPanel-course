"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
const VideoQuiz = dynamic(() => import("../../../videos/VideoQuiz"), { ssr: false });
import type { Question } from "../../../videos/VideoQuiz";

export default function FinalQuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [finalQuiz, setFinalQuiz] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const fetchFinalQuiz = async () => {
      setLoading(true);
      setError("");
      console.log("[FinalQuiz] Fetching for courseId:", courseId);
      try {
        if (!courseId) throw new Error("Course ID is missing.");
        const docRef = doc(db, "courses", courseId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFinalQuiz(docSnap.data().final_quiz || []);
          setPublished(!!docSnap.data().final_quiz_published);
        } else {
          setFinalQuiz([]);
          setPublished(false);
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
      if (!courseId) throw new Error("Course ID is missing.");
      const docRef = doc(db, "courses", courseId as string);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("لم يتم العثور على الدورة.");
      await updateDoc(docRef, { final_quiz: finalQuiz });
    } catch (err: any) {
      setError("تعذر حفظ اختبار نهاية الدورة. " + (err && err.message ? err.message : ''));
    }
    setSaving(false);
  };

  // Publish/unpublish final quiz
  const handlePublish = async (publish: boolean) => {
    if (!courseId) return;
    const docRef = doc(db, "courses", courseId as string);
    await updateDoc(docRef, { final_quiz_published: publish });
    setPublished(publish);
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
            {published ? (
              <button
                className="bg-gray-700 text-white px-7 py-2.5 rounded-xl font-bold shadow hover:bg-gray-800 transition text-base"
                onClick={() => handlePublish(false)}
              >
                إلغاء النشر
              </button>
            ) : (
              <button
                className="bg-green-700 text-white px-7 py-2.5 rounded-xl font-bold shadow hover:bg-green-800 transition text-base"
                onClick={() => handlePublish(true)}
              >
                إرسال إلى التطبيق
              </button>
            )}
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

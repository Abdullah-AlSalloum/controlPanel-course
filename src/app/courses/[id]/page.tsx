"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "../../../firebase";
import { getDocs, collection, query, where, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import dynamic from "next/dynamic";
const VideoQuiz = dynamic(() => import("../../videos/VideoQuiz"), { ssr: false });
import type { Question } from "../../videos/VideoQuiz";


interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  imageUrl: string;
  instructor: string;
}

interface Video {
  id: string;
  title_ar: string;
  title_en?: string;
  order: number;
  videoUrl?: string;
  youtubeId?: string;
  courseId?: string;
  questions?: Question[];
}


const CoursePage = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Video>>({ questions: [] });
  const params = useParams();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

    // Final quiz state and error handling
    const [finalQuiz, setFinalQuiz] = useState<any>(null);
    const [finalQuizSaving, setFinalQuizSaving] = useState(false);
    const [finalQuizError, setFinalQuizError] = useState<string>("");

    // Save final quiz handler
    const handleSaveFinalQuiz = async () => {
      setFinalQuizSaving(true);
      setFinalQuizError("");
      try {
        // Find course doc by id
        const courseSnap = await getDocs(query(collection(db, "courses"), where("id", "==", courseId)));
        const docRef = courseSnap.docs[0]?.ref;
        if (!docRef) throw new Error("لم يتم العثور على الدورة.");
        await updateDoc(docRef, { final_quiz: finalQuiz });
      } catch (err) {
        setFinalQuizError("تعذر حفظ اختبار نهاية الدورة.");
      }
      setFinalQuizSaving(false);
    };
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const courseSnap = await getDocs(collection(db, "courses"));
      const found = courseSnap.docs.find((doc) => doc.id === courseId);
      if (found) setCourse({ id: found.id, ...found.data() } as Course);
      const videosSnap = await getDocs(query(collection(db, "videos"), where("courseId", "==", courseId)));
      setVideos(videosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Video)));
      setLoading(false);
    };
    if (courseId) fetchData();
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Helper to extract YouTube video ID from URL or input
  function extractYouTubeId(input: string): string {
    // If input is already an 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    // Try to extract from full URL
    const match = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/) || input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : input;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await updateDoc(doc(db, "videos", editingId), form);
        setEditingId(null);
        setShowModal(false); // Close modal after update
        setForm({});
      } else {
        await addDoc(collection(db, "videos"), { ...form, courseId });
        setForm({ questions: [] });
      }
      // Refresh videos
      const videosSnap = await getDocs(query(collection(db, "videos"), where("courseId", "==", courseId)));
      setVideos(videosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Video)));
    } catch (err) {
      setError("حدث خطأ أثناء حفظ الفيديو. حاول مرة أخرى.");
    }
    setLoading(false);
  };

  const handleEdit = (video: Video) => {
    setForm({ ...video, questions: video.questions || [] });
    setEditingId(video.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الفيديو؟")) return;
    await deleteDoc(doc(db, "videos", id));
    // Refresh videos
    const videosSnap = await getDocs(query(collection(db, "videos"), where("courseId", "==", courseId)));
    setVideos(videosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Video)));
  };

  if (loading) return <div className="text-white p-8">جاري التحميل...</div>;
  if (!course) return <div className="text-red-500 p-8">لم يتم العثور على الدورة.</div>;

  return (
    <div className="w-full" dir="rtl" style={{ fontFamily: 'Cairo, Noto Sans Arabic, sans-serif' }}>
      {/* Course Header */}
      <div className="flex justify-center w-full mb-12 md:ml-50">
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-8 items-center bg-transparent p-0">
          <img src={course.imageUrl} alt={course.titleEn} className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700 shadow" />
          <div className="flex-1 text-right">
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-2">{course.titleAr} / {course.titleEn}</h1>
            <p className="text-zinc-600 dark:text-zinc-300 mb-2 font-medium">{course.descriptionAr}</p>
            <div className="text-zinc-500 dark:text-zinc-400 mb-1">المدرس: {course.instructor}</div>
            <div className="text-zinc-400">عدد الدروس: {videos.length}</div>
        </div>
        </div>
      </div>

      {/* Add/Edit Video Form */}
      <div className="flex justify-center w-full mb-12 md:ml-50">
        <div className="w-full max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-700 dark:text-blue-200">إضافة / تعديل فيديو</h2>
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 pr-1">عنوان الفيديو (بالعربية) <span className="text-red-500">*</span></label>
            <input
              name="title_ar"
              placeholder="مثال: مقدمة الدورة"
              value={form.title_ar || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 pr-1">رابط أو معرف فيديو يوتيوب</label>
            <input
              name="youtubeId"
              placeholder="مثال: https://youtu.be/abc123xyz00 أو abc123xyz00"
              value={form.youtubeId || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
            />
          </div>
          {/* Per-video quiz questions UI */}
          <div className="pt-2">
            <VideoQuiz
              questions={form.questions || []}
              setQuestions={qs => setForm({ ...form, questions: qs })}
            />
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-7 py-2.5 rounded-xl font-bold shadow hover:bg-blue-700 transition disabled:opacity-60 text-base"
            >
              {editingId ? "تحديث الفيديو" : "إضافة الفيديو"}
            </button>
            {editingId && (
              <button
                type="button"
                className="bg-gray-400 text-white px-7 py-2.5 rounded-xl font-bold shadow hover:bg-gray-500 transition text-base"
                onClick={() => {
                  setForm({});
                  setEditingId(null);
                }}
              >
                إلغاء
              </button>
            )}
          </div>
          {error && <div className="text-red-600 font-bold text-right mt-2">{error}</div>}
          </form>
        </div>
      </div>


      {/* Video List Section */}
      <div className="flex justify-center w-full md:ml-50">
        <div className="w-full max-w-3xl">
          
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-700 dark:text-blue-200">قائمة الفيديوهات</h2>
          {videos.length === 0 ? (
            <div className="text-zinc-500 dark:text-zinc-300 text-center py-8">لا توجد فيديوهات بعد.</div>
          ) : (
            <div className="flex flex-col gap-5">
              {videos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((video) => (
                <div key={video.id} className="flex flex-col md:flex-row md:items-center bg-zinc-50 dark:bg-zinc-800 rounded-xl shadow p-4 md:p-5 gap-4 md:gap-6 hover:bg-blue-50 dark:hover:bg-zinc-700 transition border border-zinc-100 dark:border-zinc-700">
                  <div className="flex-1 text-right">
                    <div className="font-bold text-lg md:text-xl text-zinc-900 dark:text-white mb-1">درس <span className="text-blue-600 dark:text-blue-300">{video.order}</span>: {video.title_ar}</div>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-300 text-sm mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                      </svg>
                      <span>الأسئلة: {Array.isArray(video.questions) ? video.questions.length : 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto">
                    <span className="bg-blue-500 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg shadow">{video.order}</span>
                    <button
                      className="bg-yellow-500 text-white px-4 py-1.5 rounded font-bold shadow hover:bg-yellow-600 transition text-sm"
                      onClick={() => handleEdit(video)}
                    >
                      تعديل
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-1.5 rounded font-bold shadow hover:bg-red-700 transition text-sm"
                      onClick={() => handleDelete(video.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 w-[80vw] h-[70vh] max-w-3xl relative flex flex-col overflow-hidden">
            <button
              className="absolute top-3 left-3 text-2xl font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
              onClick={() => { setShowModal(false); setEditingId(null); setForm({}); }}
            >
              ×
            </button>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-700 dark:text-blue-200"> تعديل الفيديو</h2>
            <div className="flex-1 overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 pr-1">عنوان الفيديو (بالعربية) <span className="text-red-500">*</span></label>
                  <input
                    name="title_ar"
                    placeholder="مثال: مقدمة الدورة"
                    value={form.title_ar || ""}
                    onChange={handleChange}
                    className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 pr-1">رابط أو معرف فيديو يوتيوب</label>
                  <input
                    name="youtubeId"
                    placeholder="مثال: https://youtu.be/abc123xyz00 أو abc123xyz00"
                    value={form.youtubeId || ""}
                    onChange={handleChange}
                    className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
                  />
                </div>
                {/* Per-video quiz questions UI */}
                <div className="pt-2">
                  <VideoQuiz
                    questions={form.questions || []}
                    setQuestions={qs => setForm({ ...form, questions: qs })}
                  />
                </div>
                <div className="flex gap-3 justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-7 py-2.5 rounded-xl font-bold shadow hover:bg-blue-700 transition disabled:opacity-60 text-base"
                  >
                    تحديث الفيديو
                  </button>
                  <button
                    type="button"
                    className="bg-gray-400 text-white px-7 py-2.5 rounded-xl font-bold shadow hover:bg-gray-500 transition text-base"
                    onClick={() => { setShowModal(false); setEditingId(null); setForm({}); }}
                  >
                    إلغاء
                  </button>
                </div>
                {error && <div className="text-red-600 font-bold text-right mt-2">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;

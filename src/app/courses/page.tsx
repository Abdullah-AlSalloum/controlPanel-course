"use client";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  instructor: string;
  imageUrl?: string;
  published?: boolean;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Course>>({ published: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  // No need for imageFile state with Cloudinary widget

  const fetchCourses = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "courses"));
    setCourses(
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Course))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({
        ...form,
        [name]: checked,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUploading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "courses", editingId), {
          ...form,
          published: form.published ?? false,
        });
      } else {
        const docRef = await addDoc(collection(db, "courses"), {
          ...form,
          published: form.published ?? true, // New courses are published by default unless unchecked
        });
        await updateDoc(docRef, { id: docRef.id });
      }
      setForm({
        titleAr: "",
        titleEn: "",
        descriptionAr: "",
        instructor: "",
        imageUrl: "",
        published: true
      });
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
      setError("Error saving course: " + (err instanceof Error ? err.message : String(err)));
    }
    setUploading(false);
  }

  const handleEdit = (course: Course) => {
    setForm(course);
    setEditingId(course.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذه الدورة؟")) return;
    await deleteDoc(doc(db, "courses", id));
    fetchCourses();
  };


  // Cloudinary upload widget integration
  const openCloudinaryWidget = (callback: (url: string) => void) => {
    // @ts-ignore
    if (window.cloudinary) {
      // @ts-ignore
      window.cloudinary.openUploadWidget(
        {
          cloudName: "dzsnl3sgt",
          uploadPreset: "unsigned_preset",
          sources: ["local", "url", "camera"],
          multiple: false,
          folder: "course_images",
          resourceType: "image",
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            callback(result.info.secure_url);
          }
        }
      );
    } else {
      alert("Cloudinary widget not loaded. Please check your internet connection.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-2 md:px-10" dir="rtl" style={{ fontFamily: 'Cairo, Noto Sans Arabic, sans-serif' }}>
      <h1 className="text-3xl font-extrabold mb-8 text-blue-700 dark:text-blue-300 text-right">إدارة الدورات</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 mb-10"
        encType="multipart/form-data"
      >
                {/* حقل صورة الدورة باستخدام Cloudinary */}
                <div className="flex flex-col gap-2">
                  <label className="font-bold">صورة الدورة (اختياري)</label>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-blue-700 transition"
                    onClick={() => openCloudinaryWidget((url) => setForm({ ...form, imageUrl: url }))}
                  >
                    رفع صورة الدورة
                  </button>
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="صورة الدورة" className="w-24 h-24 object-cover rounded-lg mt-2" />
                  )}
                </div>
        <input
          name="titleAr"
          placeholder="اسم الدورة (بالعربية)"
          value={form.titleAr || ""}
          onChange={handleChange}
          className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          name="titleEn"
          placeholder="اسم الدورة (بالإنجليزية)"
          value={form.titleEn || ""}
          onChange={handleChange}
          className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          name="instructor"
          placeholder="اسم المدرس"
          value={form.instructor || ""}
          onChange={handleChange}
          className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        {/* حقل وصف الدورة */}
        <textarea
          name="descriptionAr"
          placeholder="وصف الدورة (بالعربية)"
          value={form.descriptionAr || ""}
          onChange={handleChange}
          className="p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 col-span-1 md:col-span-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <div className="flex items-center col-span-1 md:col-span-2 gap-4 mb-2">
          <label className="flex items-center gap-2 font-bold">
            <input
              type="checkbox"
              name="published"
              checked={!!form.published}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600"
            />
            نشر الدورة (تظهر في التطبيق)
          </label>
        </div>
        <div className="col-span-1 md:col-span-2 flex gap-3 justify-end mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
            disabled={uploading}
          >
            {uploading ? (editingId ? "جاري التحديث..." : "جاري الإضافة...") : (editingId ? "تحديث" : "إضافة")}
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-gray-500 transition"
              onClick={() => {
                setForm({});
                setEditingId(null);
              }}
            >
              إلغاء
            </button>
          )}
        </div>
        {error && <div className="text-red-600 col-span-2 font-bold text-right mt-2">{error}</div>}
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {loading ? (
          <div className="col-span-full text-center text-blue-700 dark:text-blue-200 font-bold text-lg">جاري التحميل...</div>
        ) : courses.length === 0 ? (
          <div className="col-span-full text-center text-zinc-500 dark:text-zinc-300 font-bold text-lg">لا توجد دورات.</div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col hover:shadow-2xl transition-all duration-200 group min-w-[320px]"
            >
              {course.imageUrl && (
                <img src={course.imageUrl} alt="صورة الدورة" className="w-32 h-32 object-cover rounded-xl mb-4 mx-auto" />
              )}
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2 group-hover:text-blue-700 transition">{course.titleAr} / {course.titleEn}</h2>
              <div className="text-zinc-500 dark:text-zinc-300 mb-2 font-medium">{course.instructor}</div>
              <div className="text-zinc-600 dark:text-zinc-200 mb-4 line-clamp-2">{course.descriptionAr}</div>
              <div className="grid grid-cols-2 gap-3 mt-auto w-full">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-blue-700 transition col-span-2"
                  onClick={() => window.location.href = `/courses/${course.id}`}
                >
                  إدارة الفيديوهات
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-green-700 transition col-span-2"
                  onClick={() => window.location.href = `/courses/${course.id}/final-quiz`}
                >
                  إدارة الاختبار النهائي
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-yellow-600 transition"
                  onClick={e => { e.stopPropagation(); handleEdit(course); }}
                >
                  تعديل
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-red-700 transition"
                  onClick={e => { e.stopPropagation(); handleDelete(course.id); }}
                >
                  حذف
                </button>
                {!course.published && (
                  <button
                    className="bg-blue-700 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-blue-900 transition col-span-2"
                    onClick={async e => {
                      e.stopPropagation();
                      await updateDoc(doc(db, "courses", course.id), { published: true });
                      fetchCourses();
                    }}
                  >
                    إرسال إلى التطبيق
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

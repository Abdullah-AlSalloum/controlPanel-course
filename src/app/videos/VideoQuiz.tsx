import React, { useState } from "react";

export interface Question {
  question_ar: string;
  options_ar: string[];
  correct_answer_ar: string;
  score?: number;
}

interface VideoQuizProps {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
}

const emptyOptions = ["", "", "", ""];

export default function VideoQuiz({ questions, setQuestions }: VideoQuizProps) {
  // Inline editing: no per-question edit state

  return (
    <div>
      <h3 className="font-bold mb-2">أسئلة الاختبار لهذا الفيديو</h3>
      {(questions || []).map((q, idx) => (
        <div
          key={idx}
          className="mb-4 pb-4 flex flex-col gap-2 text-right px-2 sm:px-6 border-b border-zinc-200 dark:border-zinc-700"
          style={{ direction: 'rtl' }}
        >
          <div className="flex items-center gap-2 text-lg font-bold text-blue-300">
            <span className="inline-block w-6 text-blue-400">س:</span>
            <input
              className="p-2 w-full rounded bg-zinc-200 dark:bg-zinc-800 focus:outline-none"
              placeholder="نص السؤال (بالعربية)"
              value={q.question_ar}
              onChange={e => {
                const updated = [...questions];
                updated[idx] = { ...q, question_ar: e.target.value };
                setQuestions(updated);
              }}
            />
          </div>
          <div className="flex flex-col gap-2 text-sm text-zinc-300 mt-1">
            <span className="inline-block w-20 text-yellow-400 mb-1">الخيارات:</span>
            {[0,1,2,3].map(i => (
              <div key={i} className="mb-2 flex items-center gap-2">
                <input
                  className="p-2 w-full rounded bg-zinc-200 dark:bg-zinc-800 focus:outline-none"
                  placeholder={`الخيار ${i+1}`}
                  value={q.options_ar?.[i] || ""}
                  onChange={e => {
                    const opts = [...(q.options_ar || ["", "", "", ""])]
                    opts[i] = e.target.value;
                    const updated = [...questions];
                    updated[idx] = { ...q, options_ar: opts };
                    setQuestions(updated);
                  }}
                />
                <button
                  type="button"
                  className={`px-3 py-1 rounded font-bold border ${q.correct_answer_ar === (q.options_ar?.[i] || "") && (q.options_ar?.[i] || "") ? 'bg-green-600 text-white border-green-700' : 'bg-zinc-300 dark:bg-zinc-700 border-zinc-400 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200'}`}
                  style={{ minWidth: 40 }}
                  onClick={() => {
                    if (q.options_ar?.[i]) {
                      const updated = [...questions];
                      updated[idx] = { ...q, correct_answer_ar: q.options_ar[i] };
                      setQuestions(updated);
                    }
                  }}
                  disabled={!(q.options_ar?.[i])}
                  title="اختر كإجابة صحيحة"
                >
                  ✓
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              className="text-red-400 hover:underline font-semibold"
              onClick={() => {
                setQuestions((questions || []).filter((_, i) => i !== idx));
              }}
            >
              حذف
            </button>
          </div>
        </div>
      ))}
      {/* Add new question */}
      <div className="mt-4 p-2 rounded bg-zinc-100 dark:bg-zinc-900">
        <button
          type="button"
          className="bg-green-600 text-white px-4 py-1 rounded font-bold mr-2"
          onClick={() => {
            setQuestions([...(questions || []), { question_ar: '', options_ar: ["", "", "", ""], correct_answer_ar: '', score: 1 }]);
          }}
        >إضافة سؤال جديد</button>
      </div>
    </div>
  );
}
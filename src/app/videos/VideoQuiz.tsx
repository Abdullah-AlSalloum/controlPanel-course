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
  const [questionForm, setQuestionForm] = useState<Partial<Question>>({ options_ar: [...emptyOptions] });
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);

  return (
    <div>
      <h3 className="font-bold mb-2">أسئلة الاختبار لهذا الفيديو</h3>
      {(questions || []).map((q, idx) => (
        <div
          key={idx}
          className="mb-4 pb-4 flex flex-col gap-2 text-right px-2 sm:px-6"
          style={{ direction: 'rtl' }}
        >
          <div className="flex items-center gap-2 text-lg font-bold text-blue-300">
            <span className="inline-block w-6 text-blue-400">س:</span>
            <span>{q.question_ar}</span>
          </div>
          <div className="flex flex-col gap-2 text-sm text-zinc-300 mt-1">
            <span className="inline-block w-20 text-yellow-400 mb-1">الخيارات:</span>
            <div className="flex flex-col gap-2 w-full">
              {q.options_ar.map((opt, i) => (
                <span key={i} className="block px-3 py-2 rounded bg-zinc-800 text-yellow-200 w-full text-right">{opt}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm mt-2 w-full">
            <span className="inline-block w-24 text-green-400 mb-1">الإجابة الصحيحة:</span>
            <span className="block px-3 py-2 rounded bg-green-900/60 text-green-200 font-bold w-full text-right">{q.correct_answer_ar}</span>
          </div>
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              className="text-blue-400 hover:underline font-semibold"
              onClick={() => {
                setQuestionForm(q);
                setEditingQuestionIdx(idx);
              }}
            >
              تعديل
            </button>
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
      {/* Add/Edit question form */}
      <div className="mt-4 p-2 rounded bg-zinc-100 dark:bg-zinc-900">
        <input
          className="mb-2 p-2 w-full rounded bg-zinc-200 dark:bg-zinc-800 focus:outline-none"
          placeholder="نص السؤال (بالعربية)"
          value={questionForm.question_ar || ""}
          onChange={e => setQuestionForm({ ...questionForm, question_ar: e.target.value })}
        />
        {[0,1,2,3].map(i => (
          <input
            key={i}
            className="mb-2 p-2 w-full rounded bg-zinc-200 dark:bg-zinc-800 focus:outline-none"
            placeholder={`الخيار ${i+1}`}
            value={questionForm.options_ar?.[i] || ""}
            onChange={e => {
              const opts = [...(questionForm.options_ar || [...emptyOptions])];
              opts[i] = e.target.value;
              setQuestionForm({ ...questionForm, options_ar: opts });
            }}
          />
        ))}
        <input
          className="mb-2 p-2 w-full rounded bg-zinc-200 dark:bg-zinc-800 focus:outline-none"
          placeholder="الإجابة الصحيحة (بالعربية)"
          value={questionForm.correct_answer_ar || ""}
          onChange={e => setQuestionForm({ ...questionForm, correct_answer_ar: e.target.value })}
        />
        <input
          className="mb-2 p-2 w-full rounded bg-zinc-200 dark:bg-zinc-800 focus:outline-none"
          placeholder="الدرجة (اختياري)"
          type="number"
          value={questionForm.score || ""}
          onChange={e => setQuestionForm({ ...questionForm, score: Number(e.target.value) })}
        />
        <button
          type="button"
          className="bg-green-600 text-white px-4 py-1 rounded font-bold mr-2"
          onClick={() => {
            if (!questionForm.question_ar || !(questionForm.options_ar || []).every(opt => opt) || !questionForm.correct_answer_ar) return;
            const newQuestions = [...(questions || [])];
            if (editingQuestionIdx !== null) {
              newQuestions[editingQuestionIdx] = questionForm as Question;
            } else {
              newQuestions.push(questionForm as Question);
            }
            setQuestions(newQuestions);
            setQuestionForm({ options_ar: [...emptyOptions] });
            setEditingQuestionIdx(null);
          }}
        >{editingQuestionIdx !== null ? "تحديث السؤال" : "إضافة سؤال"}</button>
        {editingQuestionIdx !== null && (
          <button type="button" className="ml-2 text-gray-600" onClick={() => {
            setQuestionForm({ options_ar: [...emptyOptions] });
            setEditingQuestionIdx(null);
          }}>إلغاء</button>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, where, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { app } from "../firebase";

export default function VideosCountCard() {
	const [total, setTotal] = useState<number | null>(null);
	const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
	const [selected, setSelected] = useState<string>("");
	const [courseCount, setCourseCount] = useState<number | null>(null);


	useEffect(() => {
		const db = getFirestore(app);
		getDocs(collection(db, "videos")).then((snap: QuerySnapshot<DocumentData>) => setTotal(snap.size));
		getDocs(collection(db, "courses")).then((snap: QuerySnapshot<DocumentData>) => {
			setCourses(snap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, title: doc.data().titleAr || doc.id })));
		});
	}, []);


	useEffect(() => {
		if (!selected) {
			setCourseCount(null);
			return;
		}
		const db = getFirestore(app);
		getDocs(query(collection(db, "videos"), where("courseId", "==", selected))).then((snap: QuerySnapshot<DocumentData>) => setCourseCount(snap.size));
	}, [selected]);

	// Show courseCount if a course is selected, otherwise show total
	const displayCount = selected ? courseCount : total;

	return (
		<div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col items-center border border-slate-200 dark:border-slate-700 min-w-[260px] max-w-[340px] w-full">
			<span className="text-4xl font-extrabold text-teal-600 dark:text-teal-300 mb-2">{displayCount === null ? "..." : displayCount}</span>
			<span className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">عدد الفيديوهات</span>
			<select
				className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-right focus:outline-none focus:ring-2 focus:ring-teal-400 transition mb-2"
				value={selected}
				onChange={e => setSelected(e.target.value)}
			>
				<option value="">اختر دورة لمعرفة عدد الفيديوهات</option>
				{courses.map(c => (
					<option key={c.id} value={c.id}>{c.title}</option>
				))}
			</select>
		</div>
	);
}

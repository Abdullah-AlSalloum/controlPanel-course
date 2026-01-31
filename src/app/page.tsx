"use client";

import CoursesCountCard from "../components/CoursesCountCard";
import VideosCountCard from "../components/VideosCountCard";
import { UsersCountCard, UsersTable } from "../components/UsersTable";
import FinalQuizAttemptsCountCard from "../components/FinalQuizAttemptsCountCard";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="w-full flex flex-col items-center gap-8 p-4 md:p-8 max-w-6xl mx-auto">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 place-items-center sm:justify-center pr-27">
          <FinalQuizAttemptsCountCard />
          <VideosCountCard />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 place-items-center sm:justify-center pr-27">
          <CoursesCountCard />
          <UsersCountCard />
        </div>
        <UsersTable />
      </div>
    </div>
  );
}


"use client";

import CoursesCountCard from "../components/CoursesCountCard";
import VideosCountCard from "../components/VideosCountCard";
import { UsersCountCard, UsersTable } from "../components/UsersTable";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="w-full flex flex-col items-center gap-8 p-4 md:p-8 max-w-6xl mx-auto">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 auto-rows-fr place-items-center">
          <CoursesCountCard />
          <VideosCountCard />
          <UsersCountCard />
        </div>
        <UsersTable />
      </div>
    </div>
  );
}

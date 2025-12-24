
"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import AuthButton from "../components/AuthButton";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black" dir="rtl" style={{fontFamily: 'Cairo, Noto Sans Arabic, sans-serif'}}>
      <main className="flex flex-col items-center justify-center gap-8 bg-white dark:bg-black p-8 rounded shadow">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
      </main>
    </div>
  );
}

"use client";

import Sidebar from "@/components/Sidebar";
import Cookie from "js-cookie";

export default function Home() {
  if (!Cookie.get("token")) {
    window.location.href = "/login";
  }
  return (
    <main className="flex min-h-screen min-w-screen">
      <Sidebar />
      <div className="w-5/6">
        {/* Header */}
        <div className="h-1/6 bg-secondary flex flex-col items-center justify-center text-white text-2xl font-bold">
          Voyages
        </div>
        {/* Contenu */}
        <div></div>
      </div>
    </main>
  );
}

"use client";

import Sidebar from "@/components/Sidebar";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [travels, setTravels] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${localStorage.getItem("userId")}/friends`)
      .then((res) => {
        setTravels(res.data);
      })
      .catch((err) => {});
  }, []);

  if (!Cookie.get("token")) {
    window.location.href = "/login";
  }

  return (
    <main className="flex min-h-screen min-w-screen">
      <Sidebar />
      <div className="w-5/6">
        {/* Header */}
        <div className="h-1/6 bg-secondary flex flex-col items-center justify-center text-white text-2xl font-bold">
          Feed
        </div>
        {/* Contenu */}
        <div className="h-5/6"></div>
      </div>
    </main>
  );
}

"use client";

import Sidebar from "@/components/Sidebar";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);

  if (!Cookie.get("token")) {
    window.location.href = "/login";
  }

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/users/${localStorage.getItem(
          "userId"
        )}/friends`
      )
      .then((res) => {
        setFriends(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="flex min-h-screen min-w-screen">
      <Sidebar />
      <div className="w-5/6">
        {/* Header */}
        <div className="h-1/6 bg-secondary flex flex-col items-center justify-center text-white text-2xl font-bold">
          Amis
        </div>
        {/* Contenu */}
        <div className="h-5/6 w-full">
          {/* Search Bar */}
          <div className="h-1/5 flex flex-col justify-center items-center">
            <div className="p-4 bg-secondary w-5/6 h-2/3 rounded-full flex flex-row items-center justify-around">
              <input
                className="w-4/6 px-2 h-full bg-secondary text-white text-xl font-bold border-2 rounded-full"
                type="text"
                placeholder="Rechercher un ami"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <h1 className="font-bold bg-white text-secondary px-4 py-2 rounded-full">
                Ajouter un ami
              </h1>
            </div>
          </div>
          {/* Liste des amis */}
          <div className="h-4/5 flex flex-col items-center justify-center">
            <div className="p-4 bg-primary w-5/6 h-5/6 rounded-xl"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

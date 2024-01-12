"use client";

import Sidebar from "@/components/Sidebar";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState({
    userId: "",
    name: "",
    email: "",
    friendcode: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/users/email/${localStorage.getItem(
          "user_mail"
        )}`
      )
      .then((res) => {
        console.log("API Response:", res.data);
        if (res.status === 200 && res.data.length > 0) {
          const userData = res.data[0]; // Access the first object in the array
          setUser({
            userId: userData.idUser,
            name: userData.name,
            email: userData.email,
            friendcode: userData.friendcode,
          });
        } else {
          setStatusMessage("Erreur lors de la récupération des informations");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        setStatusMessage("Erreur lors de la requête API");
      });
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
          Profil
        </div>
        {/* Contenu */}
        <div className="h-5/6 w-full flex flex-col items-center justify-around">
          {/* Informations du profil */}
          <div className="h-2/5 w-5/6 bg-primary rounded-lg text-white font-bold">
            <h1 className="p-4 bg-secondary w-full rounded-t-lg">
              Informations du profil
            </h1>
            <div className="flex flex-col h-4/5 justify-around">
              <h2 className="p-4"><u>Nom :</u> {user.name}</h2>
              <h2 className="p-4"><u>Email :</u> {user.email}</h2>
            </div>
          </div>
          <div className="h-2/5 w-5/6 bg-primary rounded-lg text-white font-bold">
            <h1 className="p-4 bg-secondary w-full rounded-t-lg">
              Mon dernier voyage
            </h1>
            <div className="p-4 h-4/5 flex flex-col justify-center items-center">
              <h2>{user.friendcode}</h2>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

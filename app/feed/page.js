"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";

import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [friendsLastTravels, setFriendsLastTravels] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // Check if user is logged in
    if (!Cookie.get("token") || !userId) {
      window.location.href = "/login";
    } else {
      // Récupérer les derniers voyages des utilisateurs
      axios
        .get(`http://localhost:3001/api/users/${userId}/friends/lastTravel`)
        .then((response) => {
          setFriendsLastTravels(response.data);
        })
        .catch((error) => {
          console.error("Error retrieving friends' last travels:", error);
        });
    }
  }, []);

  return (
    <main className="flex min-h-screen min-w-screen">
      <Sidebar />
      <div className="w-5/6">
        {/* Header */}
        <div className="h-1/6 bg-secondary flex flex-col items-center justify-center text-white text-2xl font-bold">
          Feed
        </div>
        {/* Content */}
        <div>
          {/* Display friends' last travels */}
          {friendsLastTravels.map((friendTravel, index) => (
            <div key={index}>
              <p>Dernier voyage de {friendTravel.username}:</p>
              <p>{friendTravel.travel.city}</p>
              {/* Convert timestamp to formatted date */}
              <p>
                {new Date(friendTravel.travel.startDate).toLocaleDateString()}
              </p>
              <br></br>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}

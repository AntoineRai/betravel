"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [user, setUser] = useState({
    userId: "",
    name: "",
    email: "",
    friendcode: "",
  });

  const [lastTravel, setLastTravel] = useState({
    idTravel: "",
    city: "",
    endDate: "",
    startDate: "",
    commentary: "",
    idUser: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    // Fetch user information
    axios
      .get(
        `http://localhost:3001/api/users/email/${localStorage.getItem(
          "user_mail"
        )}`
      )
      .then((res) => {
        if (res.status === 200 && res.data.length > 0) {
          const userData = res.data[0];
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

    // Fetch last travel information
    axios
      .get(`http://localhost:3001/api/users/${localStorage.userId}/lastTravel`)
      .then((res) => {
        setLastTravel({
          idTravel: res.data[0].idTravel,
          city: res.data[0].city,
          endDate: new Date(res.data[0].endDate).toLocaleDateString(),
          startDate: new Date(res.data[0].startDate).toLocaleDateString(),
          commentary: res.data[0].commentary,
          idUser: localStorage.userId,
        });
      })
      .catch((error) => {
        console.error("API Error:", error);
        setStatusMessage("Erreur lors de la requête API");
      });
  }, []);

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameChange = () => {
    // Perform API call to update the username
    axios
      .put(`http://localhost:3001/api/users/modify/${user.userId}`, {
        newUsername: newUsername,
      })
      .then((response) => {
        if (response.status === 200) {
          setUser((prevUser) => ({
            ...prevUser,
            name: newUsername,
          }));
        } else {
          setStatusMessage("Erreur lors de la mise à jour du nom d'utilisateur");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        setStatusMessage("Erreur lors de la requête API");
      })
      .finally(() => {
        setIsEditingName(false);
      });
  };

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
              <div className="p-4 flex justify-between">
                
                {isEditingName ? (
                  <>
                  <div>
                  <u>Nom :</u>{" "}
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-grey leading-tight focus:outline-none focus:shadow-outline"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                    </div>
                    <button onClick={handleNameChange}>Valider</button>
                  </>
                ) : (
                  <>
                  <div>
                  <u>Nom :</u>{" "}
                    {user.name}{" "}
                    </div>
                    <button onClick={handleNameEdit}>Modifier</button>
                  </>
                )}
              </div>
              <h2 className="p-4">
                <u>Email :</u> {user.email}
              </h2>
            </div>
          </div>
          <div className="h-2/5 w-5/6 bg-primary rounded-lg text-white font-bold">
            <h1 className="p-4 bg-secondary w-full rounded-t-lg">
              Mon dernier voyage
            </h1>
            <div className="p-4 h-4/5 flex flex-col justify-center items-center">
              <h1 className="text-lg">{lastTravel.city}</h1>
              <h2 className="text-md italic">
                {lastTravel.startDate} - {lastTravel.endDate}
              </h2>
              <p className="text-md">{lastTravel.commentary}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

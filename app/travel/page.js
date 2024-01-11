"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Cookie from "js-cookie";
import axios from "axios";
import PopupVoyage from "@/components/PopupVoyage";

export default function Home() {
  const [travels, setTravels] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [travel, setTravel] = useState({
    city: "",
    startDate: "",
    endDate: "",
    commentary: "",
  });

  if (!Cookie.get("token")) {
    window.location.href = "/login";
  }
  
  const handleOpenPopUp = () => {
    setTrigger(true);
  }

  useEffect(() => {
    axios.get("http://localhost:3001/api/users/1/travel").then((res) => {
      console.log(res.data);
      if (res.status === 200) {
        setTravels(res.data);
      } else {
        console.error("Erreur lors de la récupération des voyages:", res);
      }
    });
  }, []);

  return (
    <main className="flex min-h-screen min-w-screen">
      <Sidebar />
      <div className="w-5/6">
        {/* Header */}
        <div className="h-1/6 bg-secondary flex flex-col items-center justify-center text-white text-2xl font-bold">
          Voyages
        </div>
        {/* Contenu */}
        <div className="flex flex-col pt-2 py-2 h-5/6">
          {/* Ajouter un voyage */}
          <div className="h-1/6 flex flex-col items-center justify-center w-full">
            <button onClick={handleOpenPopUp} className="bg-secondary text-white text-xl p-4 rounded-full text-center font-bold hover:bg-white hover:text-secondary hover:border-2 hover:border-secondary transition-all duration-300 ease-in-out">
              Ajoutez votre voyage
            </button>
          </div>
          {/* Liste des voyages */}
          <div className="h-4/6 w-full">
            {travels.map((travel) => (
              <div
                key={travel.idTravel}
                className="w-full flex flex-col items-center justify-center h-2/4"
              >
                <div className="h-full w-5/6 bg-primary rounded-lg shadow-lg p-4 m-4 flex flex-col items-start justify-center text-white">
                  <h1 className="text-xl font-bold">{travel.city}</h1>
                  <h2 className="text-lg">{travel.commentary}</h2>
                  <h3 className="text-md">{travel.startDate}</h3>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="h-1/6 w-full"></div>
        </div>
      </div>
      <PopupVoyage trigger={trigger} setTrigger={setTrigger}>
        <div className="h-full w-full">
          <div className="h-1/5 bg-primary rounded-t-lg w-full text-white font-bold flex flex-col items-center justify-center">
            <h1 className="">Ajouter un voyage</h1>
          </div>
          <div className="h-4/5 w-full font-bold flex flex-col justify-around">
            <div className="flex flex-col justify-start items-center h-4/5">
              <form className=" flex flex-col items-center justify-around h-full w-4/5">
                <label
                  htmlFor="city"
                  className="block text-black text-sm font-bold mb-2"
                >
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={travel.city}
                  onChange={(e) =>
                    setTravel({ ...travel, city: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <label
                  htmlFor="startDate"
                  className="block text-black text-sm font-bold mb-2"
                >
                  Date de départ
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={travel.startDate}
                  onChange={(e) =>
                    setTravel({ ...travel, startDate: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <label
                  htmlFor="endDate"
                  className="block text-black text-sm font-bold mb-2"
                >
                  Date de retour
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={travel.endDate}
                  onChange={(e) =>
                    setTravel({ ...travel, endDate: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <label
                  htmlFor="commentary"
                  className="block text-black text-sm font-bold mb-2"
                >
                  Commentaire
                </label>
                <input
                  type="text"
                  name="commentary"
                  id="commentary"
                  value={travel.commentary}
                  onChange={(e) =>
                    setTravel({ ...travel, commentary: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </form>
            </div>
            <div className="w-full h-1/5 flex justify-center items-center">
              <button className="w-4/5 bg-primary text-white font-bold py-2 px-12 rounded focus:outline-none focus:shadow-outline">
                Enregistrer un voyage
              </button>
            </div>
          </div>
        </div>
      </PopupVoyage>
    </main>
  );
}

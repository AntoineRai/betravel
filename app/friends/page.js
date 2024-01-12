"use client";

import Sidebar from "@/components/Sidebar";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import PopupFriend from "@/components/PopupFriend";

export default function Home() {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);

  if (!Cookie.get("token")) {
    window.location.href = "/login";
  }

  const handleOpenPopUp = () => {
    setTrigger(true);
  };

  const handleAddFriend = () => {
    axios
      .post(`http://localhost:3001/api/users/friends`, {
        userId1: localStorage.getItem("userId"),
        friendCode: friendCode,
      })
      .then((res) => {
        if (res.status === 200) {
          setTrigger(false);
          setFriendCode("");
        } else {
          console.error("Erreur lors de l'ajout de l'ami:", res);
        }
      });
  };

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

  useEffect(() => {
    setFilteredFriends(
      friends.filter((friend) =>
        friend.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, friends]);

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
              <button
                onClick={handleOpenPopUp}
                className="font-bold bg-white text-secondary px-4 py-2 rounded-full hover:bg-secondary hover:text-white hover:border-2 hover:border-white transition-all duration-300 ease-in-out"
              >
                Ajouter un ami
              </button>
            </div>
          </div>
          {/* Liste des amis */}
          <div className="h-4/5 flex flex-col items-center justify-center">
            <div className="p-4 bg-primary w-5/6 h-5/6 rounded-xl">
              {filteredFriends.map((friend) => (
                <div className="p-4 flex flex-row items-center justify-between border-b-2 border-white">
                  <h1 className="text-white font-bold text-xl">
                    {friend.name}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <PopupFriend trigger={trigger} setTrigger={setTrigger}>
        <div className="w-full h-full">
          <div className="h-1/5 bg-primary rounded-t-lg w-full text-white font-bold flex flex-col items-center justify-center">
            <h1 className="">Ajouter un ami avec son code</h1>
          </div>
          <div className="flex flex-col items-center justify-around w-full h-4/5">
            <form className=" flex flex-col items-center justify-around h-full w-4/5">
              <label
                htmlFor="friendcode"
                className="block text-black text-sm font-bold mb-2"
              >
                Code Ami:
              </label>
              <input
                type="text"
                name="friendcode"
                id="friendcode"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                onClick={handleAddFriend}
                className="w-4/5 bg-primary text-white font-bold py-2 px-12 rounded focus:outline-none focus:shadow-outline"
              >
                Ajouter un ami
              </button>
            </form>
          </div>
        </div>
      </PopupFriend>
    </main>
  );
}

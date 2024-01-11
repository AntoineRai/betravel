"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = () => {
    if (!user.email || !user.password || !user.name) {
      setStatusMessage("Veuillez remplir tous les champs !");
      return;
    }
    if (!isEmailValid(user.email)) {
      setStatusMessage("Veuillez saisir une adresse email valide !");
      return;
    }
    if (user.password !== confirmPassword) {
      setStatusMessage("Les mots de passe ne correspondent pas !");
      setUser({ name: "", email: "", password: "" });
      setConfirmPassword("");
      return;
    }
    axios.post("http://localhost:3001/api/users", user).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setUser({ name: "", email: "", password: "" });
        setConfirmPassword("");
        setStatusMessage("Inscription réussie !");
      } else {
        setUser({ name: "", email: "", password: "" });
        setConfirmPassword("");
        setStatusMessage("Erreur lors de l'inscription");
      }
    });
  };

  return (
    <main className="flex min-h-screen min-w-screen">
      <div className="w-1/2 min-h-screen flex flex-col justify-center items-center bg-primary text-white font-bold text-3xl">
        <h1>
          Be{" "}
          <span className="bg-white text-primary px-2 py-4 rounded-md">
            Travel
          </span>
        </h1>
      </div>
      <div className="w-1/2 flex flex-col">
        <div className="h-1/4 text-primary text-center border-b-2 border-primary w-full flex flex-col justify-center items-center">
          <h1 className="font-bold text-xl">S'inscrire</h1>
          <h2 className="text-md italic">Vous avez déjà un compte ?</h2>
          <Link href="/login">
            <h2 className="text-md hover:font-bold transition-all duration-300 ease-in-out">
              Se connecter
            </h2>
          </Link>
        </div>
        <div className="h-3/4 flex flex-col items-center justify-center w-full">
          <form className="w-3/4">
            <div className="mb-4">
              <p className="text-center text-green-500 font-bold">
                {statusMessage}
              </p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-grey text-sm font-bold mb-2"
              >
                Veuillez saisir votre nom:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nom"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-grey text-sm font-bold mb-2"
              >
                Veuillez saisir votre email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-grey text-sm font-bold mb-2"
              >
                Veuillez saisir votre mot de passe:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Mot de passe"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-grey text-sm font-bold mb-2"
              >
                Confirmez votre mot de passe:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Confirmez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                className="bg-primary text-white font-bold py-2 px-12 rounded focus:outline-none focus:shadow-outline"
                onClick={handleRegister}
              >
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

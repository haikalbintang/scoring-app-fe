"use client";

import InputScore from "@/components/InputScore";
import { BASE_URL } from "@/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(`${BASE_URL}/auth/token`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.access_token);

      router.push("/competitions");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <main className="bg-white text-black p-3 rounded-lg">
        <h1 className="text-xl mb-4">C4 Polling</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <InputScore
            label="Username"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
          />

          <InputScore
            label="Password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <button
            type="submit"
            className="bg-violet-500 text-white px-4 py-1.5 rounded-lg mx-auto"
          >
            Login
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;

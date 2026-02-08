"use client";

import InputScore from "@/components/InputScore";
import { BASE_URL } from "@/constants";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/auth`, {
        method: "POST",
        body: JSON.stringify({
          username,
          email: "string",
          password,
          role: "user",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("User registered:", data);
      router.push("/login");
    } catch (error) {
      console.error("Register user error:", error);
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
            Sign Up
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;

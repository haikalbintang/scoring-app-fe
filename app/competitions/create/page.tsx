"use client";

import InputScore from "@/components/InputScore";
import { BASE_URL } from "@/constants";
import { useRouter } from "next/navigation";
import React from "react";

const CreateCompetitionPage = () => {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BASE_URL}/competitions/create`, {
        method: "POST",
        body: JSON.stringify({
          title,
          desc: description,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Competition created:", data);
      router.push(`/competitions/${data.id}/users`);
    } catch (error) {
      console.error("Create competition error:", error);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <main className="bg-white text-black p-3 rounded-lg">
        <h1 className="text-xl mb-4">C4 Polling</h1>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <InputScore
            label="Title"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />

          <InputScore
            label="Description"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
          />

          <button
            type="submit"
            className="bg-violet-500 text-white px-4 py-1.5 rounded-lg mx-auto"
          >
            Create Competition
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateCompetitionPage;

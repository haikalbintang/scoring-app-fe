"use client";

import { BASE_URL } from "@/constants";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(
    new Set(),
  );

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const fetchCompetition = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Fetched users:", data);
      setUsers(data);
    };

    fetchCompetition();
  }, []);

  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const submitParticipants = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    if (selectedUserIds.size === 0) {
      console.warn("No users selected");
      return;
    }

    const res = await fetch(`${BASE_URL}/competitions/${id}/participant/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_ids: Array.from(selectedUserIds),
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Failed to add participants:", error);
      return;
    }

    const data = await res.json();
    console.log("Participants added:", data);
    router.push(`/competitions/${id}`);
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <main className="bg-white text-black p-3 rounded-lg">
        <h1 className="text-xl mb-2">Add Participants</h1>
        {users.map((user: { id: number; username: string }) => (
          <label key={user.id} className="flex items-center gap-2 my-2">
            <input
              type="checkbox"
              checked={selectedUserIds.has(user.id)}
              onChange={() => toggleUser(user.id)}
            />
            <span>{user.username}</span>
          </label>
        ))}
        <button
          onClick={submitParticipants}
          className="bg-violet-500 text-white px-4 py-1.5 rounded-lg mx-auto"
        >
          Add Selected Account
        </button>
      </main>
    </div>
  );
};
export default UsersPage;

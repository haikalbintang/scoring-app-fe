"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/constants";
import Link from "next/link";

interface Competition {
  id: number;
  title: string;
  desc: string;
  creator_id: number;
}

interface CompetitionResponse {
  has_been_polled: Competition[];
  not_yet_voted: Competition[];
}

const Page = () => {
  const [competitions, setCompetitions] = useState<CompetitionResponse>({
    has_been_polled: [],
    not_yet_voted: [],
  });

  useEffect(() => {
    const fetchCompetitions = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/competitions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Fetched competitions:", data);
      setCompetitions(data);
    };

    fetchCompetitions();
  }, []);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <main className="bg-white text-black p-3 rounded-lg flex flex-col">
        <h1 className="text-2xl font-bold mb-2">All Competitions</h1>

        {competitions.not_yet_voted?.length > 0 && (
          <div className="my-4">
            <h2 className="text-lg font-semibold">Need your vote:</h2>
            <ul className="">
              {competitions.not_yet_voted.map(
                (c: { id: number; title: string }) => (
                  <li className="text-blue-700 font-semibold my-2" key={c.id}>
                    <Link href={`/competitions/${c.id}`}>{c.title}</Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
        {competitions.has_been_polled?.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mt-4">You have polled:</h2>
            <ul className="mb-4">
              {competitions.has_been_polled?.map(
                (c: { id: number; title: string }) => (
                  <li className="text-gray-700 font-semibold my-2" key={c.id}>
                    <Link href={`/competitions/${c.id}/result`}>
                      {c.title}{" "}
                      <span className="font-medium text-gray-500">
                        (polled)
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </>
        )}
        <Link className="w-full" href="/competitions/create">
          <button
            type="submit"
            className="w-full bg-violet-500 text-white px-4 py-1.5 rounded-lg mx-auto"
          >
            Create a Poll
          </button>
        </Link>
      </main>
    </div>
  );
};

export default Page;

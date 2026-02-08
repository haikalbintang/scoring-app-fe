"use client";

import { BASE_URL } from "@/constants";
import { CompetitionScore } from "@/interface/interface";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ResultPage = () => {
  const [results, setResults] = useState([]);

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/competitions/${id}/scores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Fetched results:", data);
      setResults(data);
    };

    fetchResults();
  }, [id]);
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <main className="bg-white text-black p-3 rounded-lg">
        <h1 className="text-2xl font-bold">Results</h1>
        <div>
          {results.map((result: CompetitionScore) => (
            <div key={result.username} className="my-2">
              <p className="flex justify-between gap-2.5">
                <span className="font-bold">{result.username}:</span>{" "}
                <span>{result.scores.join(" + ")}</span>
                <p className="font-bold w-14">= {result.total_score}</p>
              </p>
              <ul className="text-sm">
                {result.feedbacks.map((feedback, index) => {
                  if (feedback == "empty") {
                    return (
                      <li className="text-gray-600" key={index}>
                        - No feedback
                      </li>
                    );
                  }
                  if (feedback !== "") {
                    return <li key={index}>- {feedback}</li>;
                  } else return <li key={index}>- No feedback</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
        <Link className="w-full" href="/competitions">
          <button
            type="submit"
            className="w-full bg-violet-500 text-white px-4 py-1.5 rounded-lg mx-auto"
          >
            Back to Home
          </button>
        </Link>
      </main>
    </div>
  );
};

export default ResultPage;

"use client";

import InputScore from "@/components/InputScore";
import { BASE_URL } from "@/constants";
import { CompetitionResponse } from "@/interface/interface";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useMemo, useState } from "react";

const TOTAL_POINTS = 1000;

interface ScoreInput {
  score: number;
  feedback: string;
}
const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params); // Unwrap the Promise
  const router = useRouter();
  const [competition, setCompetition] = useState<CompetitionResponse | null>(
    null,
  );
  const [scores, setScores] = useState<Record<number, ScoreInput>>({});

  const initialScores = useMemo(() => {
    if (!competition) return {};

    const result: Record<number, ScoreInput> = {};
    competition.competitions.participants.forEach((participant) => {
      result[participant.user_id] = { score: 0, feedback: "" };
    });

    return result;
  }, [competition]);

  useEffect(() => {
    if (
      Object.keys(scores).length === 0 &&
      Object.keys(initialScores).length > 0
    ) {
      setScores(initialScores);
    }
  }, [initialScores, scores]);

  useEffect(() => {
    const fetchCompetition = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/competitions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Fetched competition:", data);
      setCompetition(data);
    };

    fetchCompetition();
  }, [id]);

  const remainingPoints = useMemo(() => {
    const used = Object.values(scores).reduce((sum, p) => sum + p.score, 0);
    return TOTAL_POINTS - used;
  }, [scores]);

  const handleScoreChange = (participantId: number, score: number) => {
    setScores((prev) => ({
      ...prev,
      [participantId]: {
        score,
        feedback: prev[participantId]?.feedback ?? "",
      },
    }));
  };

  const handleFeedbackChange = (participantId: number, feedback: string) => {
    setScores((prev) => ({
      ...prev,
      [participantId]: {
        score: prev[participantId]?.score ?? 0,
        feedback,
      },
    }));
  };

  const handleSubmitScores = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const payload = {
      polls: Object.entries(scores).map(([participantId, p]) => ({
        participant_id: Number(participantId),
        score: p.score || 0,
        feedback: p.feedback || "empty",
      })),
    };

    const res = await fetch(
      `${BASE_URL}/competitions/participant/score/bulk-create/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch competition");
    }

    console.log("Poll submitted without embarrassing the codebase");
    router.push(`/competitions/${id}/result`);
    alert("Poll submitted successfully!");
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <main className="bg-white text-black p-3 rounded-lg">
        <h1>{competition?.competitions.title}</h1>
        <p>{competition?.competitions.desc}</p>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl">Polling</h1>
          <h2>
            Remaining Points:{" "}
            <span className="font-bold text-red-600">{remainingPoints}</span>
          </h2>
        </div>
        <form
          onSubmit={handleSubmitScores}
          className="flex flex-col gap-4"
          action=""
          method="post"
        >
          {competition?.competitions.participants.map((participant) => (
            <div key={participant.user_id} className="flex flex-col gap-1">
              <InputScore
                label={participant.username}
                type="number"
                value={scores[participant.user_id]?.score ?? 0}
                onChange={(e) =>
                  handleScoreChange(
                    participant.user_id,
                    Number(e.target.value) || 0,
                  )
                }
                name={"score"}
                id={"score"}
              />

              <textarea
                className="border rounded p-2 text-sm"
                placeholder="Feedback (optional)"
                value={scores[participant.user_id]?.feedback ?? ""}
                onChange={(e) =>
                  handleFeedbackChange(participant.user_id, e.target.value)
                }
              />
            </div>
          ))}

          <div className="mx-auto mb-1">
            <button
              type="submit"
              disabled={remainingPoints !== 0}
              className="bg-violet-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg"
            >
              Submit Poll
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Page;

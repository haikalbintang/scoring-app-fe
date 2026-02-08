"use client";

import { BASE_URL } from "@/constants";
import { CompetitionScore } from "@/interface/interface";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";

type ConfettiPiece = {
  left: string;
  color: string;
  delay: string;
};

/* =======================
   Count-up animation hook
   ======================= */
const useCountUp = (target: number, duration = 400) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
};

const AnimatedScore = ({ value }: { value: number }) => {
  const animated = useCountUp(value);
  return <span className="tabular-nums">{animated}</span>;
};

const Confetti = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = ["#facc15", "#a855f7", "#22c55e", "#ef4444"];

    const generated: ConfettiPiece[] = Array.from({ length: 40 }).map(
      (_, i) => ({
        left: `${Math.random() * 100}%`,
        color: colors[i % colors.length],
        delay: `${Math.random() * 0.5}s`,
      }),
    );

    setPieces(generated);
  }, []);

  return (
    <>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDelay: p.delay,
          }}
        />
      ))}
    </>
  );
};

/* =======================
          Page
   ======================= */
const ResultPage = () => {
  const [results, setResults] = useState<CompetitionScore[]>([]);
  const [openUser, setOpenUser] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/competitions/${id}/scores`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setResults(data);

      if (data.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2200);
      }
    };

    fetchResults();
  }, [id]);

  /* ===== derived values ===== */
  const maxScores = Math.max(0, ...results.map((r) => r.scores.length));

  const columnMaxScores = useMemo(() => {
    return Array.from({ length: maxScores }).map((_, colIndex) =>
      Math.max(
        ...results
          .map((r) => r.scores[colIndex])
          .filter((s): s is number => s !== undefined),
      ),
    );
  }, [results, maxScores]);

  const sortedResults = useMemo(
    () => [...results].sort((a, b) => b.total_score - a.total_score),
    [results],
  );

  const toggleFeedback = (username: string) => {
    setOpenUser((prev) => (prev === username ? null : username));
  };

  const scoreColor = (score?: number) => {
    if (score === undefined) return "text-gray-400";
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const podiumStyle = (rank: number) => {
    if (rank === 0)
      return {
        row: "bg-yellow-50 border-yellow-400",
        badge: "👑",
        name: "text-yellow-700",
        crown: true,
      };

    if (rank === 1)
      return {
        row: "bg-gray-50 border-gray-400",
        badge: "🥈",
        name: "text-gray-700",
        crown: false,
      };

    if (rank === 2)
      return {
        row: "bg-orange-50 border-orange-400",
        badge: "🥉",
        name: "text-orange-700",
        crown: false,
      };

    return { row: "", badge: "", name: "", crown: false };
  };

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center">
      <main className="bg-white text-black p-4 rounded-lg w-full max-w-4xl relative overflow-hidden">
        {showConfetti && <Confetti />}
        <h1 className="text-2xl font-bold mb-4">Results</h1>

        {/* ONE GRID FOR HEADER + ROWS */}
        <div
          className="grid gap-y-2 gap-x-4"
          style={{
            gridTemplateColumns: `1.5fr repeat(${maxScores}, 3rem) 4rem`,
          }}
        >
          {/* ===== HEADER ===== */}
          <div className="font-bold">Participants</div>

          {Array.from({ length: maxScores }).map((_, i) => (
            <div key={i} className="text-center font-bold">
              S{i + 1}
            </div>
          ))}

          <div className="text-right font-bold">Total</div>

          {/* ===== ROWS ===== */}
          {sortedResults.map((result, index) => {
            const podium = podiumStyle(index);
            const maxScore = Math.max(...result.scores);

            return (
              <Fragment key={result.username}>
                {/* Username */}
                <div
                  className={`font-semibold flex items-center gap-2 ${podium.name}`}
                >
                  {podium.badge && (
                    <span
                      className={`text-xl ${
                        podium.crown ? "crown-animate" : ""
                      }`}
                    >
                      {podium.badge}
                    </span>
                  )}

                  <span>{result.username}</span>
                </div>
                {/* Scores */}
                {Array.from({ length: maxScores }).map((_, i) => {
                  const score = result.scores[i];
                  const isMax =
                    score !== undefined && score === columnMaxScores[i];

                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center rounded tabular-nums
                        ${scoreColor(score)}
                        ${isMax ? "bg-green-200 font-bold" : ""}
                      `}
                    >
                      {score !== undefined ? (
                        <AnimatedScore value={score} />
                      ) : (
                        "-"
                      )}
                    </div>
                  );
                })}

                {/* Total */}
                <div className="text-right font-bold">
                  = <AnimatedScore value={result.total_score} />
                </div>

                {/* Feedback (full width) */}
                <div
                  className={`col-span-full text-sm text-gray-700 pb-3 border-b ${podium.row}`}
                >
                  <button
                    onClick={() => toggleFeedback(result.username)}
                    className="text-violet-500 text-xs mb-1 hover:underline"
                  >
                    {openUser === result.username
                      ? "Hide feedback"
                      : "Show feedback"}
                  </button>

                  {openUser === result.username && (
                    <ul className="list-disc ml-4 mt-1">
                      {result.feedbacks.map((feedback, index) => (
                        <li key={index}>
                          {feedback && feedback !== "empty"
                            ? feedback
                            : "No feedback"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>

        <Link href="/competitions">
          <button className="mt-4 w-full bg-violet-500 text-white px-4 py-1.5 rounded-lg">
            Back to Home
          </button>
        </Link>
      </main>
    </div>
  );
};

export default ResultPage;

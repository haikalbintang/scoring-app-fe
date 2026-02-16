"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typography-h4";
import { CompetitionScore } from "@/interface/interface";
import { getCompetitionScores } from "@/services/competition.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    let frameId: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return value;
};

const AnimatedScore = ({ value }: { value: number }) => {
  const animated = useCountUp(value);
  return <span className="tabular-nums">{animated}</span>;
};

const Confetti = () => {
  const [pieces] = useState<ConfettiPiece[]>(() => {
    const colors = ["#facc15", "#a855f7", "#22c55e", "#ef4444"];

    return Array.from({ length: 40 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      color: colors[i % colors.length],
      delay: `${Math.random() * 0.5}s`,
    }));
  });

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
    if (!id) return;

    const fetchResults = async () => {
      try {
        const { data } = await getCompetitionScores(id);

        const safeData = Array.isArray(data) ? data : [];
        setResults(safeData);

        if (safeData.length > 0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2200);
        }
      } catch (error) {
        console.error("Failed to fetch results:", error);
        setResults([]);
      }
    };

    fetchResults();
  }, [id]);

  /* ===== derived values ===== */

  const maxScores = useMemo(() => {
    if (!results.length) return 0;
    return Math.max(...results.map((r) => r.scores?.length ?? 0));
  }, [results]);

  const columnMaxScores = useMemo(() => {
    if (!results.length || maxScores === 0) return [];

    return Array.from({ length: maxScores }).map((_, colIndex) => {
      const values = results
        .map((r) => r.scores?.[colIndex])
        .filter((s): s is number => typeof s === "number");

      return values.length ? Math.max(...values) : 0;
    });
  }, [results, maxScores]);

  const sortedResults = useMemo(() => {
    return [...results].sort(
      (a, b) => (b.total_score ?? 0) - (a.total_score ?? 0),
    );
  }, [results]);

  const toggleFeedback = (username: string) => {
    setOpenUser((prev) => (prev === username ? null : username));
  };

  const scoreColor = (score?: number) => {
    if (typeof score !== "number") return "text-gray-400";
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
    <main className="bg-white p-6 rounded-2xl w-full max-w-md shadow-md dark:bg-gray-800">
      <Card className="w-full max-w-xl shadow-md rounded-2xl">
        <CardContent className="px-8 relative overflow-hidden">
          {showConfetti && <Confetti />}

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <TypographyH4>Competition Results</TypographyH4>
            <div className="flex">
              <Link href="/competitions">
                <ChevronLeft className="w-7 h-7" />
              </Link>
              <Link href="/competitions">
                <ChevronRight className="w-7 h-7" />
              </Link>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="text-muted-foreground text-center py-10">
              No results available.
            </div>
          ) : (
            <div
              className="grid gap-y-3 gap-x-4 text-sm"
              style={{
                gridTemplateColumns: `1.5fr repeat(${maxScores}, 3rem) 4rem`,
              }}
            >
              {/* HEADER */}
              <div className="font-semibold text-muted-foreground">
                Participants
              </div>

              {Array.from({ length: maxScores }).map((_, i) => (
                <div
                  key={i}
                  className="text-center font-semibold text-muted-foreground"
                >
                  S{i + 1}
                </div>
              ))}

              <div className="text-right font-semibold text-muted-foreground">
                Total
              </div>

              {/* ROWS */}
              {sortedResults.map((result, index) => {
                const podium = podiumStyle(index);

                return (
                  <>
                    {/* Username */}
                    <div
                      className={`font-medium flex items-center gap-2 ${
                        podium.name || ""
                      }`}
                    >
                      {podium.badge && (
                        <span className="text-lg">{podium.badge}</span>
                      )}
                      {result.username}
                    </div>

                    {/* Scores */}
                    {Array.from({ length: maxScores }).map((_, i) => {
                      const score = result.scores?.[i];
                      const isMax =
                        typeof score === "number" &&
                        score === columnMaxScores[i];

                      return (
                        <div
                          key={i}
                          className={`flex items-center justify-center rounded-md tabular-nums
                          ${
                            isMax
                              ? "bg-green-100 font-semibold text-green-700"
                              : "text-foreground"
                          }
                        `}
                        >
                          {typeof score === "number" ? (
                            <AnimatedScore value={score} />
                          ) : (
                            "-"
                          )}
                        </div>
                      );
                    })}

                    {/* Total */}
                    <div className="text-right font-semibold tabular-nums">
                      <AnimatedScore value={result.total_score ?? 0} />
                    </div>

                    {/* Feedback */}
                    <div className="col-span-full pb-4 border-b border-muted">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-0 text-violet-500"
                        onClick={() => toggleFeedback(result.username)}
                      >
                        {openUser === result.username
                          ? "Hide feedback"
                          : "Show feedback"}
                      </Button>

                      {openUser === result.username && (
                        <ul className="mt-2 ml-4 list-disc text-sm text-muted-foreground">
                          {(result.feedbacks ?? []).map((feedback, index) => (
                            <li key={index}>
                              {feedback && feedback !== "empty"
                                ? feedback
                                : "No feedback"}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-8">
            <Link href="/competitions">
              <Button
                className="w-full bg-linear-to-br from-[#A3162E] to-[#1B3691]
              text-white shadow-md hover:shadow-lg
              hover:opacity-95 transition-all duration-200"
              >
                Back to Competitions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ResultPage;

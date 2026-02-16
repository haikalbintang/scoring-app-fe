"use client";

import { api } from "@/lib/api";
import { Competition } from "@/interface/interface";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

import { Card, CardContent } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typography-h4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface ScoreInput {
  score: number;
  feedback: string;
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [scores, setScores] = useState<Record<number, ScoreInput>>({});

  const totalPoints = competition?.max_score ?? 0;
  /* ---------------- Fetch Competition ---------------- */

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const res = await api.get(`/competitions/${id}`);
        console.log("Fetched competition:", res.data);
        setCompetition(res.data);
      } catch (error) {
        toast.error("Failed to fetch competition");
      }
    };

    if (id) fetchCompetition();
  }, [id]);

  /* ---------------- Initialize Scores ---------------- */

  useEffect(() => {
    if (!competition) return;

    const result: Record<number, ScoreInput> = {};

    competition.participants.forEach((p) => {
      if (p.id !== user?.id) {
        result[p.id] = { score: 0, feedback: "" };
      }
    });

    setScores(result);
  }, [competition, user]);

  /* ---------------- Remaining Points ---------------- */

  const remainingPoints = useMemo(() => {
    const used = Object.values(scores).reduce((sum, p) => sum + p.score, 0);
    return totalPoints - used;
  }, [scores, totalPoints]);

  /* ---------------- Handlers ---------------- */

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

    if (remainingPoints !== 0) {
      toast.error(`You must distribute all ${totalPoints} points`);
      return;
    }

    const payload = {
      polls: Object.entries(scores).map(([participantId, p]) => ({
        participant_id: Number(participantId),
        score: p.score,
        feedback: p.feedback || "empty",
      })),
    };

    console.log("Submitting payload:", payload);

    try {
      await api.post(
        `/competitions/participant/score/bulk-create/${id}`,
        payload,
      );

      toast.success("Poll submitted successfully 🎉");
      router.push(`/competitions/${id}/result`);
    } catch (error) {
      toast.error("Failed to submit poll");
    }
  };

  /* ---------------- UI ---------------- */

  if (!competition || loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <main className="bg-white p-6 rounded-2xl w-full max-w-md shadow-md dark:bg-gray-800">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="px1000-6">
          <TypographyH4>{competition.title}</TypographyH4>

          <p className="text-muted-foreground mt-1">
            {competition.description}
          </p>

          <div className="flex justify-between items-center mt-6">
            <h2 className="text-lg font-semibold">Polling</h2>

            <Badge
              variant={remainingPoints === 0 ? "secondary" : "destructive"}
              className="text-sm"
            >
              Remaining: {remainingPoints}
            </Badge>
          </div>

          <form
            onSubmit={handleSubmitScores}
            className="flex flex-col gap-6 mt-6"
          >
            {competition.participants
              .filter((p) => p.id !== user.id)
              .map((participant) => (
                <div
                  key={participant.id}
                  className="p-4 rounded-xl border space-y-3"
                >
                  <div className="font-medium">{participant.username}</div>

                  <Input
                    type="number"
                    min={0}
                    max={
                      Number(scores[participant.id]?.score || 0) +
                      remainingPoints
                    }
                    value={scores[participant.id]?.score ?? 0}
                    onChange={(e) =>
                      handleScoreChange(
                        participant.id,
                        Number(e.target.value) || 0,
                      )
                    }
                  />

                  <Textarea
                    placeholder="Feedback (optional)"
                    value={scores[participant.id]?.feedback ?? ""}
                    onChange={(e) =>
                      handleFeedbackChange(participant.id, e.target.value)
                    }
                  />
                </div>
              ))}

            <Button
              type="submit"
              disabled={remainingPoints !== 0}
              className="w-full bg-linear-to-br from-[#A3162E] to-[#1B3691]
              text-white shadow-md hover:shadow-lg
              hover:opacity-95 transition-all duration-200"
            >
              Submit Poll
            </Button>

            {remainingPoints !== 0 && (
              <p className="text-sm text-destructive text-center">
                You must distribute all {totalPoints} points.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Page;

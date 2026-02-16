"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/ui/typography-h4";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SquareDashedMousePointer } from "lucide-react";

interface Competition {
  id: number;
  title: string;
  desc: string;
  creator_id: number;
}

interface CompetitionResponse {
  voted: Competition[];
  not_voted: Competition[];
}

const Page = () => {
  const [competitions, setCompetitions] = useState<CompetitionResponse>({
    voted: [],
    not_voted: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await api.get("/user/my-polls");
        setCompetitions(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

  if (!competitions) {
    return (
      <div className="text-center mt-10">Failed to load competitions.</div>
    );
  }

  const { voted, not_voted } = competitions;

  return (
    <main className="m-6 bg-white p-6 rounded-2xl w-full max-w-md shadow-md dark:bg-gray-800">
      <Card className="w-full max-w-2xl shadow-md rounded-2xl">
        <CardContent className="px-6">
          <TypographyH4>All Competitions</TypographyH4>

          {/* Need Your Vote */}
          {not_voted?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Need your vote:</h2>
              <div className="flex flex-col gap-2">
                {not_voted.map((c) => (
                  <Link key={c.id} href={`/competitions/${c.id}`}>
                    <div className="px-3 pt-1.5 pb-2 rounded-lg border hover:bg-muted transition cursor-pointer flex items-center">
                      <p className="font-medium text-primary">{c.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Already Polled */}
          {voted?.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold mb-3">You have polled:</h2>
                <SquareDashedMousePointer
                  className="text-muted-foreground mr-2 pb-0.5"
                  size={22}
                />
              </div>
              <div className="flex flex-col gap-2">
                {voted.map((c) => (
                  <Link key={c.id} href={`/competitions/${c.id}/result`}>
                    <div className="group flex items-center justify-between px-3 py-2 rounded-lg border bg-muted/40 hover:bg-muted transition">
                      <p className="font-medium">
                        {c.title}
                        <span className="text-sm text-muted-foreground ml-2">
                          (polled)
                        </span>
                      </p>{" "}
                      <p
                        className="ml-3 bg-linear-to-br from-[#A3162E] to-[#1B3691] 
  bg-clip-text text-transparent 
  italic font-semibold 
  group-hover:scale-105 transition-transform duration-200 text-sm"
                      >
                        View result →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Create Poll Button */}
          <div className="mt-8">
            <Link href="/competitions/create">
              <Button
                className="w-full bg-linear-to-br from-[#A3162E] to-[#1B3691]
                text-white shadow-md hover:shadow-lg
                hover:opacity-95 transition-all duration-200"
              >
                Create a Poll
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Page;

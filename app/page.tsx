"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/ui/typography-h4";

const LandingPage = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-20">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Competition Scoring Platform
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create competitions, manage participants, and calculate scores
              with clarity and precision.
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => router.push("/competitions/create")}
              className="bg-linear-to-br from-[#A3162E] to-[#1B3691]
              text-white shadow-md hover:shadow-lg
              hover:opacity-95 transition-all duration-200 px-6"
            >
              Create Competition
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/competitions")}
              className="rounded-xl"
            >
              View Competitions
            </Button>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex flex-col gap-4">
              <TypographyH4>Simple Setup</TypographyH4>
              <p className="text-muted-foreground text-sm">
                Quickly create competitions with custom total points and
                descriptions.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex flex-col gap-4">
              <TypographyH4>Fair Scoring</TypographyH4>
              <p className="text-muted-foreground text-sm">
                Score participants transparently and keep track of every
                evaluation.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex flex-col gap-4">
              <TypographyH4>Clean Dashboard</TypographyH4>
              <p className="text-muted-foreground text-sm">
                Designed with clarity in mind — no clutter, just focus on
                results.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* HOW IT WORKS */}
        <section className="flex flex-col gap-8">
          <TypographyH4>How It Works</TypographyH4>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold">1. Create Competition</h3>
                <p className="text-sm text-muted-foreground">
                  Define title, description, and total scoring points.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold">2. Add Participants</h3>
                <p className="text-sm text-muted-foreground">
                  Select users who will join the competition.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold">3. Submit Scores</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluate fairly and generate rankings automatically.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="flex justify-center">
          <Card className="rounded-2xl shadow-lg max-w-3xl w-full bg-gradient-to-br from-[#A3162E]/10 to-[#1B3691]/10">
            <CardContent className="p-10 flex flex-col items-center text-center gap-6">
              <h2 className="text-2xl font-semibold">
                Ready to organize your next competition?
              </h2>

              <Button
                onClick={() => router.push("/competitions/create")}
                className="bg-linear-to-br from-[#A3162E] to-[#1B3691]
                text-white shadow-md hover:shadow-lg
                hover:opacity-95 transition-all duration-200 px-8"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* FOOTER */}
        <footer className="pt-10 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Competition Platform. Built with clarity.
        </footer>
      </div>
    </main>
  );
};

export default LandingPage;

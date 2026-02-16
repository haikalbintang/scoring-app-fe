"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/ui/typography-h4";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";

const CreateCompetitionPage = () => {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [totalPoints, setTotalPoints] = React.useState(1000);

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/competitions/create", {
        title,
        description: description,
        max_score: totalPoints,
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Competition created successfully 🎉");
      router.push(`/competitions/${data.id}/users`);
    },
    onError: () => {
      toast.error("Failed to create competition. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <main className="bg-white p-6 rounded-2xl w-full max-w-md shadow-md dark:bg-gray-800">
      <Card className="w-full max-w-xl shadow-md rounded-2xl">
        <CardContent className="px-6">
          <TypographyH4>Create a New Competition</TypographyH4>

          <form onSubmit={handleSubmit} className="flex flex-col mt-6 gap-5">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="Math Olympiad 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input
                  id="description"
                  placeholder="Annual math scoring competition"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="total_points">Total Points</FieldLabel>
                <Input
                  id="total_points"
                  type="number"
                  value={totalPoints}
                  onChange={(e) => setTotalPoints(Number(e.target.value) || 0)}
                />
                <FieldDescription>Default is 1000 points.</FieldDescription>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-linear-to-br from-[#A3162E] to-[#1B3691]
              text-white shadow-md hover:shadow-lg
              hover:opacity-95 transition-all duration-200"
            >
              {createMutation.isPending ? "Creating..." : "Create Competition"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateCompetitionPage;

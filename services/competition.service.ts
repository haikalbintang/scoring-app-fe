import { api } from "@/lib/api";

export const getCompetitionScores = (id: string) =>
  api.get(`/competitions/${id}/scores`);

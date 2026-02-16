export interface CompetitionParticipant {
  id: number;
  user_id: number;
  username: string;
}

export interface Competition {
  id: number;
  title: string;
  description: string;
  max_score: number;
  participants: CompetitionParticipant[];
}

export interface CompetitionResponse {
  competitions: Competition;
}

export interface CompetitionScore {
  id: number;
  username: string;
  total_score: number;
  scores: number[];
  feedbacks: string[];
}

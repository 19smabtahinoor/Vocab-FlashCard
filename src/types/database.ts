export interface Flashcard {
  id: string;
  user_id: string;
  word: string;
  meaning: string;
  example_sentence: string | null;
  created_at: string;
  last_reviewed: string;
  review_count: number;
}
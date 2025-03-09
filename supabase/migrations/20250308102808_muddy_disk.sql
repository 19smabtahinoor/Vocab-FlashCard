/*
  # Create flashcards table for SAT vocabulary

  1. New Tables
    - `flashcards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `word` (text)
      - `meaning` (text)
      - `example_sentence` (text)
      - `created_at` (timestamp)
      - `last_reviewed` (timestamp)
      - `review_count` (integer)

  2. Security
    - Enable RLS on `flashcards` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  word text NOT NULL,
  meaning text NOT NULL,
  example_sentence text,
  created_at timestamptz DEFAULT now(),
  last_reviewed timestamptz DEFAULT now(),
  review_count integer DEFAULT 0,
  CONSTRAINT word_unique UNIQUE (user_id, word)
);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own flashcards"
  ON flashcards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own flashcards"
  ON flashcards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards"
  ON flashcards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards"
  ON flashcards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
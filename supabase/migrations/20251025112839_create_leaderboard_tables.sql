/*
  # Current Logic IEEE Quiz Event - Leaderboard Schema

  ## Overview
  Creates the database structure for managing real-time quiz leaderboard data.

  ## New Tables
  
  ### `participants`
  Stores participant information and scores for the quiz event.
  
  - `id` (uuid, primary key) - Unique identifier for each participant
  - `name` (text, required) - Participant's full name
  - `score` (integer, default 0) - Current quiz score
  - `time_taken` (integer, nullable) - Time taken in seconds (optional)
  - `attempts` (integer, default 1) - Number of attempts made
  - `department` (text, nullable) - Department/category for filtering
  - `rank` (integer, nullable) - Current rank position
  - `previous_rank` (integer, nullable) - Previous rank for animation detection
  - `created_at` (timestamptz) - Registration timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ## Security
  - Enable RLS on `participants` table
  - Add policy for public read access (leaderboard is public)
  - Add policy for authenticated insert/update (for admin operations)
  
  ## Indexes
  - Index on `score` for efficient sorting
  - Index on `rank` for leaderboard display
  - Index on `name` for search functionality
*/

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  score integer DEFAULT 0,
  time_taken integer,
  attempts integer DEFAULT 1,
  department text,
  rank integer,
  previous_rank integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Public read access for leaderboard display
CREATE POLICY "Anyone can view leaderboard"
  ON participants FOR SELECT
  USING (true);

-- Authenticated users can insert participants (for admin)
CREATE POLICY "Authenticated users can insert participants"
  ON participants FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update participants (for admin)
CREATE POLICY "Authenticated users can update participants"
  ON participants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_participants_score ON participants(score DESC);
CREATE INDEX IF NOT EXISTS idx_participants_rank ON participants(rank ASC);
CREATE INDEX IF NOT EXISTS idx_participants_name ON participants(name);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on row updates
CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for demonstration
INSERT INTO participants (name, score, time_taken, department, rank, previous_rank) VALUES
  ('Alice Johnson', 950, 180, 'Computer Science', 1, 2),
  ('Bob Smith', 920, 195, 'Electrical Engineering', 2, 1),
  ('Carol Williams', 890, 170, 'Computer Science', 3, 3),
  ('David Brown', 860, 210, 'Mechanical Engineering', 4, 5),
  ('Emma Davis', 850, 188, 'Computer Science', 5, 4),
  ('Frank Miller', 820, 225, 'Electrical Engineering', 6, 6),
  ('Grace Wilson', 800, 200, 'Computer Science', 7, 8),
  ('Henry Taylor', 780, 240, 'Mechanical Engineering', 8, 7),
  ('Ivy Anderson', 750, 195, 'Electrical Engineering', 9, 9),
  ('Jack Thomas', 720, 250, 'Computer Science', 10, 10)
ON CONFLICT DO NOTHING;
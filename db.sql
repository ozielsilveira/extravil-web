-- Create the participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  lot TEXT NOT NULL,
  checkedin BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all access to authenticated users"
ON participants
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON participants
FOR SELECT
TO public
USING (true);

# Events Database Setup

Run these SQL commands in your Supabase SQL editor to set up the events functionality.

## 1. Create Events Table

```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'event',
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  registration_url TEXT,
  is_published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);
```

## 2. Create Events Categories Table

```sql
CREATE TABLE events_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. Create Updated At Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 4. Enable Row Level Security (RLS)

```sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE events_categories ENABLE ROW LEVEL SECURITY;
```

## 5. Create RLS Policies

### Events Table Policies

```sql
-- Allow public read access to published events
CREATE POLICY "Public can view published events" ON events
  FOR SELECT USING (is_published = true);

-- Allow authenticated users to create events
CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update events
CREATE POLICY "Authenticated users can update events" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete events
CREATE POLICY "Authenticated users can delete events" ON events
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Events Categories Table Policies

```sql
-- Allow public read access to categories
CREATE POLICY "Public can view event categories" ON events_categories
  FOR SELECT USING (true);

-- Allow authenticated users to manage categories
CREATE POLICY "Authenticated users can manage event categories" ON events_categories
  FOR ALL USING (auth.role() = 'authenticated');
```

## 6. Insert Default Categories

```sql
INSERT INTO events_categories (name, color) VALUES
  ('workshop', 'bg-blue-100 text-blue-800'),
  ('hackathon', 'bg-purple-100 text-purple-800'),
  ('networking', 'bg-green-100 text-green-800'),
  ('competition', 'bg-red-100 text-red-800'),
  ('bootcamp', 'bg-orange-100 text-orange-800'),
  ('club-fair', 'bg-indigo-100 text-indigo-800'),
  ('club-icon', 'bg-pink-100 text-pink-800'),
  ('event', 'bg-gray-100 text-gray-800');
```

## 7. Create Indexes for Better Performance

```sql
CREATE INDEX idx_events_published ON events(is_published, published_at DESC);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_featured ON events(featured);
CREATE INDEX idx_events_date ON events(date);
```

## 8. Sample Event Data (Optional)

```sql
INSERT INTO events (
  title,
  description,
  content,
  date,
  time,
  location,
  category,
  max_attendees,
  registration_url,
  is_published,
  featured
) VALUES (
  'USLS Club Fair 2025',
  'Learn more about our club and engage in some fun activities that we have prepared.',
  '<h2>USLS Club Fair 2025</h2><p>Join us for an exciting showcase of all the clubs and organizations at the University of St. La Salle. The Computer Science Society will be there with interactive demos, games, and information about our upcoming events.</p><h3>What to Expect:</h3><ul><li>Live coding demonstrations</li><li>Interactive games and challenges</li><li>Meet current CSS members</li><li>Learn about upcoming workshops and events</li><li>Free giveaways and prizes</li></ul>',
  '2025-07-29',
  '8:00 AM - 5:00 PM',
  'USLS 2nd Floor Library Lobby',
  'club-fair',
  200,
  'https://forms.gle/example',
  true,
  true
);
```

## Verification

After running these commands, you should be able to:

1. Query the `events` table to see published events
2. Query the `events_categories` table to see available categories
3. Use the admin interface to create, edit, and delete events
4. View events on the public events page

The events system is now ready to use! 
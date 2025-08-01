# Features Database Setup

Run these SQL commands in your Supabase SQL editor to set up the features system:

## 1. Create features table

```sql
CREATE TABLE features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  category TEXT NOT NULL DEFAULT 'project',
  author TEXT,
  technologies TEXT[],
  is_published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);
```

## 2. Create features categories table

```sql
CREATE TABLE features_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. Insert default categories

```sql
INSERT INTO features_categories (name, color) VALUES
  ('project', '#3B82F6'),
  ('game', '#10B981'),
  ('web-app', '#8B5CF6'),
  ('mobile-app', '#F59E0B'),
  ('ai-ml', '#EF4444'),
  ('research', '#6B7280');
```

## 4. Enable Row Level Security (RLS)

```sql
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE features_categories ENABLE ROW LEVEL SECURITY;
```

## 5. Create RLS policies

### Features table policies
```sql
-- Allow public read access to published features
CREATE POLICY "Public can view published features" ON features
  FOR SELECT USING (is_published = true);

-- Allow authenticated users to create features
CREATE POLICY "Authenticated users can create features" ON features
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own features
CREATE POLICY "Users can update their own features" ON features
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow users to delete their own features
CREATE POLICY "Users can delete their own features" ON features
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Features categories table policies
```sql
-- Allow public read access to categories
CREATE POLICY "Public can view categories" ON features_categories
  FOR SELECT USING (true);

-- Allow authenticated users to manage categories
CREATE POLICY "Authenticated users can manage categories" ON features_categories
  FOR ALL USING (auth.role() = 'authenticated');
```

## 6. Create updated_at trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_features_updated_at 
    BEFORE UPDATE ON features 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
``` 
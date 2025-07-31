# News Section Setup Guide

This guide will help you set up the database tables for the news section.

## Database Tables Setup

Run the following SQL commands in your Supabase SQL editor:

### 1. Create News Articles Table

```sql
-- Create news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'announcement',
  is_published BOOLEAN DEFAULT false,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_articles_published ON news_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_created_at ON news_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published articles
CREATE POLICY "Public can view published articles" ON news_articles
  FOR SELECT USING (is_published = true);

-- Create policies for authenticated users to manage articles
CREATE POLICY "Authenticated users can manage articles" ON news_articles
  FOR ALL USING (auth.role() = 'authenticated');
```

### 2. Create News Categories Table (Optional)

```sql
-- Create news_categories table for better category management
CREATE TABLE IF NOT EXISTS news_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO news_categories (name, color) VALUES
  ('announcement', '#3B82F6'),
  ('event', '#10B981'),
  ('update', '#8B5CF6'),
  ('feature', '#F59E0B'),
  ('news', '#6B7280')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view categories" ON news_categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage categories" ON news_categories
  FOR ALL USING (auth.role() = 'authenticated');
```

## Features

The news section includes the following features:

### Public Features
- **News Listing Page** (`/news`) - Browse all published articles
- **Article Detail Page** (`/news/[id]`) - Read individual articles
- **Search and Filter** - Search articles by title/content and filter by category
- **Responsive Design** - Works on all devices
- **Share Functionality** - Share articles via native sharing or copy link

### Admin Features
- **News Dashboard** (`/admin/news`) - Manage all articles
- **Create Articles** (`/admin/news/new`) - Write new articles
- **Edit Articles** (`/admin/news/[id]/edit`) - Update existing articles
- **Publish/Unpublish** - Control article visibility
- **Delete Articles** - Remove articles permanently
- **Rich Text Editor** - Support for HTML formatting
- **Image Support** - Add thumbnail images via URL
- **Category Management** - Organize articles by categories
- **Author Attribution** - Credit article authors

### Article Properties
- **Title** - Article headline
- **Content** - Main article text (supports HTML)
- **Excerpt** - Brief summary (optional)
- **Thumbnail** - Featured image URL (optional)
- **Category** - Article classification (announcement, event, update, feature, news)
- **Author** - Article author name (optional)
- **Publish Status** - Draft or published
- **Timestamps** - Created, updated, and published dates

## Usage

1. **Create Articles**: Go to `/admin/news/new` to create new articles
2. **Manage Articles**: Use `/admin/news` to view, edit, publish, or delete articles
3. **View Articles**: Visit `/news` to see published articles
4. **Read Articles**: Click on any article to read the full content

## Design Features

- **Card Layout** - Clean, modern card design for article listings
- **Category Badges** - Color-coded category indicators
- **Responsive Grid** - Adapts to different screen sizes
- **Hover Effects** - Interactive elements with smooth transitions
- **Loading States** - Proper loading indicators
- **Error Handling** - Graceful error messages
- **Search & Filter** - Easy content discovery

The news section follows the same design language as the rest of the website, using consistent colors, typography, and spacing patterns. 
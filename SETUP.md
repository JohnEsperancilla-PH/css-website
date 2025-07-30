# Form System Setup Guide

This guide will help you set up your custom Google Forms-inspired system with Supabase as the database.

## 1. Database Setup (Supabase)

### Why Supabase?
- **Free Tier**: Generous free tier with 50,000 monthly active users
- **Easy Setup**: Simple to configure and maintain
- **Real-time**: Built-in real-time subscriptions
- **TypeScript Support**: Excellent TypeScript integration
- **Dashboard**: Built-in admin dashboard for database management

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/in
2. Click "New Project"
3. Choose your organization and give your project a name
4. Set a strong database password
5. Choose a region closest to your users
6. Wait for the project to be created (2-3 minutes)

### Step 2: Get Your Credentials

1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy your "Project URL" and "anon/public" key
3. Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Create Database Tables

In your Supabase dashboard, go to "SQL Editor" and run this SQL:

```sql
-- Create forms table
CREATE TABLE forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_responses table
CREATE TABLE form_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  responses JSONB NOT NULL DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT
);

-- Create indexes for better performance
CREATE INDEX forms_created_at_idx ON forms(created_at);
CREATE INDEX forms_is_active_idx ON forms(is_active);
CREATE INDEX form_responses_form_id_idx ON form_responses(form_id);
CREATE INDEX form_responses_submitted_at_idx ON form_responses(submitted_at);

-- Enable Row Level Security (RLS)
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to active forms
CREATE POLICY "Allow public read access to active forms" ON forms
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public insert to form_responses" ON form_responses
  FOR INSERT WITH CHECK (true);

-- Create policies for admin access (you'll need to customize this based on your auth)
CREATE POLICY "Allow full access to forms for admin" ON forms
  FOR ALL USING (true);

CREATE POLICY "Allow full access to form_responses for admin" ON form_responses
  FOR ALL USING (true);
```

**Note**: The admin policies above allow full access to everyone. In production, you should implement proper authentication and restrict access to actual admin users.

## 2. Project Setup

### Install Dependencies

The required dependencies should already be installed if you ran the setup, but if not:

```bash
npm install @supabase/supabase-js react-hook-form @hookform/resolvers zod
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

## 3. Usage

### Admin Dashboard
- Visit `/admin` to access the form management dashboard
- Create new forms with `/admin/forms/new`
- Edit existing forms
- View form responses and export to CSV

### Public Forms
- Active forms can be accessed at `/forms/[form-id]`
- One question per page interface
- Progress tracking
- Response validation

### Features Included

✅ **Form Builder**
- Drag-and-drop question reordering
- Multiple question types (text, email, multiple choice, etc.)
- Required field validation
- Option management for choice questions

✅ **Form Viewer**
- Clean, one-question-per-page interface
- Progress bar
- Validation before allowing next question
- Success confirmation

✅ **Admin Dashboard**
- Overview of all forms
- Form status management (active/draft)
- Response analytics
- CSV export functionality

✅ **Question Types**
- Short text
- Long text (textarea)
- Email with validation
- Number input
- Multiple choice (radio buttons)
- Checkboxes (multiple selection)
- Star rating (1-5 stars)

## 4. Customization

### Adding New Question Types

1. Update the `QuestionType` union in `lib/types/forms.ts`
2. Add the new type to `questionTypes` array in `components/forms/form-builder.tsx`
3. Add rendering logic in `components/forms/question-renderer.tsx`

### Styling

The system uses Tailwind CSS with a clean, minimal design. All components are fully customizable through the Tailwind classes.

### Database Modifications

If you need additional fields:
1. Update the database schema in Supabase
2. Update the TypeScript types in `lib/types/forms.ts`
3. Update the Supabase client types in `lib/supabase/client.ts`

## 5. Production Considerations

### Security
- Implement proper authentication for admin routes
- Update RLS policies to restrict admin access
- Add rate limiting for form submissions
- Validate and sanitize all inputs

### Performance
- Add caching for form data
- Implement pagination for large response datasets
- Consider CDN for static assets

### Monitoring
- Set up error tracking (Sentry, etc.)
- Monitor database performance
- Track form submission rates

## 6. Alternative Database Options

While we recommend Supabase, you can also use:

- **PlanetScale**: MySQL-compatible with generous free tier
- **Railway**: PostgreSQL with simple deployment
- **Vercel Postgres**: Integrated with Vercel deployment
- **Firebase Firestore**: NoSQL option with real-time features

Each would require updating the database client and queries accordingly.

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure database tables were created successfully
4. Check Supabase logs in the dashboard
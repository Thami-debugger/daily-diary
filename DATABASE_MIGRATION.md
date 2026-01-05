# Database Migration Instructions for Multi-User Support

## Overview
To enable multi-user authentication, you need to update your Supabase database to:
1. Add a `user_id` column to the `entries` table
2. Enable Row Level Security (RLS)
3. Create policies so users can only see their own entries

## Step-by-Step Instructions

### 1. Open Supabase SQL Editor
- Go to your Supabase project dashboard
- Navigate to the SQL Editor (left sidebar)
- Create a new query

### 2. Run the Following SQL Commands

```sql
-- Step 1: Add user_id column to entries table
ALTER TABLE entries 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Step 2: Update the unique constraint to include user_id
-- (This allows multiple users to have entries for the same date)
ALTER TABLE entries 
DROP CONSTRAINT IF EXISTS entries_date_key;

ALTER TABLE entries 
ADD CONSTRAINT entries_date_user_id_key UNIQUE (date, user_id);

-- Step 3: Enable Row Level Security
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policy for users to see only their own entries
CREATE POLICY "Users can view their own entries"
ON entries FOR SELECT
USING (auth.uid() = user_id);

-- Step 5: Create policy for users to insert their own entries
CREATE POLICY "Users can insert their own entries"
ON entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Step 6: Create policy for users to update their own entries
CREATE POLICY "Users can update their own entries"
ON entries FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Step 7: Create policy for users to delete their own entries
CREATE POLICY "Users can delete their own entries"
ON entries FOR DELETE
USING (auth.uid() = user_id);
```

### 3. Enable Email Authentication in Supabase
- Go to Authentication → Providers in your Supabase dashboard
- Make sure Email provider is enabled
- Configure email templates if needed (optional)

### 4. Test the Setup
1. Run your app with `npm run dev`
2. Try signing up with a new email
3. Create some diary entries
4. Sign out and create another account
5. Verify that each user only sees their own entries

## Important Notes

- **Existing Data**: If you have existing entries in your database, they will have `NULL` for `user_id`. These entries won't be visible to any user due to RLS policies. You can either:
  - Delete them with: `DELETE FROM entries WHERE user_id IS NULL;`
  - Or assign them to a specific user (not recommended for production)

- **Email Confirmation**: By default, Supabase requires email confirmation. Users will need to click a link in their email to verify their account before they can log in.

- **Security**: Row Level Security ensures that even if someone tries to manipulate the frontend code, they can only access their own data at the database level.

## Troubleshooting

### "Error saving!" when trying to create entries
- Make sure the SQL migration ran successfully
- Check that RLS policies were created properly
- Verify that `user_id` column exists in the entries table

### Can't see any entries after migration
- This is expected if you had entries before migration
- Old entries have `NULL` user_id and won't match any user
- Create new entries after signing in to test

### Email confirmation not working
- Check Supabase Authentication → Email Templates
- For development, you can disable email confirmation in Authentication → Providers → Email → "Confirm email"

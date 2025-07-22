-- Add missing columns to the budgets table
ALTER TABLE budgets 
ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE,
ADD COLUMN recurring_type VARCHAR(20) CHECK (recurring_type IN ('weekly', 'monthly', 'yearly'));

-- Update the RLS policy to allow these new columns
-- No additional policy changes needed as they're just adding columns to existing table

-- Optional: Add some sample data or update existing budgets if needed
-- UPDATE budgets SET is_recurring = FALSE WHERE is_recurring IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'budgets' 
ORDER BY ordinal_position;

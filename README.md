# Supabase Check-in App

This is a simple check-in application built with Next.js, TypeScript, and Supabase.

## Database Setup

To set up the database, you need to run the SQL script provided in `db.sql`.

### Steps:

1.  **Go to your Supabase project.**
2.  **Navigate to the SQL Editor.**
3.  **Copy the content of `db.sql`**
4.  **Paste the SQL script into the SQL Editor.**
5.  **Click on "Run".**

This will create the `participants` table with the necessary columns and policies.

## Running the Application

1.  **Install the dependencies:**
    ```bash
    npm install
    ```
2.  **Create a `.env.local` file with your Supabase credentials:**
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

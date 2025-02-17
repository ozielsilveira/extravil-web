import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error("Invalid NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl)
  throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
supabase
  .from("participants")
  .select("*")
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error("Error connecting to Supabase:", error)
    } else {
      console.log("Successfully connected to Supabase")
    }
  })

export async function signInWithEmail(email: string, password: string) {
  const { data: user, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error("Error signing in:", error)
  }

  return { user, error }
}
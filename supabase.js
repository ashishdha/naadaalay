/* supabase.js */

const SUPABASE_URL = "https://cxjfqwnmabyabhjhadjy.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4amZxd25tYWJ5YWJoamhhZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Njc2NDUsImV4cCI6MjA3MTU0MzY0NX0.qbI-CU_wgAioBihGx54RXpr4cBryhzIjc4C8iT5YAX0";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function fetchRaags() {
  const { data, error } = await supabaseClient
    .from("raags")
    .select("*");
  if (error) throw error;
  return data;
}

async function fetchThaats() {
  const { data, error } = await supabaseClient
    .from("thaat")
    .select("*");
  if (error) throw error;
  return data;
}

window.DB = {
  fetchRaags,
  fetchThaats
};


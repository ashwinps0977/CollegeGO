import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://utolbywvbxjcixmuxkkr.supabase.co"; // Replace with your actual URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0b2xieXd2YnhqY2l4bXV4a2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Njg1NTAsImV4cCI6MjA1ODU0NDU1MH0.jnBS6cbviTB-Q1_L1z2o7W-fhW242GHXjw1SZzYo4mU"; // Replace with your actual key

export const supabase = createClient(supabaseUrl, supabaseKey);

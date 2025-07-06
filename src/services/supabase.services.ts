import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

const supabaseUrl = "https://ofqthmatkldnapuxacor.supabase.co";

const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) throw new Error("No Supabase Key Found");

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;

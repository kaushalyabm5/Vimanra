import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Ensure connection and check tables exist
export const initTables = async () => {
  console.log("🔌 Checking connection to Supabase...");
  // Use lowercase table name
  const { error } = await supabase.from("rooms").select("count", { count: "exact", head: true });
  if (error) {
    console.error("❌ Supabase connection error:", error.message);
    throw error;
  }
  console.log("✅ Supabase connection verification successful!");
};

// Unified Promise-based Data Query Interface over Supabase
export const dbQuery = {
  // Get all items in a table (with optional filter function)
  all: async (table, filterFn = null) => {
    const supabaseTable = table.toLowerCase();
    const { data, error } = await supabase.from(supabaseTable).select("*");
    if (error) {
      console.error(`Error querying all from ${supabaseTable}:`, error.message);
      throw error;
    }
    if (filterFn) return data.filter(filterFn);
    return data;
  },

  // Get a single item in a table by filter function
  get: async (table, filterFn) => {
    const supabaseTable = table.toLowerCase();
    const { data, error } = await supabase.from(supabaseTable).select("*");
    if (error) {
      console.error(`Error querying single get from ${supabaseTable}:`, error.message);
      throw error;
    }
    return data.find(filterFn) || null;
  },

  // Insert an item into a table
  insert: async (table, item, pkName) => {
    const supabaseTable = table.toLowerCase();
    const payload = { ...item };
    
    // Handle mock-specific fields to avoid Postgres schema mismatches
    if (supabaseTable === "gallery" && payload.uploaded_at) {
      payload.created_at = payload.created_at || payload.uploaded_at;
      delete payload.uploaded_at;
    }

    const { data, error } = await supabase
      .from(supabaseTable)
      .insert(payload)
      .select()
      .single();
    if (error) {
      console.error(`Error inserting into ${supabaseTable}:`, error.message);
      throw error;
    }
    return data;
  },

  // Update item(s) in a table
  update: async (table, pkName, id, updateData) => {
    const supabaseTable = table.toLowerCase();
    const { data, error } = await supabase
      .from(supabaseTable)
      .update(updateData)
      .eq(pkName.toLowerCase(), id)
      .select()
      .single();
    if (error) {
      console.error(`Error updating table ${supabaseTable} at ${pkName}=${id}:`, error.message);
      throw error;
    }
    return data;
  },

  // Delete item from a table
  delete: async (table, pkName, id) => {
    const supabaseTable = table.toLowerCase();
    const { error } = await supabase
      .from(supabaseTable)
      .delete()
      .eq(pkName.toLowerCase(), id);
    if (error) {
      console.error(`Error deleting from table ${supabaseTable} at ${pkName}=${id}:`, error.message);
      throw error;
    }
    return true;
  },
};

export default dbQuery;

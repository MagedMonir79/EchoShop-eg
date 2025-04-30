import { supabase } from "./lib/supabaseClient";

// دالة اختبار الاتصال
async function testConnection() {
  const { data, error } = await supabase.from("users").select("*").limit(1);

  if (error) {
    console.error("❌ Error connecting to Supabase:", error.message);
  } else {
    console.log("✅ Connected successfully! Sample user:", data);
  }
}

testConnection();

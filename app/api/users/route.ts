import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export async function GET() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Only return id, email, and user_metadata for each user
  const users = data.users.map((user: any) => ({
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata || {},
  }));
  return NextResponse.json(users);
} 

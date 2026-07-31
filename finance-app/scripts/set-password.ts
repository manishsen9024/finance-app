import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createHash } from "crypto";
import { supabase } from "../lib/supabase";

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error("Usage: npm run set-password -- <password>");
    process.exit(1);
  }
  const hash = createHash("sha256").update(password).digest("hex");
  const { error } = await supabase()
    .from("app_config")
    .upsert(
      { id: 1, password_hash: hash, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log("Password hash stored in Supabase (public.app_config).");
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);

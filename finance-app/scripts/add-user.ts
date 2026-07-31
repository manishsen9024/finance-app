import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createHash } from "crypto";
import { supabase } from "../lib/supabase";

async function main() {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error("Usage: npm run add-user -- <username> <password>");
    process.exit(1);
  }
  const name = username.trim().toLowerCase();
  if (!/^[a-z0-9_]{3,30}$/.test(name)) {
    console.error("Username must be 3-30 chars (letters, numbers, underscores).");
    process.exit(1);
  }
  if (password.length < 4) {
    console.error("Password must be at least 4 characters.");
    process.exit(1);
  }

  const { data: existing } = await supabase()
    .from("users")
    .select("id")
    .eq("username", name)
    .maybeSingle();
  if (existing) {
    console.error(`Username "${name}" already exists.`);
    process.exit(1);
  }

  const hash = createHash("sha256").update(password).digest("hex");
  const { error } = await supabase()
    .from("users")
    .insert({ username: name, password_hash: hash });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log(`User "${name}" created — they can now log in at /login.`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);

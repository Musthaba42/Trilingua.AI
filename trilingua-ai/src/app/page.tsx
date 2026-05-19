import { redirect } from "next/navigation";

/**
 * Root page — redirects to dashboard or login based on auth status.
 * For the demo, we redirect to login directly.
 * After auth is set up, this will check the session.
 */
export default function Home() {
  redirect("/login");
}

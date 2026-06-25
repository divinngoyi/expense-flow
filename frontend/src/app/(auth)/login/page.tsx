import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Log in — Expense Flow" };

export default function LoginPage() {
  return <SignIn routing="hash" />;
}

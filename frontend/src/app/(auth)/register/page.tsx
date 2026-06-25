import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Create account — Expense Flow" };

export default function RegisterPage() {
  return <SignUp routing="hash" />;
}

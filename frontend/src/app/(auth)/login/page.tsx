import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Log in — Expense Flow" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") && !params.next.startsWith("//")
    ? params.next
    : "/dashboard";
  const initialError = params.error === "confirmation_failed"
    ? "That confirmation link is invalid or has expired. Please request a new one."
    : null;

  return <AuthForm mode="login" initialError={initialError} nextPath={nextPath} />;
}

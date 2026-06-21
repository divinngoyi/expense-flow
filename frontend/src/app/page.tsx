import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5">
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Expense Flow
        </span>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="#features"
            className="transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            Features
          </Link>
          <Link
            href="/login"
            className="transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="btn-primary px-4 py-2 text-sm rounded-[var(--radius)]"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <h1
          className="text-7xl font-bold max-w-3xl mb-6"
          style={{
            fontFamily: "var(--font-jakarta)",
            letterSpacing: "-1.8px",
            lineHeight: "1",
          }}
        >
          See where every rand goes.
        </h1>
        <p
          className="text-lg max-w-xl mb-10"
          style={{ color: "var(--muted-foreground)" }}
        >
          Track money in and money out, organise by category, and read your
          month at a glance — without the spreadsheet.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="btn-primary px-6 py-3 text-base rounded-[var(--radius)]"
          >
            Start free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 text-base transition-colors"
            style={{ color: "var(--foreground)" }}
          >
            I have an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Monthly dashboard",
              body: "Totals, top categories and net flow at a glance.",
            },
            {
              title: "Money in & out",
              body: "Capture every transaction with category and source.",
            },
            {
              title: "Calendar view",
              body: "Tap any day to see the entries behind the number.",
            },
          ].map((f) => (
            <div key={f.title} className="glass-card p-6">
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer
        className="text-center text-sm py-8"
        style={{ color: "var(--muted-foreground)" }}
      >
        © 2026 Expense Flow
      </footer>
    </main>
  );
}

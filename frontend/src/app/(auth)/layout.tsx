import AuthSlidePanel from "@/components/AuthSlidePanel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <AuthSlidePanel />

      {/* Right form panel */}
      <div className="flex items-center justify-center px-4 py-8 sm:p-8 lg:p-12">
        {children}
      </div>
    </div>
  );
}

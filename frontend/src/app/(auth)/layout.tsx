import AuthSlidePanel from "@/components/AuthSlidePanel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthSlidePanel />

      {/* Right form panel */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        {children}
      </div>
    </div>
  );
}

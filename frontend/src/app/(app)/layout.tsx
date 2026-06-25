import AppSidebar from "@/components/AppSidebar";
import UserSync from "@/components/UserSync";
import VerificationBanner from "@/components/VerificationBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <UserSync />
        <VerificationBanner />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

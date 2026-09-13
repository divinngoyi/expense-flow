"use client";

import AppSidebar from "@/components/AppSidebar";
import MobileNav from "@/components/MobileNav";
import UserSync from "@/components/UserSync";
import VerificationBanner from "@/components/VerificationBanner";
import { ToastProvider } from "@/components/Toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <UserSync>
            <VerificationBanner />
            <main className="flex-1 p-5 lg:p-8 pb-24 lg:pb-8">{children}</main>
          </UserSync>
        </div>
      </div>
      <MobileNav />
    </ToastProvider>
  );
}

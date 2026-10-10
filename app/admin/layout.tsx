import React from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: {
    template: "%s | NewSystem CMS",
    default: "Admin Portal | NewSystem CMS",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If no user session and not on login page, middleware or layout redirects
  // Note: in Next.js App Router, layout wraps login as well, so if user is null we can check if it's login or render minimal
  if (!user) {
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-y-auto max-h-screen p-6 sm:p-10">
        <div className="max-w-6xl mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
}

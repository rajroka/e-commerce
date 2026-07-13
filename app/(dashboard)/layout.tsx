import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* pt-16 on mobile offsets the fixed top bar; md:ml-56 offsets the fixed sidebar */}
      <main className="md:ml-56 pt-14 md:pt-[32px] min-h-screen px-6 pb-6">
        {children}
      </main>
    </div>
  );
}

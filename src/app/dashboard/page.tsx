import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  FileText,
  Stethoscope,
  ChevronRight,
} from "lucide-react";
import { Suspense } from "react";
import DashboardClient from "./DashboardClient";
import MobileSidebar from "./mobile-sidebar";

const WelcomeBanner = ({ userName }: { userName: string }) => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-5 mt-10 sm:p-6 rounded-xl shadow-lg mb-6">
    <div className="flex items-center gap-4">
      <Stethoscope size={36} className="text-blue-100" />
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">
          Welcome back, Dr. {userName}
        </h1>
        <p className="text-blue-100 text-sm">
          Overview of today’s patient activity
        </p>
      </div>
    </div>
  </div>
);

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (Desktop / Tablet) */}
      <aside className="hidden lg:flex w-64 bg-white shadow-xl p-6 flex-col">
        <div className="text-2xl font-bold text-blue-600 mb-8">
          PMS Dashboard
        </div>

        <nav className="space-y-3">
          <Link href="/dashboard/add-patient">
            <div className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <UserPlus size={20} />
              Add Patient
            </div>
          </Link>

          <Link href="/dashboard/view-patients">
            <div className="flex items-center gap-3 p-3 mb-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <FileText size={20} />
              View Patients
            </div>
          </Link>

          <hr />

          <Link href="/dashboard/profile">
            <div className="flex justify-between  items-center p-3 rounded-lg text-gray-500 hover:bg-gray-100">
              Profile
              <ChevronRight size={16} />
            </div>
          </Link>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <WelcomeBanner userName={session.user?.name || "Doctor"} />

        <Suspense
          fallback={
            <div className="grid place-items-center h-60 text-gray-400 animate-pulse">
              Loading dashboard data...
            </div>
          }
        >
          <DashboardClient />
        </Suspense>
      </main>
    </div>
  );
}

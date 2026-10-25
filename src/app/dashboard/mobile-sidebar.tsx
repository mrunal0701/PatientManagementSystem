"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, UserPlus, FileText, ChevronRight } from "lucide-react";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Dashboard Bar (BELOW Navbar) */}
      <div className="lg:hidden  fixed top-16 left-0 right-0 bg-white shadow-md z-30 px-4 py-3 flex justify-between items-center">
        <button onClick={() => setOpen(true)}>
          <Menu size={24} className="text-blue-600" />
        </button>
        <span className="font-semibold text-blue-600">Dashboard</span>
      </div>

      {/* Sidebar Drawer */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-600">Menu</h2>
              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-3">
              <Link href="/dashboard/add-patient" onClick={() => setOpen(false)}>
                <div className="flex gap-3 p-3 rounded-lg bg-blue-600 text-white">
                  <UserPlus size={18} /> Add Patient
                </div>
              </Link>

              <Link href="/dashboard/view-patients" onClick={() => setOpen(false)}>
                <div className="flex gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                  <FileText size={18} /> View Patients
                </div>
              </Link>

              <Link href="/dashboard/profile" onClick={() => setOpen(false)}>
                <div className="flex justify-between items-center p-3 text-gray-500 hover:bg-gray-100 rounded-lg">
                  Profile
                  <ChevronRight size={16} />
                </div>
              </Link>
            </nav>
          </div>

          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}

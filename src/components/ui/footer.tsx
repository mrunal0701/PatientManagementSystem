
import Link from "next/link";
import { Copyright } from "lucide-react";


export default function DashboardFooter() {
  return (
    <footer className="mt-10 pt-4 border-t border-gray-300 w-full bg-gray-50/50">
      <div className="max-w-7xl mx-auto text-center py-4 px-4">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <Copyright size={14} className="mr-1" />
          {new Date().getFullYear()} Patient Management System. All rights reserved.
        </div>
        <div className="mt-2 text-xs text-blue-500 space-x-4">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <span>|</span>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
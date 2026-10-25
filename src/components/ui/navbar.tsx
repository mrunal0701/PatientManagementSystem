"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Globe,
  User,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  if (status === "loading") return null;

  return (
    <header className="w-full bg-white shadow-md relative z-20">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="flex space-x-4">
            <Facebook size={16} />
            <Twitter size={16} />
            <Instagram size={16} />
            <Globe size={16} />
          </div>
          <div className="flex space-x-6">
            <span className="flex items-center">
              <Phone size={16} className="mr-1" /> +120-556-5523
            </span>
            <span className="flex items-center">
              <Globe size={16} className="mr-1" /> 09:00 - 20:00
            </span>
            <span className="flex items-center">
              <Mail size={16} className="mr-1" /> support@example.com
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Hospital Management
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-700">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>

          {!session ? (
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center"
              >
                <User size={20} className="text-blue-700" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border p-3 text-sm">
                  <div className="font-semibold border-b pb-2 mb-2">
                    {session.user?.name}
                  </div>
                  <Link
                    href="/dashboard"
                    className="block py-2 hover:text-blue-600"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-2 py-2 text-red-600"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Hamburger */}
        <button
          className="lg:hidden text-blue-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t shadow-md">
          <div className="px-6 py-4 space-y-4 text-gray-700 font-medium">
            <Link  href="/" onClick={() => setMobileOpen(false)}>Home</Link><br></br><hr className="mb-4"></hr>
            <Link  href="/about" onClick={() => setMobileOpen(false)}>About</Link><br></br><hr className="mb-4"></hr>
            <Link  href="/services" onClick={() => setMobileOpen(false)}>Services</Link><hr className="mb-4"></hr>

            {!session ? (
              <button
                onClick={() => router.push("/login")}
                className="w-full text-center py-2 bg-blue-600 text-white rounded"
              >
                Login
              </button>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

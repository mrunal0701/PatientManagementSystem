"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // For the image on the left panel
import Link from "next/link"; // For the "Already have an account?" link
import { Button } from "@/components/ui/button";
// Removed Card components, using custom divs for the new layout
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, SquareUser } from "lucide-react"; // SquareUser for a distinct look
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/doctor/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    // --- FUNCTIONALITY REMAINS UNCHANGED ---
    if (!res.ok) {
      toast.error(data.message || "Something went wrong in signing up.");
      return;
    }

    toast.success("Account created successfully! Redirecting to login...");

    setTimeout(() => router.push("/login"), 1500);
    // --- END FUNCTIONALITY UNCHANGED ---
  }

  return (
    // Main Container: Centered, fills screen, and uses a subtle background color
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      
      {/* Signup Box Container: Large container with the two columns */}
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-row">
        
        {/* === LEFT SIDEBAR (Image and Promo) === */}
        <div className="hidden lg:block lg:w-1/2 relative">
          
          {/* Top Half: Doctor Image */}
          <div className="h-2/3 relative">
            <Image
              src="/images/main_page_img1.jpeg" 
              alt="Doctor smiling in a modern clinic"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority 
            />
          </div>

          {/* Bottom Half: Dark Blue Promo */}
          <div className="h-1/3 bg-blue-700 p-8 text-white flex flex-col justify-center">
            <div className="flex items-center space-x-2 mb-4">
              {/* Logo/Icon */}
          
            </div>
            
            <h2 className="text-3xl font-bold mb-3">
              Join  Hospital Management System
            </h2>
            <p className="text-sm text-blue-100">
              Register now to access your centralized, user-friendly platform for patient management and follow-up.
            </p>
          </div>
        </div>

        {/* === (Signup Form) === */}
        <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
          
          {/* Logo/Title */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
              <SquareUser className="w-5 h-5 text-white" /> 
            </div>
            <span className="text-2xl font-semibold text-blue-700">Doctor Sign Up</span>
          </div>
          
          {/* <h1 className="text-2xl font-semibold text-gray-800"></h1> */}
          <p className="text-gray-500 mb-8 text-sm">
            Create your professional account to get started.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Dr. John Doe"
                className="mt-1 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@example.com"
                className="mt-1 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                className="mt-1 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full mt-4 h-12 bg-blue-600 hover:bg-blue-700 text-lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-blue-600 cursor-pointer hover:underline font-medium"
              >
                Login
              </span>
            </p>
          </form>
        </div>
        
      </div>
    </div>
  );
}
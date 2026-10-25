// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Stethoscope, User, MapPin, Phone, Briefcase, Info, ArrowLeft, Loader2, Save } from "lucide-react"; 

// doctor's profile data 
interface DoctorProfile {
  name: string;
  email: string;
  specialization: string;
  phone: string;
  clinicAddress: string;
  registrationId: string;
  bio: string;
}

export default function DoctorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<DoctorProfile> | null>(null);
  const [hasError, setHasError] = useState(false);


  async function fetchProfile() {
    setLoading(true);
    setHasError(false);
    try {
      const res = await fetch("/api/doctor/profile"); 
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load profile.");
      }

      setProfile(data.profile); // Assuming API returns { profile: {...} }
      toast.success("Profile loaded.");
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setHasError(true);
      setProfile(null); 
      toast.error("Could not load profile. Check API and authorization.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  try {
    const cleanPayload = Object.fromEntries(
      Object.entries(profile || {}).filter(
        ([_, value]) => value !== undefined
      )
    );

    const res = await fetch("/api/doctor/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanPayload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Failed to save profile.");
      return;
    }

    toast.success("Profile updated successfully!");
    setProfile(data.profile);
  } catch (err: any) {
    setLoading(false);
    toast.error(err.message || "Server error occurred during update.");
  }
}

  
  // --- Loading / Error States ---
  if (loading && !profile) {
    return (
      <div className="p-10 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500 flex items-center gap-2">
            <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
            Loading Profile...
        </p>
      </div>
    );
  }

  if (hasError || !profile) {
    return (
      <div className="p-10 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-red-200 max-w-md w-full">
            <p className="text-xl font-semibold text-red-600 mb-4">Error Loading Profile</p>
            <p className="text-gray-600">Could not retrieve doctor data. Please ensure you are logged in and the API endpoint is correct.</p>
            <Button onClick={fetchProfile} className="mt-4 bg-blue-600 hover:bg-blue-700 w-full">Try Again</Button>
        </div>
        <p className="mt-4 text-sm text-gray-400">If the error persists, verify the existence and security of `/api/doctor/profile`.</p>
      </div>
    );
  }
  // --- End Loading / Error States ---


return (
  <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8">
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl shadow border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="text-blue-600" size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-blue-900">
              Doctor Profile
            </h1>
            <p className="text-sm text-slate-500">
              Manage your professional information
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="text-blue-600 hover:text-blue-800 cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Personal Info */}
        <Card className="border border-blue-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
              <Info size={18} />
              Personal & Contact Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={profile.name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Email (Login)</Label>
              <Input
                value={profile.email || ""}
                disabled
                className="bg-slate-100 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Medical Registration ID</Label>
              <Input
                value={profile.registrationId || ""}
                onChange={(e) =>
                  setProfile({ ...profile, registrationId: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Short Professional Bio</Label>
              <Textarea
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={4}
                placeholder="Brief overview of your medical background and experience"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Info */}
        <Card className="border border-blue-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
              <Briefcase size={18} />
              Professional Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input
                value={profile.specialization || ""}
                onChange={(e) =>
                  setProfile({ ...profile, specialization: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Clinic / Hospital Address</Label>
              <Textarea
                value={profile.clinicAddress || ""}
                onChange={(e) =>
                  setProfile({ ...profile, clinicAddress: e.target.value })
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-10 py-2 text-base font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  </div>
);

}
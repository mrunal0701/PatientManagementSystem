import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Doctor } from "@/lib/model/Doctor";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper
const getAuthSession = async () => {
  return await getServerSession(authOptions);
};

// --- GET PROFILE ---
export async function GET() {
  try {
    await connectDB();
    const session = await getAuthSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctor = await Doctor.findOne({ email: session.user.email })
      .select("-password")
      .lean();

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    const { _id, __v, password, ...profile } = doctor;
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("GET Doctor profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// --- UPDATE PROFILE ---
export async function PUT(req: Request) {
  try {
    await connectDB();
    const session = await getAuthSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();

    // Security
    delete payload.email;
    delete payload.password;
    delete payload._id;

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { email: session.user.email },
      { $set: payload },
      { new: true, runValidators: true }
    )
      .select("-password")
      .lean();

    if (!updatedDoctor) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const { _id, __v, password, ...profile } = updatedDoctor;
    return NextResponse.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (err: any) {
    console.error("PUT Doctor profile error:", err);

    if (err.name === "ValidationError") {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Server error during update" },
      { status: 500 }
    );
  }
}

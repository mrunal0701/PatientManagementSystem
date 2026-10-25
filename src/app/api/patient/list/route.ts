// app/api/patient/list/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/lib/model/Patient";

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const q = url.searchParams.get("q") || ""; // search by name, mobile, patientId
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { mobile: { $regex: q, $options: "i" } },
            { patientId: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const total = await Patient.countDocuments(filter);
    const patients = await Patient.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ patients, total, page, limit });
  } catch (err: any) {
    console.error("List patients error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

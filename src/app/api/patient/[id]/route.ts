import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/lib/model/Patient";
import mongoose from "mongoose";

export async function GET(req: Request, context: any) {
  try {
    await connectDB();

    const { params } = context;
    const { id } = await params; // 🔥 FIX — params MUST be awaited

    const query = mongoose.isValidObjectId(id)
      ? { _id: id }
      : { patientId: id }; // 🔥 Your 5-digit patientId logic stays

    const patient = await Patient.findOne(query).lean();

    if (!patient)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ patient });
  } catch (err: any) {
    console.error("Get patient error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    await connectDB();

    const { params } = context;
    const { id } = await params; // 🔥 MUST await

    const payload = await req.json();

    const query = mongoose.isValidObjectId(id)
      ? { _id: id }
      : { patientId: id }; // 🔥 still works with 5-digit patientId

    const updated = await Patient.findOneAndUpdate(query, payload, {
      new: true,
    });

    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Updated", patient: updated });
  } catch (err: any) {
    console.error("Update patient error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

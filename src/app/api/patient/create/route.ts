import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/lib/model/Patient";

// helper: random 5-digit id
function gen5() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

async function uniquePatientId() {
  for (let i = 0; i < 10; i++) {
    const id = gen5();
    const exists = await Patient.findOne({ patientId: id }).lean();
    if (!exists) return id;
  }
  return Date.now().toString().slice(-5);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, mobile, address } = body;
    if (!name || !mobile || !address)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const pid = await uniquePatientId();

    const newPatient = await Patient.create({
      ...body,
      patientId: pid,
    });

    return NextResponse.json(
      { message: "Patient created", patient: newPatient },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

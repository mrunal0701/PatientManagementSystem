// lib/models/Patient.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ILabTest {
  name: string;
  result?: string;
  date?: string; // YYYY-MM-DD
  notes?: string;
}

export interface IMedicine {
  name: string;
  dose: string; // e.g. "500mg"
  frequency: string; // e.g. "Twice a day"
  duration: string; // e.g. "5 days"
  instructions?: string;
}

export interface IVisit {
  date: string; // YYYY-MM-DD
  reason?: string;
  findings?: string;
  advice?: string; // suggestion / parhez
  nextVisit?: string; // date
  createdAt?: Date;
}

export interface IPatient extends Document {
  name: string;
  mobile: string;
  address: string;
  patientId: string; // five-digit unique string
  age?: number;
  gender?: string;
  labTests: ILabTest[];
  medicines: IMedicine[];
  suggestion?: string; // general suggestion / parhez
  doseNotes?: string;
  visits: IVisit[];
  createdBy?: mongoose.Types.ObjectId | string; // doctor id
  createdAt: Date;
  updatedAt: Date;
}

const LabTestSchema = new Schema(
  {
    name: { type: String, required: true },
    result: String,
    date: String,
    notes: String,
  },
  { _id: false }
);

const MedicineSchema = new Schema(
  {
    name: { type: String, required: true },
    dose: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: String,
  },
  { _id: false }
);

const VisitSchema = new Schema(
  {
    date: { type: String, required: true },
    reason: String,
    findings: String,
    advice: String,
    nextVisit: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PatientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    patientId: { type: String, required: true, unique: true },
    age: Number,
    gender: String,
    labTests: { type: [LabTestSchema], default: [] },
    medicines: { type: [MedicineSchema], default: [] },
    suggestion: String,
    doseNotes: String,
    visits: { type: [VisitSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "Doctor" },
  },
  { timestamps: true }
);

export const Patient =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);

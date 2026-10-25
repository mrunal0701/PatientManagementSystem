import mongoose, { Schema, Document } from "mongoose";


export interface IDoctor extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string; // Made optional
  clinicAddress?: string; // Made optional
  registrationId?: string; // Made optional
  bio?: string; // Made optional
  specialization?: string; // Made optional
}

const DoctorSchema = new Schema<IDoctor>(
  {
    // CORE AUTH FIELDS
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },


    phone: { type: String },
    clinicAddress: { type: String },
    registrationId: { type: String },
    bio: { type: String },
    specialization: { type: String },
  },
  { timestamps: true }
);

export const Doctor =
  mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema);
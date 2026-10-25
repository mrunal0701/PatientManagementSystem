



//UPDATED:


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus,
  ArrowLeft,
  Stethoscope,
  TestTube,
  Pill,
  CheckCircle,
  Download,
} from "lucide-react";

type LabTest = { name: string; result?: string; date?: string; notes?: string };
type Medicine = {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions?: string;
};

export default function AddPatientPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newPatientId, setNewPatientId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    age: "",
    gender: "",
    suggestion: "",
    doseNotes: "",
  });

  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [visits, setVisits] = useState<any[]>([]);

  // --- Logic remains unchanged (addLab, updateLab, etc.) ---
  function addLab() {
    setLabTests([...labTests, { name: "" }]);
  }
  function updateLab(i: number, payload: Partial<LabTest>) {
    const copy = [...labTests];
    copy[i] = { ...copy[i], ...payload };
    setLabTests(copy);
  }
  function removeLab(i: number) {
    const copy = [...labTests];
    copy.splice(i, 1);
    setLabTests(copy);
  }

  function addMed() {
    setMedicines([
      ...medicines,
      { name: "", dose: "", frequency: "", duration: "" },
    ]);
  }
  function updateMed(i: number, payload: Partial<Medicine>) {
    const copy = [...medicines];
    copy[i] = { ...copy[i], ...payload };
    setMedicines(copy);
  }
  function removeMed(i: number) {
    const copy = [...medicines];
    copy.splice(i, 1);
    setMedicines(copy);
  }
  // ---------------------------------------------------------

  /**
   * NEW FUNCTION: Handles the PDF Download Action
   */
  async function handlePdfDownload() {
    if (!newPatientId)
      return toast.error("Patient ID not found for PDF generation.");

    toast.loading("Generating prescription PDF...", { id: "pdf-toast" });

    try {
      // NOTE: This assumes you create a separate API route for PDF generation.
      const res = await fetch(
        `/api/prescription/generate-pdf/${newPatientId}`,
        {
          method: "GET", // Or POST, depending on your API design
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to generate PDF.", {
          id: "pdf-toast",
        });
        return;
      }

      // Logic to trigger browser download (if your API returns the PDF blob)
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prescription_${newPatientId}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Prescription PDF downloaded!", { id: "pdf-toast" });
    } catch (err) {
      toast.error("Error connecting to PDF service.", { id: "pdf-toast" });
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      age: form.age ? Number(form.age) : undefined,
      labTests,
      medicines,
      suggestion: form.suggestion,
      doseNotes: form.doseNotes,
      visits,
    };

    try {
      // 1. Save Patient Record to Database
      const res = await fetch("/api/patient/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.error || "Could not create record.");
        return;
      }

      // Success: Set success state
      const newId = data.patient.patientId;
      setNewPatientId(newId);
      setIsSuccess(true);
      toast.success(`Patient record created successfully!`);

      // 2. Send WhatsApp Notification (Non-blocking call)
      const medicinesText = medicines.length
        ? medicines
            .map(
              (m, i) =>
                `${i + 1}. ${m.name} - ${m.dose}, ${m.frequency}, ${
                  m.duration
                }${m.instructions ? ` (${m.instructions})` : ""}`
            )
            .join("\n")
        : "No medicines prescribed";

      const whatsappPayload = {
        name: form.name, // {{1}}
        mobile: form.mobile, // {{2}}
        age: form.age || "N/A", // {{3}}
        address: form.address || "N/A", // {{4}}
        medicines: medicinesText, // {{5}}
        suggestion: form.suggestion || "N/A", // {{6}}
        doseNotes: form.doseNotes || "N/A", // {{7}}
      };

      // We don't await this, allowing the redirect to happen while the message sends.
      fetch("/api/whatsapp/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(whatsappPayload),
      })
        .then((whatsappRes) => {
          if (whatsappRes.ok) {
            toast.info("WhatsApp notification is being sent.");
          } else {
            // Failure: This is the warning you were seeing
            whatsappRes.json().then((whatsappData) => {
              console.error("WhatsApp failed to send:", whatsappData.error);
              toast.warning(
                `Record saved, but WhatsApp failed: ${
                  whatsappData.error.details?.message || "Check server logs."
                }`
              );
            });
          }
        })
        .catch((whatsappErr) => {
          console.error("WhatsApp API call error:", whatsappErr);
          toast.warning(
            "Record saved, but a server error occurred while sending WhatsApp."
          );
        });

      // 3. Delayed redirect after showing success screen for 2 seconds
      setTimeout(() => {
        router.push(`/patient/${newId}`);
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Server error occurred.");
    }
  }

  // --- Success Screen Component (Updated with PDF button) ---
  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="max-w-md w-full p-8 text-center shadow-2xl border-2 border-blue-500 rounded-xl">
          <CardContent className="space-y-6">
            <CheckCircle className="w-20 h-20 text-blue-600 mx-auto animate-pulse" />
            <h1 className="text-3xl font-bold text-blue-800">Record Saved!</h1>
            <p className="text-gray-600 text-lg">
              Patient details have been successfully recorded and notification
              sent.
            </p>
            {newPatientId && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-600">
                  Patient ID:{" "}
                  <span className="text-lg font-extrabold">{newPatientId}</span>
                </p>
              </div>
            )}

            {/* NEW PDF DOWNLOAD BUTTON */}
            <Button
              onClick={handlePdfDownload} // Triggers the PDF download logic
              className="w-full bg-green-500 hover:bg-green-600 mt-4 text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Download Prescription PDF
            </Button>

            <Button
              onClick={() => router.push(`/patient/${newPatientId}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
            >
              View Patient Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  // --------------------------------

  // --- Main Form Render ---
  return (
    // ... (rest of the main form render remains unchanged)
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Back to Dashboard Button (Blue and prominent) */}
      <Button
        onClick={() => router.push("/dashboard")}
        variant="ghost"
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700 transition font-semibold p-0"
      >
        <ArrowLeft size={20} className="text-blue-600" />
        Back to Dashboard
      </Button>

      <Card className="max-w-5xl mx-auto shadow-2xl border border-blue-100 rounded-xl">
        <CardHeader className="bg-white p-6 border-b border-blue-100 rounded-t-xl">
          <div className="flex items-center space-x-4">
            <Stethoscope size={36} className="text-blue-600" />
            <CardTitle className="text-3xl font-bold text-blue-800">
              New Patient Record
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Details */}
            <section className="border p-6 rounded-lg bg-blue-50/50">
              <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                <Pill size={20} /> Patient Demographics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="mobile"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Mobile <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mobile"
                    required
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value })
                    }
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="age"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label
                    htmlFor="gender"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Gender
                  </Label>
                  <Input
                    id="gender"
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="suggestion"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Suggestion (Parhez)
                  </Label>
                  <Input
                    id="suggestion"
                    value={form.suggestion}
                    onChange={(e) =>
                      setForm({ ...form, suggestion: e.target.value })
                    }
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="doseNotes"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Dose Notes
                  </Label>
                  <Input
                    id="doseNotes"
                    value={form.doseNotes}
                    onChange={(e) =>
                      setForm({ ...form, doseNotes: e.target.value })
                    }
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  required
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="border-blue-200 focus-visible:ring-blue-500 min-h-[80px]"
                />
              </div>
            </section>

            {/* Lab Tests */}
            <section className="border p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                  <TestTube size={20} /> Lab Tests
                </h2>
                <Button
                  type="button"
                  size="sm"
                  onClick={addLab}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Test
                </Button>
              </div>

              {labTests.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  No lab tests requested yet.
                </p>
              )}

              <div className="space-y-4">
                {labTests.map((l, i) => (
                  <Card
                    key={i}
                    className="p-4 border border-blue-100 rounded-lg shadow-sm"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <Input
                        placeholder="Test Name"
                        value={l.name}
                        onChange={(e) => updateLab(i, { name: e.target.value })}
                        className="border-blue-100"
                      />
                      <Input
                        placeholder="Result"
                        value={l.result}
                        onChange={(e) =>
                          updateLab(i, { result: e.target.value })
                        }
                        className="border-blue-100"
                      />
                      <Input
                        placeholder="Date (YYYY-MM-DD)"
                        value={l.date}
                        onChange={(e) => updateLab(i, { date: e.target.value })}
                        className="border-blue-100"
                      />
                      <Input
                        placeholder="Notes"
                        value={l.notes}
                        onChange={(e) =>
                          updateLab(i, { notes: e.target.value })
                        }
                        className="border-blue-100"
                      />
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-3 bg-red-500 hover:bg-red-600"
                      onClick={() => removeLab(i)}
                    >
                      Remove
                    </Button>
                  </Card>
                ))}
              </div>
            </section>

            {/* Medicines */}
            <section className="border p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                  <Pill size={20} /> Prescribed Medicines
                </h2>
                <Button
                  type="button"
                  size="sm"
                  onClick={addMed}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Medicine
                </Button>
              </div>

              {medicines.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  No medicines added yet.
                </p>
              )}

              <div className="space-y-4">
                {medicines.map((m, i) => (
                  <Card
                    key={i}
                    className="p-4 border border-blue-100 rounded-lg shadow-sm"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <Input
                        placeholder="Name"
                        value={m.name}
                        onChange={(e) => updateMed(i, { name: e.target.value })}
                        className="col-span-2 md:col-span-1 border-blue-100"
                      />
                      <Input
                        placeholder="Dose"
                        value={m.dose}
                        onChange={(e) => updateMed(i, { dose: e.target.value })}
                        className="border-blue-100"
                      />
                      <Input
                        placeholder="Frequency"
                        value={m.frequency}
                        onChange={(e) =>
                          updateMed(i, { frequency: e.target.value })
                        }
                        className="border-blue-100"
                      />
                      <Input
                        placeholder="Duration"
                        value={m.duration}
                        onChange={(e) =>
                          updateMed(i, { duration: e.target.value })
                        }
                        className="border-blue-100"
                      />
                      <Input
                        placeholder="Instructions"
                        value={m.instructions}
                        onChange={(e) =>
                          updateMed(i, { instructions: e.target.value })
                        }
                        className="border-blue-100"
                      />
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-3 bg-red-500 hover:bg-red-600"
                      onClick={() => removeMed(i)}
                    >
                      Remove
                    </Button>
                  </Card>
                ))}
              </div>
            </section>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => router.push("/dashboard")}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Saving Patient Data..." : "Save Patient Record"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

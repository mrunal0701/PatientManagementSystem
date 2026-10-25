// app/patient/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id;

  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<any>(null);

  // edit form clones
  const [form, setForm] = useState<any>(null);

  const [newVisit, setNewVisit] = useState({ date: "", reason: "", findings: "", advice: "", nextVisit: "" });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/patient/${patientId}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Not found");
        setPatient(null);
      } else {
        setPatient(data.patient);
        setForm({
          name: data.patient.name,
          mobile: data.patient.mobile,
          address: data.patient.address,
          age: data.patient.age ?? "",
          gender: data.patient.gender ?? "",
          suggestion: data.patient.suggestion ?? "",
          doseNotes: data.patient.doseNotes ?? "",
          labTests: data.patient.labTests ?? [],
          medicines: data.patient.medicines ?? [],
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Server error");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!patientId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  async function saveUpdates() {
    setLoading(true);
    try {
      const payload = { ...form };
      const res = await fetch(`/api/patient/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        toast.error(data.error || "Update failed");
      } else {
        toast.success("Patient details updated");
        load();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Server error");
    }
  }

  async function addVisit() {
    if (!newVisit.date) {
      toast.error("Visit date required");
      return;
    }
    setLoading(true);
    try {
      const payload = { visits: [...(patient.visits || []), newVisit] };
      const res = await fetch(`/api/patient/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        toast.error(data.error || "Cannot add visit");
      } else {
        toast.success("Visit added");
        setNewVisit({ date: "", reason: "", findings: "", advice: "", nextVisit: "" });
        load();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Server error");
    }
  }

  if (!patient) {
    return (
      <div className="p-6">
        <Button onClick={() => router.push("/view-patients")}>Back</Button>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{patient.name} — {patient.patientId}</h2>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/dashboard/view-patients")} className="bg-blue-600 hover:bg-blue-700">Back to Dashboard</Button>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Patient Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="mb-2">Name</Label>
              <Input value={form?.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="mb-2">Mobile</Label>
              <Input value={form?.mobile || ""} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            </div>
            <div>
              <Label className="mb-2">Age</Label>
              <Input value={form?.age || ""} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <Label className="mb-2">Address</Label>
              <Textarea value={form?.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <Label className="mb-2">Gender</Label>
              <Input value={form?.gender || ""} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
            </div>
            <div>
              <Label className="mb-2">Suggestion</Label>
              <Input value={form?.suggestion || ""} onChange={(e) => setForm({ ...form, suggestion: e.target.value })} />
            </div>
            <div>
              <Label className="mb-2">Dose Notes</Label>
              <Input value={form?.doseNotes || ""} onChange={(e) => setForm({ ...form, doseNotes: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="ghost" onClick={() => load()}>Reload</Button>
            <Button onClick={saveUpdates} disabled={loading} className="bg-blue-600 hover:bg-blue-700" >{loading ? "Saving..." : "Save"}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Visits */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            {patient.visits?.length ? (
              patient.visits.slice().reverse().map((v: any, idx: number) => (
                <div key={idx} className="p-3 border rounded">
                  <div className="flex justify-between">
                    <div><strong>{v.date}</strong> — {v.reason}</div>
                    <div>{v.nextVisit ? `Next: ${v.nextVisit}` : null}</div>
                  </div>
                  <div className="mt-1 text-sm">
                    <div className="mb-2"><strong>Findings:</strong> {v.findings}</div>
                    <div className="mb-2"><strong>Advice:</strong> {v.advice}</div>
                  </div>
                </div>
              ))
            ) : (
              <div>No visits yet</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input type="date" placeholder="Date" value={newVisit.date} onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })} />
            <Input placeholder="Reason" value={newVisit.reason} onChange={(e) => setNewVisit({ ...newVisit, reason: e.target.value })} />
            <Input placeholder="Next Visit (YYYY-MM-DD)" value={newVisit.nextVisit} onChange={(e) => setNewVisit({ ...newVisit, nextVisit: e.target.value })} />
            <Button onClick={addVisit} className="bg-blue-600 hover:bg-blue-700" >Add Visit</Button>
          </div>
          <div className="mt-2">
            <Label className="mb-2">Findings</Label>
            <Textarea value={newVisit.findings} onChange={(e) => setNewVisit({ ...newVisit, findings: e.target.value })} />
            <Label className="mt-2 mb-2">Advice</Label>
            <Textarea value={newVisit.advice} onChange={(e) => setNewVisit({ ...newVisit, advice: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* Lab Tests & Medicines display (readonly) */}
      <Card>
        <CardHeader>
          <CardTitle>Lab Tests & Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <h4 className="font-semibold mb-2">Lab Tests</h4>
            {patient.labTests?.length ? (
              <ul className="list-disc pl-5 space-y-2">
                {patient.labTests.map((t: any, idx: number) => (
                  <li key={idx}>
                    <strong>{t.name}</strong> — {t.result || "-"} {t.date ? `(${t.date})` : null} {t.notes ? ` — ${t.notes}` : ""}
                  </li>
                ))}
              </ul>
            ) : <div>No lab tests</div>}
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Medicines</h4>
            {patient.medicines?.length ? (
              <ul className="list-disc pl-5 space-y-2">
                {patient.medicines.map((m: any, idx: number) => (
                  <li key={idx}>
                    <strong>{m.name}</strong> — {m.dose}, {m.frequency}, {m.duration} {m.instructions ? ` — ${m.instructions}` : ""}
                  </li>
                ))}
              </ul>
            ) : <div>No medicines</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

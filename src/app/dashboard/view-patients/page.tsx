
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search , ArrowLeft } from "lucide-react";

export default function PatientsPage() {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch(`/api/patient/list?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not load");
      } else {
        setPatients(data.patients || []);
      }
    } catch (err: any) {
      toast.error(err.message || "Server error");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
         <Button
        onClick={() => router.push("/dashboard")}
        variant="ghost"
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700 transition font-semibold p-0"
      >
        <ArrowLeft size={20} className="text-blue-600" />
        Back to Dashboard
      </Button>

      
        <h2 className="text-2xl font-semibold text-blue-700">View Patients List</h2>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/dashboard/add-patient")}><Plus className="mr-2 h-4 w-4  " /> Add Patient</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700" >Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Search by name / mobile / patient id" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={fetchList}><Search className="mr-2 h-4 w-4" /> Search</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Patient ID</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
              ) : patients.length === 0 ? (
                <TableRow><TableCell colSpan={5}>No patients found</TableCell></TableRow>
              ) : (
                patients.map((p: any) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.patientId}</TableCell>
                    <TableCell>{p.mobile}</TableCell>
                    <TableCell>{p.visits?.length ? p.visits[p.visits.length - 1].date : "-"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" onClick={() => router.push(`/dashboard/patient/${p.patientId}`)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

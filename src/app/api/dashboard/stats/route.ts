// src/app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/lib/model/Patient"; // Assuming Patient model is available

// Helper function to check if a date is within the next 7 days (for appointments)
function isUpcoming(dateStr: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Check for today (0) up to the next 7 days (7)
    return diffDays >= 0 && diffDays <= 7;
}

export async function GET(req: Request) {
    try {
        await connectDB();

        // 1. Get ALL patients to perform calculations locally or use a large aggregation query
        // For simplicity and to handle date logic easily, we'll fetch all required fields.
        const allPatients = await Patient.find({}).select('age visits labTests').lean();
        
        const totalPatients = allPatients.length;
        let upcomingAppointments = 0;
        let criticalCases = 0;
        const ageDistribution: { [key: string]: number } = {
            '0-18': 0, '19-45': 0, '46-65': 0, '65+': 0
        };
        const diseaseCounts: { [key: string]: number } = {};
        
        // --- Dynamic Calculations ---
        for (const patient of allPatients) {
            
            // 1. Age Distribution
            const age = patient.age;
            if (age !== undefined && age !== null) {
                if (age <= 18) ageDistribution['0-18']++;
                else if (age <= 45) ageDistribution['19-45']++;
                else if (age <= 65) ageDistribution['46-65']++;
                else ageDistribution['65+']++;
            }

            // 2. Upcoming Appointments
            if (patient.visits && patient.visits.length > 0) {
                for (const visit of patient.visits) {
                    if (visit.nextVisit && isUpcoming(visit.nextVisit)) {
                        upcomingAppointments++;
                        break; // Count per patient once
                    }
                }
            }
            
            // 3. Critical Cases (Placeholder Logic: Lab test result contains 'critical' or 'abnormal')
            if (patient.labTests && patient.labTests.length > 0) {
                const isCritical = patient.labTests.some((test: any) => 
                    test.result && (test.result.toLowerCase().includes('critical') || test.result.toLowerCase().includes('abnormal'))
                );
                if (isCritical) {
                    criticalCases++;
                }
            }

            // 4. Top 5 Diseases (Placeholder: Using Lab Test 'name' as a proxy for disease/test type)
            if (patient.labTests && patient.labTests.length > 0) {
                for (const test of patient.labTests) {
                    if (test.name) {
                        const name = test.name.toLowerCase().trim();
                        diseaseCounts[name] = (diseaseCounts[name] || 0) + 1;
                    }
                }
            }
        }

        // Sort and select Top 5 Diseases
        const sortedDiseases = Object.entries(diseaseCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));


        const dashboardStats = {
            totalPatients,
            upcomingAppointments,
            criticalCases,
            ageDistribution,
            topDiseases: sortedDiseases,
        };

        return NextResponse.json(dashboardStats);
    } catch (err: any) {
        console.error("Dashboard stats error:", err);
        return NextResponse.json({ error: "Server error during statistics calculation" }, { status: 500 });
    }
}
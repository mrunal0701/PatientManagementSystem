
"use client";
import { RotateCw , AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Users, Activity, HeartPulse, BarChart, FlaskConical, TrendingUp } from 'lucide-react';

// Define the shape of the dynamic data
type DashboardStats = {
  totalPatients: number;
  upcomingAppointments: number;
  criticalCases: number;
  ageDistribution: { [key: string]: number };
  topDiseases: { name: string; count: number }[];
};

// Reusable component for displaying key metrics
const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string; value: string | number; icon: React.ElementType; colorClass: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 hover:shadow-lg transition duration-300" style={{ borderColor: colorClass }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</h2>
        </div>
        <div className={`p-3 rounded-full text-white bg-opacity-10`} style={{ backgroundColor: colorClass, opacity: 0.1 }}>
          <Icon size={24} className={`opacity-100`} style={{ color: colorClass }} />
        </div>
      </div>
    </div>
  );

// Component for Chart/Visualization Placeholder
const ChartComponent = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: React.ElementType }) => (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Icon size={20} className="text-blue-600" />
        {title}
      </h3>
      <div className="h-72 flex items-center justify-center border border-dashed rounded-lg p-4">
        {children}
      </div>
    </div>
  );


export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats'); // Call the new dynamic API route
        if (!res.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }
        const data: DashboardStats = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
        <div className="grid place-items-center h-96 text-gray-500">
            <RotateCw className="w-8 h-8 animate-spin text-blue-500" />
            <p className="mt-2">Loading statistics...</p>
        </div>
    );
  }

  if (!stats) {
    return (
        <div className="grid place-items-center h-96 text-red-500 border border-red-200 rounded-xl bg-red-50">
            <AlertTriangle className="w-8 h-8" />
            <p className="mt-2">Failed to load dashboard data. Check API status.</p>
        </div>
    );
  }

  // Helper function to render a simple bar chart placeholder
  const renderAgeChart = () => {
    const data = Object.entries(stats.ageDistribution);
    if (data.every(([_, count]) => count === 0)) {
        return <p className="text-gray-400 italic">No age data available.</p>;
    }
    const maxCount = Math.max(...data.map(([_, count]) => count));

    return (
      <div className="w-full h-full flex flex-col justify-end p-2">
        <div className="flex items-end h-full gap-4">
          {data.map(([label, count]) => (
            <div key={label} className="flex flex-col items-center w-full h-full justify-end">
              <div 
                className="bg-blue-500 rounded-t-lg w-10 transition-all duration-700"
                style={{ height: `${(count / maxCount) * 85}%` }}
                title={`${label}: ${count}`}
              />
              <span className="text-xs text-gray-600 mt-1">{label}</span>
              <span className="text-xs font-bold text-blue-700">{count}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center mt-2 border-t pt-1">Age Group (Years)</p>
      </div>
    );
  };
    
  return (
    <div className="space-y-8">
        
      {/* 2. Total Patients Div Cards (Stats Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Total Patients" 
            value={stats.totalPatients} 
            icon={Users} 
            colorClass="#3b82f6" // Blue
        />
        <StatCard 
            title="Upcoming Appointments (7 Days)" 
            value={stats.upcomingAppointments} 
            icon={Activity} 
            colorClass="#10b981" // Green
        />
        <StatCard 
            title="Critical Cases (Lab Test Flag)" 
            value={stats.criticalCases} 
            icon={HeartPulse} 
            colorClass="#ef4444" // Red
        />
      </div>

      {/* 3. Patient Data Distribution (Charts/Components) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Patient Age Wise Component */}
        <ChartComponent title="Patient Distribution by Age Group" icon={BarChart}>
          {renderAgeChart()}
        </ChartComponent>

        {/* Patient Disease Wise Component */}
        <ChartComponent title="Top 5 Disease/Test Categories" icon={TrendingUp}>
            {stats.topDiseases.length > 0 ? (
                <ol className="list-decimal space-y-2 p-4 w-full">
                    {stats.topDiseases.map((disease, index) => (
                        <li key={index} className="flex justify-between items-center text-gray-700 border-b pb-1">
                            <span className="font-medium capitalize">{disease.name}</span>
                            <span className="font-bold text-blue-600">{disease.count} Patients</span>
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-gray-400 italic">No lab test data available for distribution.</p>
            )}
        </ChartComponent>

      </div>
      
    </div>
  );
}
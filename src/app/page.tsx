// src/app/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Ambulance, Heart, Microscope, Brain, Stethoscope, Star } from 'lucide-react';
import ServiceCard from '@/components/ui/ServiceCard';
import PatientReviewCard from '@/components/ui/PatientReviewCard';
import SpecialistCard from '@/components/ui/SpecialistCard';

// --- Data Definitions ---

// Ensure you have images named like 'DoctorFemale.jpg' and 'PatientMale.jpg', etc., in your public/images directory.

const serviceData = [
  { title: "Emergency Department", description: "If you visit site regularly and would like to", Icon: Ambulance },
  { title: "Pediatric Department", description: "If you visit site regularly and would like to", Icon: Stethoscope },
  { title: "General Physician", description: "If you visit site regularly and would like to", Icon: Microscope },
  { title: "Neurology Department", description: "If you visit site regularly and would like to", Icon: Brain },
  { title: "Cardiology Department", description: "If you visit site regularly and would like to", Icon: Heart },
];

const patientReviews = [
  { name: "Excellent care!", rating: 5.0, review: "Highly recommend.", image: "/images/patient-1.jpg" },
  { name: "Sercellent care!", rating: 5.0, review: "Really great (patient extra text to extend)", image: "/images/patient-2.jpg" },
  { name: "Hiceral Physician", rating: 4.5, review: "Dedication.", image: "/images/patient-3.jpg", viewProfile: true },
];

const specialistsData = [
  { name: "CardiB", specialty: "Cardiologist", bio: "Best cardiac services." },
  { name: "Deepak", specialty: "Dermatologist", bio: "Specialized skin care." },
  { name: "Sakshi", specialty: "Specialist", bio: "General medicine expert." },
  { name: "Naman", specialty: "Neurologist", bio: "Advanced brain studies." },
];

// --- Main Component ---

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
    

      <main className="pt-12">
        {/* 1. HERO SECTION */}
        <section className="bg-white pt-20 pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4">
            {/* Text Content */}
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
                Your Partner In <span className="text-blue-600">Health</span> And Wellness
              </h1>
              <p className="text-gray-500 text-lg mb-8 max-w-lg">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
              </p>
              <Link href="/login" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg">
                BOOK AN APPOINTMENT
              </Link>
            </div>

            {/* Image Content (Doctor with Circles) */}
            <div className="lg:w-1/2 relative flex justify-center h-[450px]">
              <div className="absolute w-full h-full">
                {/* Large Light Blue Circle */}
                <div className="absolute top-10 right-0 w-80 h-80 bg-blue-100 rounded-full opacity-50"></div>
                {/* Smaller Dark Circle (Behind Doctor) */}
                <div className="absolute bottom-10 left-[20%] w-40 h-40 bg-gray-700 rounded-full opacity-10"></div>
                {/* Plus Sign */}
                <span className="absolute top-20 right-[20%] text-blue-400 text-6xl font-light">+</span>
              </div>
              
              {/* Doctor Image Container */}
              <div className="relative w-full max-w-md h-full z-10">
                <Image
                  src="/images/main_page_img.jpeg"
                  alt="A female doctor in a scrub and stethoscope smiling"
                  layout="fill"
                  objectFit="contain" 
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* 2. SERVICES SECTION */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Our Healthcare Service</h2>
            <p className="text-center text-gray-500 mb-12 max-w-3xl mx-auto">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {serviceData.slice(0, 3).map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>

            {/* Service Cards (Second Row) */}
            <div className="flex flex-col md:flex-row justify-center gap-8">
              {serviceData.slice(3).map((service, index) => (
                <div key={index} className="w-full md:w-auto md:max-w-xs">
                    <ServiceCard {...service} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. TESTIMONIALS SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-10">What Our Patients Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {patientReviews.map((review, index) => (
                <PatientReviewCard key={index} {...review} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. SPECIALISTS SECTION (New Content) */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-10">Meet Our Specialists</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialistsData.map((specialist, index) => (
                <SpecialistCard key={index} {...specialist} />
              ))}
            </div>
          </div>
        </section>
        
      

      </main>
    </div>
  );
}
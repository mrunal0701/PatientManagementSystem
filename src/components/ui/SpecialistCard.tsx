
import Image from 'next/image';
import { Star } from 'lucide-react';

interface SpecialistCardProps {
  name: string;
  specialty: string;
  bio: string;
}

export default function SpecialistCard({ name, specialty, bio }: SpecialistCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 text-center hover:shadow-xl transition duration-300">
      <div className="w-24 h-24 mx-auto mb-4">
        <Image 
          src={`/images/${name.replace(/\s+/g, '')}.png`} // Assumes images exist in public/images
          alt={name} 
          width={96} 
          height={96} 
          className="rounded-full object-cover border-4 border-blue-100" 
        />
      </div>
      <h3 className="text-xl font-bold text-gray-800">Dr. {name}</h3>
      <p className="text-blue-600 font-medium mb-2">{specialty}</p>
      <p className="text-gray-500 text-sm">{bio}</p>
      <div className="flex justify-center mt-3 text-yellow-500">
        {/* Placeholder for ratings */}
        <Star size={16} fill="currentColor" stroke="none" />
        <Star size={16} fill="currentColor" stroke="none" />
        <Star size={16} fill="currentColor" stroke="none" />
        <Star size={16} fill="currentColor" stroke="none" />
        <Star size={16} fill="currentColor" stroke="none" />
      </div>
    </div>
  );
}
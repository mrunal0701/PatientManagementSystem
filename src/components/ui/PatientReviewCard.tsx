import Image from 'next/image';
import { Star } from 'lucide-react';

interface PatientReviewProps {
  name: string;
  image: string;
  rating: number;
  review: string;
  viewProfile?: boolean;
}

// FIX: Added 'image' to the destructured props below
export default function PatientReviewCard({ name, image, rating, review, viewProfile }: PatientReviewProps) {
  const stars = Array(5).fill(0).map((_, i) => (
    <Star key={i} size={16} fill={i < rating ? 'gold' : 'gray'} strokeWidth={i < rating ? 0 : 1} color={i < rating ? 'gold' : 'gray'} />
  ));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col md:flex-row items-start md:items-center space-x-4">
      <div className="flex-shrink-0">
        <Image 
          src={image}
          alt={name} 
          width={60} 
          height={60} 
          className="rounded-full object-cover" 
        />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <div className="flex items-center space-x-1 mb-1">
          {stars}
          <span className="text-sm font-semibold text-gray-700 ml-2">{rating.toFixed(1)}</span>
        </div>
        <p className="text-sm text-gray-500 italic">&quot;{review}&quot;</p>
        {viewProfile && (
          <a href="#" className="text-blue-600 text-sm font-semibold mt-2 inline-block hover:underline">
            View Profile
          </a>
        )}
      </div>
    </div>
  );
}
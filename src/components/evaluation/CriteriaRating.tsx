import { Star } from "lucide-react";

interface CriteriaRatingProps {
  label: string;
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const CriteriaRating = ({ label, rating, onRatingChange }: CriteriaRatingProps) => {
  return (
    <div className="space-y-2">
      <p className="font-medium text-sm">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= rating ? "fill-hris-green text-hris-green" : "text-gray-300 hover:text-hris-green"
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    </div>
  );
};
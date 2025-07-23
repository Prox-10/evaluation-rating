import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CriteriaRating } from "./CriteriaRating";

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  rating: number;
  notes: string;
  criteriaRatings?: Record<string, number>;
}

interface EvaluationModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeId: string, criteriaRatings: Record<string, number>, notes: string, averageRating: number) => void;
}

const CRITERIA_BY_DEPARTMENT = {
  Field: [
    "Work Quality",
    "Safety Compliance", 
    "Equipment Handling",
    "Teamwork",
    "Punctuality"
  ],
  Packing: [
    "Packaging Speed",
    "Quality Control",
    "Attention to Detail", 
    "Organization",
    "Safety Protocols"
  ],
  Office: [
    "Communication Skills",
    "Technical Proficiency",
    "Problem Solving",
    "Time Management",
    "Professional Conduct"
  ]
};

export const EvaluationModal = ({ employee, isOpen, onClose, onSave }: EvaluationModalProps) => {
  const [criteriaRatings, setCriteriaRatings] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (employee) {
      setCriteriaRatings(employee.criteriaRatings || {});
      setNotes(employee.notes || "");
    }
  }, [employee]);

  useEffect(() => {
    const ratings = Object.values(criteriaRatings);
    if (ratings.length > 0) {
      const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      setAverageRating(Math.round(average * 10) / 10);
    } else {
      setAverageRating(0);
    }
  }, [criteriaRatings]);

  if (!employee) return null;

  const criteria = CRITERIA_BY_DEPARTMENT[employee.department as keyof typeof CRITERIA_BY_DEPARTMENT] || [];

  const handleCriteriaRatingChange = (criterion: string, rating: number) => {
    setCriteriaRatings(prev => ({
      ...prev,
      [criterion]: rating
    }));
  };

  const handleSave = () => {
    onSave(employee.id, criteriaRatings, notes, averageRating);
    onClose();
  };

  const isComplete = criteria.every(criterion => criteriaRatings[criterion] > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-hris-green">Evaluate Employee</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Employee Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{employee.name}</h3>
            <p className="text-muted-foreground">{employee.id}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant={employee.department === "Field" ? "default" : "secondary"}>
                {employee.department}
              </Badge>
              <Badge variant="outline">{employee.position}</Badge>
            </div>
          </div>

          {/* Criteria Ratings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-hris-green">Evaluation Criteria</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criteria.map((criterion) => (
                <CriteriaRating
                  key={criterion}
                  label={criterion}
                  rating={criteriaRatings[criterion] || 0}
                  onRatingChange={(rating) => handleCriteriaRatingChange(criterion, rating)}
                />
              ))}
            </div>
          </div>

          {/* Average Score Display */}
          {averageRating > 0 && (
            <div className="bg-hris-green-light p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-3xl font-bold text-hris-green">{averageRating.toFixed(1)}</p>
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating) ? "fill-hris-green text-hris-green" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="font-medium text-sm">Additional Notes</label>
            <Textarea
              placeholder="Add any additional comments about the employee's performance..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              className="bg-hris-green hover:bg-hris-green-dark text-white"
              onClick={handleSave}
              disabled={!isComplete}
            >
              Save Evaluation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
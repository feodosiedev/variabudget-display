
import { CAFApplication } from "@/types/caf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File, ExternalLink, Users } from "lucide-react";

interface CAFApplicationActionsProps {
  caf: CAFApplication;
  attendanceValue: number;
  onAttendanceChange: (value: string) => void;
  onSaveAttendance: () => void;
  isUpdating: boolean;
}

const CAFApplicationActions = ({ 
  caf, 
  attendanceValue,
  onAttendanceChange,
  onSaveAttendance,
  isUpdating
}: CAFApplicationActionsProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Actions</h4>
      
      <div className="space-y-3">
        {caf.pdfLink && (
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <a href={caf.pdfLink} target="_blank" rel="noopener noreferrer">
              <File className="mr-1" />
              View Application PDF
              <ExternalLink className="ml-auto h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Update Tenant Attendance:</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="number"
                min="0"
                placeholder="Number of tenants"
                value={attendanceValue}
                onChange={e => onAttendanceChange(e.target.value)}
              />
            </div>
            <Button 
              onClick={onSaveAttendance}
              disabled={isUpdating}
            >
              <Users className="mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAFApplicationActions;


import { CAFApplication } from "@/types/caf";
import { formatCurrency } from "@/utils/formatters";
import { FileText, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import CAFApplicationDetails from "./CAFApplicationDetails";
import CAFApplicationActions from "./CAFApplicationActions";

interface CAFApplicationItemProps {
  caf: CAFApplication;
  isOpen: boolean;
  onToggle: () => void;
  attendanceValue: number;
  onAttendanceChange: (value: string) => void;
  onSaveAttendance: () => void;
  isUpdating: boolean;
}

const CAFApplicationItem = ({
  caf,
  isOpen,
  onToggle,
  attendanceValue,
  onAttendanceChange,
  onSaveAttendance,
  isUpdating
}: CAFApplicationItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-500";
      case "Pending": return "bg-yellow-500";
      case "Rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onToggle}
      className="border rounded-lg overflow-hidden"
    >
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-muted/20 cursor-pointer">
        <div className="flex items-start space-x-3">
          <div className={`${getStatusColor(caf.approvalStatus)} w-3 h-3 rounded-full mt-1.5`}></div>
          <div>
            <h3 className="font-medium">{caf.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground space-x-3 mt-1">
              <span className="flex items-center">
                <FileText className="h-3.5 w-3.5 mr-1" />
                CAF #{caf.id}
              </span>
              <span className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {caf.eventType}
              </span>
            </div>
          </div>
        </div>
        
        <CollapsibleTrigger asChild>
          <div className="flex items-center mt-2 sm:mt-0">
            <div className="text-right mr-3">
              <div className="font-medium">
                {formatCurrency(caf.purchaseAmount)}
              </div>
              <div className="text-xs text-muted-foreground">
                {caf.approvalStatus === "Approved" ? "Approved" : "Requested"}: {formatCurrency(caf.requestedAmount)}
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="px-4 pb-4 border-t pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <CAFApplicationDetails caf={caf} />
            <CAFApplicationActions 
              caf={caf}
              attendanceValue={attendanceValue}
              onAttendanceChange={onAttendanceChange}
              onSaveAttendance={onSaveAttendance}
              isUpdating={isUpdating}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CAFApplicationItem;

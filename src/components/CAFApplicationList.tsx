
import { useState } from "react";
import { CAFApplication } from "@/types/caf";
import { formatCurrency } from "@/utils/formatters";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  File, 
  FileText, 
  User, 
  Users 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CAFApplicationListProps {
  cafApplications: CAFApplication[];
  onUpdateAttendance: (cafId: string, attendanceCount: number) => void;
  isUpdating: boolean;
}

const CAFApplicationList = ({ 
  cafApplications, 
  onUpdateAttendance,
  isUpdating
}: CAFApplicationListProps) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [attendanceValues, setAttendanceValues] = useState<Record<string, number>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAttendanceChange = (id: string, value: string) => {
    const numberValue = parseInt(value) || 0;
    setAttendanceValues(prev => ({
      ...prev,
      [id]: numberValue
    }));
  };

  const handleSaveAttendance = (id: string) => {
    onUpdateAttendance(id, attendanceValues[id] || 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-500";
      case "Pending": return "bg-yellow-500";
      case "Rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {cafApplications.map((caf) => (
        <Collapsible 
          key={caf.id} 
          open={openItems[caf.id]} 
          onOpenChange={() => toggleItem(caf.id)}
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
                {openItems[caf.id] ? (
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
                <div>
                  <h4 className="text-sm font-medium mb-2">CAF Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={
                        caf.approvalStatus === "Approved" 
                          ? "default" 
                          : caf.approvalStatus === "Rejected" 
                            ? "destructive" 
                            : "secondary"
                      }>
                        {caf.approvalStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Event Type:</span>
                      <span className="text-sm">{caf.eventType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Requested Amount:</span>
                      <span className="text-sm">{formatCurrency(caf.requestedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Purchase Amount:</span>
                      <span className="text-sm">{formatCurrency(caf.purchaseAmount)}</span>
                    </div>
                    {caf.tenantsAttended !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tenants Attended:</span>
                        <span className="text-sm">{caf.tenantsAttended}</span>
                      </div>
                    )}
                  </div>
                </div>
                
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
                            value={attendanceValues[caf.id] || caf.tenantsAttended || ''}
                            onChange={e => handleAttendanceChange(caf.id, e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={() => handleSaveAttendance(caf.id)}
                          disabled={isUpdating}
                        >
                          <Users className="mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default CAFApplicationList;

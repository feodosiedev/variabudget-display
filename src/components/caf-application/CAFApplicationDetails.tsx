
import { CAFApplication } from "@/types/caf";
import { formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";

interface CAFApplicationDetailsProps {
  caf: CAFApplication;
}

const CAFApplicationDetails = ({ caf }: CAFApplicationDetailsProps) => {
  return (
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
  );
};

export default CAFApplicationDetails;

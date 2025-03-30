
import { useState } from "react";
import { CAFApplication } from "@/types/caf";
import { Card } from "@/components/ui/card";
import CAFApplicationItem from "./CAFApplicationItem";

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

  return (
    <div className="space-y-4">
      {cafApplications.map((caf) => (
        <CAFApplicationItem 
          key={caf.id}
          caf={caf}
          isOpen={openItems[caf.id]}
          onToggle={() => toggleItem(caf.id)}
          attendanceValue={attendanceValues[caf.id] || caf.tenantsAttended || 0}
          onAttendanceChange={(value) => handleAttendanceChange(caf.id, value)}
          onSaveAttendance={() => handleSaveAttendance(caf.id)}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
};

export default CAFApplicationList;

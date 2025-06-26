import { OrderData } from "../../types";
import { User, Phone, MapPin, Building2 } from "lucide-react";

interface DoctorInfoProps {
  doctor: OrderData['doctor'];
  compact?: boolean;
}

export const DoctorInfo = ({ doctor, compact = false }: DoctorInfoProps) => {
  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <User size={14} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{doctor.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{doctor.city}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <User size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{doctor.name}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Phone size={16} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{doctor.phone}</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{doctor.clinicName}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {doctor.clinicAddress}, {doctor.city}, {doctor.state} {doctor.pincode}
          </span>
        </div>
      </div>
    </div>
  );
};
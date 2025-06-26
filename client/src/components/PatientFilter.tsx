
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PatientFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  patientFilter: string;
  onPatientChange: (value: string) => void;
}

const PatientFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  patientFilter,
  onPatientChange
}: PatientFilterProps) => {
  const patients = ['All Patients', 'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emma Davis', 'Tom Brown'];

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="relative flex-1 md:w-60">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="Search by Order ID, Patient or Tag"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 input-field focus-ring transition-colors"
        />
      </div>
      
      <Select value={patientFilter} onValueChange={onPatientChange}>
        <SelectTrigger className="w-full md:w-48 input-field focus-ring transition-colors">
          <SelectValue placeholder="Filter by patient" />
        </SelectTrigger>
        <SelectContent>
          {patients.map((patient) => (
            <SelectItem key={patient} value={patient}>
              {patient}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-40 input-field focus-ring transition-colors">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="trial-sent">Trial Sent</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PatientFilter;

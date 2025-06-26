import { OrderData } from "../../types";
import { Badge } from "@/components/ui/badge";

interface ToothSummaryProps {
  toothGroups: OrderData['toothGroups'];
  compact?: boolean;
  maxDisplay?: number;
}

export const ToothSummary = ({ toothGroups, compact = false, maxDisplay = 3 }: ToothSummaryProps) => {
  // Extract all teeth from tooth groups and format in FDI notation
  const allTeeth = toothGroups.flatMap((group: any) => group.teeth || []);
  const uniqueTeeth = Array.from(new Set(allTeeth)).sort((a: number, b: number) => a - b);

  if (uniqueTeeth.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">No teeth selected</span>
    );
  }

  // Format teeth in FDI notation (e.g., 11, 21, 31, 41)
  const formatToothFDI = (tooth: number): string => {
    return tooth.toString();
  };

  if (compact) {
    const displayTeeth = uniqueTeeth.slice(0, maxDisplay);
    const remainingCount = uniqueTeeth.length - maxDisplay;

    return (
      <div className="flex flex-wrap gap-1">
        {displayTeeth.map((tooth, idx) => (
          <Badge key={`tooth-${tooth}-${idx}`} variant="outline" className="text-xs px-2 py-0">
            {formatToothFDI(tooth)}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge variant="outline" className="text-xs px-2 py-0">
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Teeth:</span>
        <span className="text-sm text-foreground">
          {uniqueTeeth.map(formatToothFDI).join(", ")}
        </span>
      </div>
      {toothGroups.length > 0 && (
        <div className="space-y-1">
          {toothGroups.map((group, index) => (
            <div key={group.groupId || index} className="text-xs text-muted-foreground">
              <span className="font-medium">Group {index + 1}:</span> {group.type}
              {group.material && <span> - {group.material}</span>}
              {group.shade && <span> (Shade: {group.shade})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
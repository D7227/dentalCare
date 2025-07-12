interface BillingStatCardProps {
  title?: string;
  icon?: React.ReactNode;
  value?: string;
  valueClassName?: string;
  subtext?: string;
  subvalue?: string;
  actions?: React.ReactNode;
  gradient?: string;
  borderColor?: string;
  isTotalDue?: boolean; // NEW
}

const BillingStatCard = ({
  title,
  icon,
  value,
  valueClassName,
  subtext,
  subvalue,
  actions,
  gradient,
  borderColor,
  isTotalDue, // <- add this line!
}: BillingStatCardProps) => {
  const isDual = !!subtext && !!subvalue && !actions;

  return (
    <div
      className="relative rounded-xl p-4 min-h-[110px] border shadow-sm"
      style={{
        background: gradient,
        borderColor: borderColor,
      }}
    >
      {/* Special Layout for Total Due */}
      {isTotalDue ? (
        <div className="flex items-center justify-between h-full">
          {/* Left Side */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              {icon}
              <span>{title}</span>
            </div>
            <div className="text-2xl font-semibold text-[#DB1A1A]">{value}</div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      ) : isDual ? (
        // Dual layout for other cards with subtext/subvalue
        <div className="flex h-full">
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-base font-medium text-gray-700 mb-1">
              {icon}
              <span>{title}</span>
            </div>
            <div className={`text-2xl leading-none font-semibold ${valueClassName}`}>
              {value}
            </div>
          </div>
          <div className="w-px bg-gray-300 mx-4" />
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-base font-medium text-gray-700 mb-1">
              {subtext}
            </div>
            <div className="text-2xl leading-none font-semibold text-Black">
              {subvalue}
            </div>
          </div>
        </div>
      ) : (
        // Default vertical layout
        <>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            {icon}
            <span>{title}</span>
          </div>
          <div className="text-2xl font-bold text-black mb-1">{value}</div>
          {subtext && subvalue && (
            <div className="text-sm text-muted-foreground">
              {subtext}:{" "}
              <span className="font-semibold text-black">{subvalue}</span>
            </div>
          )}
          {actions && <div className="mt-2 flex gap-2">{actions}</div>}
        </>
      )}
    </div>
  );
};

export default BillingStatCard;

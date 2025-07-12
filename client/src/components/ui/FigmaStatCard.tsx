import { eyeIcon } from "@/assets/svg";
import React from "react";

interface FigmaStatCardProps {
  title: string;
  value: number | string;
  iconSrc: string;
  backgroundSrc: string;
  bigBackgroundSrc: string;
  onClick?: () => void;
  subtext?: string;
}

const FigmaStatCard: React.FC<FigmaStatCardProps> = ({
  title,
  value,
  iconSrc,
  backgroundSrc,
  bigBackgroundSrc,
  onClick,
  subtext,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative min-w-[176px] xl:min-w-[256px] h-[125px] cursor-pointer transition-all rounded-[10px] overflow-hidden"
    >
      {/* Background SVG */}
      {backgroundSrc && (
        <img
          src={backgroundSrc}
          alt="Background Mobile"
          className="absolute top-0 left-0 z-0 w-full h-full object-cover pointer-events-none xl:hidden"
          draggable={false}
        />
      )}

      {/* Background for Desktop */}
      {bigBackgroundSrc && (
        <img
          src={bigBackgroundSrc}
          alt="Background Desktop"
          className="absolute top-0 left-0 z-0 w-full h-full object-cover pointer-events-none hidden xl:block"
          draggable={false}
        />
      )}

      <div className="">
        <img
          src={iconSrc}
          alt="Background"
          className="absolute top-0 right-0 z-0 w-[32px] h-[32px] pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-30 flex flex-col justify-between h-full p-4">
        <div className="text-sm font-medium text-black max-w-[132px]">
          {title}
        </div>
        <div className="flex items-end justify-between">
          <div className="text-[28px] font-bold text-black leading-none">
            {value}
          </div>
          <div className="bg-white rounded-[8px] flex justify-center items-center p-[8px] shadow-md">
            <img src={eyeIcon} alt="Background" draggable={false} />
          </div>
        </div>
        {subtext && (
          <div className="text-xs text-muted-foreground mt-1">{subtext}</div>
        )}
      </div>
    </div>
  );
};

export default FigmaStatCard;

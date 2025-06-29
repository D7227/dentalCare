import React from 'react';

interface CircularProgressProps {
  value: number; // 0-100
  size?: number; // px
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ value, size = 48, strokeWidth = 5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="block" style={{ display: 'block' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E6F4F1" // light green background
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#07AD94" // teal progress
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.4s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.32}
        fill="#222"
        fontWeight="500"
      >
        {`${progress}%`}
      </text>
    </svg>
  );
};

export default CircularProgress; 

import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, className }) => (
  <div className={`bg-white rounded-lg shadow p-5 flex items-center ${className || ""}`}>
    {Icon && <Icon className="text-blue-500 w-8 h-8 mr-4" />}
    <div>
      <div className="text-gray-600 font-semibold flex items-center">
        {title}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  </div>
);

export default StatCard;

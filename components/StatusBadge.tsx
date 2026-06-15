import { getStatusColor, getStatusLabel } from "../lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const colorClasses = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {label}
    </span>
  );
}

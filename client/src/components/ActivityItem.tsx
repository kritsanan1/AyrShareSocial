import { Check, Clock, UserPlus, AlertCircle } from "lucide-react";

interface ActivityItemProps {
  type: 'published' | 'scheduled' | 'member-added' | 'error';
  title: string;
  description: string;
  timestamp: string;
}

const activityConfig = {
  published: {
    icon: Check,
    iconBg: 'bg-sage/10',
    iconColor: 'text-sage'
  },
  scheduled: {
    icon: Clock,
    iconBg: 'bg-warm-blue/10',
    iconColor: 'text-warm-blue'
  },
  'member-added': {
    icon: UserPlus,
    iconBg: 'bg-dusty-purple/10',
    iconColor: 'text-dusty-purple'
  },
  error: {
    icon: AlertCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  }
};

export default function ActivityItem({ type, title, description, timestamp }: ActivityItemProps) {
  const config = activityConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200">
      <div className={`w-10 h-10 ${config.iconBg} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
        <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
      </div>
    </div>
  );
}

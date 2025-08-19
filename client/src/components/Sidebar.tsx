import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { 
  BarChart3, 
  Calendar, 
  Edit, 
  Folder, 
  Link, 
  Settings, 
  Users, 
  Home 
} from "lucide-react";

interface SidebarNavItemProps {
  icon: any;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarNavItem({ icon: Icon, label, href, isActive, onClick }: SidebarNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-colors duration-200 ${
        isActive
          ? 'bg-sage/10 text-sage border border-sage/20'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const navigation = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Edit, label: 'Compose', href: '/compose' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Link, label: 'Connected Accounts', href: '/accounts' },
    { icon: Folder, label: 'Content Library', href: '/content' },
    { icon: Users, label: 'Team', href: '/team' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-sage to-soft-emerald text-white">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || 'User'
              }
            </div>
            <div className="text-sm text-gray-500">Marketing Manager</div>
          </div>
        </div>
      </div>
      
      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4 space-y-2 custom-scrollbar overflow-y-auto">
        {navigation.map((item) => (
          <SidebarNavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={location === item.href}
            onClick={() => setLocation(item.href)}
          />
        ))}
        
        <div className="pt-4 border-t border-gray-200 mt-4">
          <SidebarNavItem
            icon={Settings}
            label="Settings"
            href="/settings"
            isActive={location === '/settings'}
            onClick={() => setLocation('/settings')}
          />
        </div>
      </nav>
    </aside>
  );
}

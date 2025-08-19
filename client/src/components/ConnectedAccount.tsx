import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

interface ConnectedAccountProps {
  platform: string;
  name: string;
  followers: number;
  isConnected: boolean;
}

const platformConfig = {
  facebook: {
    icon: Facebook,
    color: 'bg-blue-500',
    name: 'Facebook'
  },
  instagram: {
    icon: Instagram,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    name: 'Instagram'
  },
  linkedin: {
    icon: Linkedin,
    color: 'bg-blue-600',
    name: 'LinkedIn'
  },
  twitter: {
    icon: Twitter,
    color: 'bg-black',
    name: 'Twitter'
  },
  x: {
    icon: Twitter,
    color: 'bg-black',
    name: 'X (Twitter)'
  }
};

export default function ConnectedAccount({ 
  platform, 
  name, 
  followers, 
  isConnected 
}: ConnectedAccountProps) {
  const config = platformConfig[platform as keyof typeof platformConfig] || {
    icon: () => <span className="text-white font-bold">{platform.charAt(0).toUpperCase()}</span>,
    color: 'bg-gray-500',
    name: platform
  };

  const Icon = config.icon;

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M followers`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K followers`;
    }
    return `${count} followers`;
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
      <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">{formatFollowers(followers)}</div>
      </div>
      <div 
        className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
        title={isConnected ? 'Connected' : 'Disconnected'}
      ></div>
    </div>
  );
}

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Globe } from "lucide-react";

interface Platform {
  id: string;
  platform: string;
  platformName: string;
  isActive: boolean;
}

interface PlatformSelectorProps {
  platforms: Platform[];
  selectedPlatforms: string[];
  onSelectionChange: (selected: string[]) => void;
}

const platformConfig = {
  facebook: {
    icon: Facebook,
    color: 'bg-blue-500',
    name: 'Facebook',
    textColor: 'text-blue-500'
  },
  instagram: {
    icon: Instagram,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    name: 'Instagram',
    textColor: 'text-pink-500'
  },
  linkedin: {
    icon: Linkedin,
    color: 'bg-blue-600',
    name: 'LinkedIn',
    textColor: 'text-blue-600'
  },
  twitter: {
    icon: Twitter,
    color: 'bg-black',
    name: 'Twitter',
    textColor: 'text-gray-900'
  },
  x: {
    icon: Twitter,
    color: 'bg-black',
    name: 'X (Twitter)',
    textColor: 'text-gray-900'
  },
  youtube: {
    icon: Youtube,
    color: 'bg-red-500',
    name: 'YouTube',
    textColor: 'text-red-500'
  },
  tiktok: {
    icon: Globe,
    color: 'bg-black',
    name: 'TikTok',
    textColor: 'text-gray-900'
  },
  pinterest: {
    icon: Globe,
    color: 'bg-red-600',
    name: 'Pinterest',
    textColor: 'text-red-600'
  }
};

export default function PlatformSelector({ 
  platforms, 
  selectedPlatforms, 
  onSelectionChange 
}: PlatformSelectorProps) {
  const handlePlatformToggle = (platformId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPlatforms, platformId]);
    } else {
      onSelectionChange(selectedPlatforms.filter(id => id !== platformId));
    }
  };

  // If no platforms are connected, show a message
  if (platforms.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-600 mb-2">No social accounts connected</div>
        <div className="text-sm text-gray-500">
          Connect your social media accounts to start publishing
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {platforms.map((platform) => {
        const config = platformConfig[platform.platform as keyof typeof platformConfig] || {
          icon: Globe,
          color: 'bg-gray-500',
          name: platform.platformName || platform.platform,
          textColor: 'text-gray-700'
        };
        
        const Icon = config.icon;
        const isSelected = selectedPlatforms.includes(platform.platform);
        const isDisabled = !platform.isActive;

        return (
          <Label
            key={platform.id}
            htmlFor={`platform-${platform.id}`}
            className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              isSelected 
                ? 'bg-sage/10 border-sage/30 shadow-soft' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
            } ${
              isDisabled 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            <Checkbox
              id={`platform-${platform.id}`}
              checked={isSelected}
              disabled={isDisabled}
              onCheckedChange={(checked) => 
                handlePlatformToggle(platform.platform, checked as boolean)
              }
              className="data-[state=checked]:bg-sage data-[state=checked]:border-sage"
            />
            <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <span className={`font-medium ${config.textColor}`}>
                {platform.platformName || config.name}
              </span>
              {!platform.isActive && (
                <div className="text-xs text-gray-500">Disconnected</div>
              )}
            </div>
            {isSelected && (
              <div className="w-2 h-2 bg-sage rounded-full"></div>
            )}
          </Label>
        );
      })}
    </div>
  );
}

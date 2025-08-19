import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ExternalLink, Plus, Loader2 } from "lucide-react";

export default function SocialAccountConnector() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);

  // Create Ayrshare profile mutation
  const createProfileMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ayrshare/create-profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate JWT and open linking page mutation
  const generateJWTMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ayrshare/generate-jwt');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.linkingUrl) {
        // Open Ayrshare linking page in new window
        const linkingWindow = window.open(
          data.linkingUrl, 
          'ayrshare-linking',
          'width=800,height=700,scrollbars=yes,resizable=yes'
        );
        
        if (linkingWindow) {
          // Poll for window closure
          const pollTimer = setInterval(() => {
            if (linkingWindow.closed) {
              clearInterval(pollTimer);
              setIsConnecting(false);
              // Refresh social accounts after linking
              queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
              toast({
                title: "Success",
                description: "Social accounts linked successfully!",
              });
            }
          }, 1000);
        }
      }
    },
    onError: (error) => {
      setIsConnecting(false);
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to open linking page. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleConnectAccounts = async () => {
    setIsConnecting(true);
    
    try {
      // First ensure user has an Ayrshare profile
      await createProfileMutation.mutateAsync();
      
      // Then generate JWT and open linking page
      await generateJWTMutation.mutateAsync();
    } catch (error) {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="shadow-soft border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5 text-sage" />
          <span>Connect Social Accounts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-sage" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Link Your Social Media Accounts
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Connect your Facebook, Instagram, LinkedIn, Twitter, and other social media accounts 
              to start managing all your content from one place.
            </p>
          </div>
          
          <Button 
            onClick={handleConnectAccounts}
            disabled={isConnecting || createProfileMutation.isPending || generateJWTMutation.isPending}
            className="bg-sage hover:bg-sage/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            {(isConnecting || createProfileMutation.isPending || generateJWTMutation.isPending) ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Connect Social Accounts
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            You'll be redirected to a secure page to authorize your accounts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
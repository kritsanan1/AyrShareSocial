import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import PlatformSelector from "@/components/PlatformSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { CloudUpload, Calendar, Save, Eye, Bot, Folder, RotateCcw } from "lucide-react";

interface Platform {
  id: string;
  platform: string;
  platformName: string;
  isActive: boolean;
}

interface PostData {
  content: string;
  platforms: string[];
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt?: Date;
}

export default function Compose() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Fetch social accounts for platform selection
  const { data: socialAccounts = [] } = useQuery<any[]>({
    queryKey: ["/api/social-accounts"],
  });

  // Fetch content assets
  const { data: contentAssets = [] } = useQuery<any[]>({
    queryKey: ["/api/content-assets"],
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: PostData) => {
      const response = await apiRequest('POST', '/api/posts', postData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post created successfully!",
        description: "Your content has been published.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      // Reset form
      setContent("");
      setSelectedPlatforms([]);
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
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePublish = () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform required",
        description: "Please select at least one platform to publish to.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      content,
      platforms: selectedPlatforms,
      status: 'published',
    });
  };

  const handleSaveDraft = () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content to save as draft.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      content,
      platforms: selectedPlatforms,
      status: 'draft',
    });
  };

  const aiSuggestions = [
    {
      content: "🎉 Excited to share our latest product update! Here's what's new and how it can benefit you...",
      category: "Product Announcement"
    },
    {
      content: "Monday motivation: Small steps lead to big achievements. What's your goal this week?",
      category: "Motivational"
    },
    {
      content: "Behind the scenes: Here's how our team creates magic every day...",
      category: "Behind the Scenes"
    }
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setContent(suggestion);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <section className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Compose Post</h1>
              <p className="text-gray-600">Create and schedule your social media content across multiple platforms</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Compose Area */}
              <div className="lg:col-span-2">
                <Card className="shadow-soft border-gray-100">
                  <CardContent className="p-6">
                    {/* Platform Selection */}
                    <div className="mb-6">
                      <Label className="text-lg font-semibold text-gray-900 mb-4 block">Select Platforms</Label>
                      <PlatformSelector
                        platforms={socialAccounts as Platform[]}
                        selectedPlatforms={selectedPlatforms}
                        onSelectionChange={setSelectedPlatforms}
                      />
                    </div>

                    {/* Content Input */}
                    <div className="mb-6">
                      <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Content</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind? Share your thoughts with your audience..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200 resize-none"
                        rows={6}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">{content.length}</span>/280 characters
                        </div>
                        <Button variant="ghost" size="sm" className="text-sage hover:text-sage/80">
                          <Bot className="w-4 h-4 mr-1" />
                          AI Suggestions
                        </Button>
                      </div>
                    </div>

                    {/* Media Upload */}
                    <div className="mb-6">
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Media</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-sage transition-colors duration-200">
                        <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-600 mb-2">Drag and drop your images or videos here</div>
                        <div className="text-sm text-gray-500 mb-4">or</div>
                        <Button variant="default" className="bg-sage hover:bg-sage/90">
                          Browse Files
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        <Button variant="ghost" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleSaveDraft}
                          disabled={createPostMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Draft
                        </Button>
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button 
                          onClick={handlePublish}
                          disabled={createPostMutation.isPending}
                          className="bg-sage hover:bg-sage/90 text-white shadow-soft"
                        >
                          {createPostMutation.isPending ? "Publishing..." : "Publish Now"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Post Preview */}
                <Card className="shadow-soft border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-lg">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPlatforms.includes('facebook') && (
                      <div className="border border-gray-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">f</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Business Page</div>
                            <div className="text-xs text-gray-500">2 min</div>
                          </div>
                        </div>
                        <div className="text-gray-800 text-sm">
                          {content || "Your post content will appear here as you type..."}
                        </div>
                      </div>
                    )}
                    
                    {selectedPlatforms.includes('instagram') && (
                      <div className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">IG</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">@yourhandle</div>
                            <div className="text-xs text-gray-500">2 min</div>
                          </div>
                        </div>
                        <div className="text-gray-800 text-sm">
                          {content || "Your post content will appear here as you type..."}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Content Library */}
                <Card className="shadow-soft border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-lg">Content Library</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contentAssets.length > 0 ? (
                        contentAssets.slice(0, 3).map((asset: any) => (
                          <div key={asset.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xs font-medium">{asset.type?.toUpperCase()}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{asset.name}</div>
                              <div className="text-xs text-gray-500">{asset.type} • {(asset.size / 1024 / 1024).toFixed(1)} MB</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No assets yet</p>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" className="w-full mt-4 text-sage hover:text-sage/80">
                      <Folder className="w-4 h-4 mr-2" />
                      Browse All Assets
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Content Suggestions */}
                <Card className="shadow-soft border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Bot className="w-5 h-5 text-sage mr-2 inline" />
                      AI Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiSuggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion.content)}
                          className="p-3 bg-sage/5 border border-sage/20 rounded-xl cursor-pointer hover:bg-sage/10 transition-colors duration-200"
                        >
                          <div className="text-sm text-gray-800">{suggestion.content}</div>
                          <div className="text-xs text-sage mt-1">{suggestion.category}</div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="ghost" size="sm" className="w-full mt-4 text-sage hover:text-sage/80">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Generate More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

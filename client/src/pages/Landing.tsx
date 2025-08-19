import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, BarChart3, Calendar, Users, Zap, Shield } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sage rounded-xl flex items-center justify-center">
                <Share className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-800">SocialFlow Pro</span>
            </div>
            <Button onClick={handleLogin} className="bg-sage hover:bg-sage/90 text-white">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sage/5 via-white to-warm-blue/5 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your 
                <span className="text-sage"> Social Media</span> 
                Strategy
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Professional social media management platform with Ayrshare API integration. 
                Schedule posts, analyze performance, and manage multiple social accounts from one dashboard.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleLogin}
                size="lg"
                className="bg-sage hover:bg-sage/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-soft"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-sage text-gray-700 hover:text-sage px-8 py-4 rounded-xl font-semibold text-lg"
              >
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your workflow and maximize your social media impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center mb-4">
                  <Share className="w-6 h-6 text-sage" />
                </div>
                <CardTitle>Multi-Platform Publishing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Publish to Facebook, Instagram, LinkedIn, Twitter, and more with a single click using Ayrshare API.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-warm-blue/10 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-warm-blue" />
                </div>
                <CardTitle>Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Plan and schedule your content in advance with our intuitive calendar interface.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-dusty-purple/10 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-dusty-purple" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track performance, measure ROI, and get actionable insights to optimize your strategy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-warm-amber/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-warm-amber" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Work seamlessly with your team using real-time collaboration and approval workflows.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-muted-rose/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-muted-rose" />
                </div>
                <CardTitle>AI-Powered Content</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate engaging posts and captions with our advanced AI content creation tools.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-soft-emerald/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-soft-emerald" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Enterprise-grade security with reliable API integrations and data protection.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-sage hover:bg-sage/90 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

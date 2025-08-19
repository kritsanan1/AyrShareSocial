import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Fetch scheduled posts
  const { data: scheduledPosts = [] } = useQuery<any[]>({
    queryKey: ["/api/posts/scheduled"],
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayPosts = scheduledPosts.filter((post: any) => {
        const postDate = new Date(post.scheduledAt);
        return postDate.toDateString() === currentDay.toDateString();
      });
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        posts: dayPosts
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const getEventColor = (platforms: string[]) => {
    if (platforms.includes('facebook')) return 'bg-sage/10 text-sage border-sage/20';
    if (platforms.includes('instagram')) return 'bg-warm-blue/10 text-warm-blue border-warm-blue/20';
    if (platforms.includes('linkedin')) return 'bg-dusty-purple/10 text-dusty-purple border-dusty-purple/20';
    return 'bg-warm-amber/10 text-warm-amber border-warm-amber/20';
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <section className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Calendar</h1>
              <p className="text-gray-600">Plan and schedule your content strategy across all platforms</p>
            </div>

            {/* Calendar Header */}
            <Card className="shadow-soft border-gray-100 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex bg-gray-100 rounded-xl p-1">
                      <Button
                        variant={view === 'month' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('month')}
                        className={view === 'month' ? 'bg-white shadow-soft text-sage' : ''}
                      >
                        Month
                      </Button>
                      <Button
                        variant={view === 'week' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('week')}
                        className={view === 'week' ? 'bg-white shadow-soft text-sage' : ''}
                      >
                        Week
                      </Button>
                      <Button
                        variant={view === 'day' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('day')}
                        className={view === 'day' ? 'bg-white shadow-soft text-sage' : ''}
                      >
                        Day
                      </Button>
                    </div>
                    <Button className="bg-sage hover:bg-sage/90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Grid */}
            <Card className="shadow-soft border-gray-100 overflow-hidden">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {DAYS.map(day => (
                  <div key={day} className="p-4 text-center font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Body */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`h-32 border-r border-b border-gray-100 p-2 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                      !day.isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : ''
                    }`}
                  >
                    <div className={`text-sm mb-2 ${
                      day.isToday 
                        ? 'font-bold text-sage bg-sage/10 rounded-full w-6 h-6 flex items-center justify-center' 
                        : day.isCurrentMonth 
                        ? 'text-gray-900' 
                        : 'text-gray-400'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.posts.slice(0, 2).map((post: any, postIndex: number) => (
                        <div 
                          key={postIndex}
                          className={`text-xs px-2 py-1 rounded-md border ${getEventColor(post.platforms || [])}`}
                          title={post.content}
                        >
                          {post.content?.slice(0, 20)}...
                        </div>
                      ))}
                      {day.posts.length > 2 && (
                        <div className="text-xs text-gray-500 px-2">
                          +{day.posts.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}

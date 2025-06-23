import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Timeline from "@/components/timeline";
import MoodTracker from "@/components/mood-tracker";
import InsightsPanel from "@/components/insights-panel";
import MobileNav from "@/components/mobile-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Calendar, Award } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: entries } = useQuery({
    queryKey: ["/api/journal-entries"],
  });

  const { data: insights } = useQuery({
    queryKey: ["/api/insights"],
  });

  const { data: moodAnalytics } = useQuery({
    queryKey: ["/api/mood-analytics"],
  });

  const totalEntries = entries?.length || 0;
  const thisWeekEntries = entries?.filter((entry: any) => {
    const entryDate = new Date(entry.createdAt);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return entryDate >= oneWeekAgo;
  }).length || 0;

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lavender-deep mb-2">Your Wellness Dashboard</h1>
          <p className="text-warm/80">Track your progress and discover insights from your journaling journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="floating-card card-shadow border-none">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-lavender-deep mx-auto mb-2" />
              <div className="text-2xl font-bold text-warm">{totalEntries}</div>
              <div className="text-sm text-warm/60">Total Entries</div>
            </CardContent>
          </Card>

          <Card className="floating-card card-shadow border-none">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-lavender-deep mx-auto mb-2" />
              <div className="text-2xl font-bold text-warm">{thisWeekEntries}</div>
              <div className="text-sm text-warm/60">This Week</div>
            </CardContent>
          </Card>

          <Card className="floating-card card-shadow border-none">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-lavender-deep mx-auto mb-2" />
              <div className="text-2xl font-bold text-warm">{insights?.length || 0}</div>
              <div className="text-sm text-warm/60">Insights</div>
            </CardContent>
          </Card>

          <Card className="floating-card card-shadow border-none">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-lavender-deep mx-auto mb-2" />
              <div className="text-2xl font-bold text-warm">
                {moodAnalytics?.trend === 'improving' ? '↗️' : 
                 moodAnalytics?.trend === 'declining' ? '↘️' : '→'}
              </div>
              <div className="text-sm text-warm/60">Mood Trend</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mood Analytics */}
            {moodAnalytics && (
              <Card className="floating-card card-shadow border-none">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-lavender-deep mb-4">Mood Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-warm">Overall Trend</span>
                      <span className="capitalize font-medium text-lavender-deep">
                        {moodAnalytics.trend} {
                          moodAnalytics.trend === 'improving' ? '↗️' : 
                          moodAnalytics.trend === 'declining' ? '↘️' : '→'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-warm">Predominant Mood</span>
                      <span className="font-medium text-lavender-deep">{moodAnalytics.predominantMood}</span>
                    </div>
                    {moodAnalytics.insights.length > 0 && (
                      <div className="bg-cream/50 rounded-xl p-4">
                        <h4 className="font-medium text-warm mb-2">Key Insights</h4>
                        <ul className="space-y-1">
                          {moodAnalytics.insights.slice(0, 3).map((insight: string, index: number) => (
                            <li key={index} className="text-sm text-warm/80">• {insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Timeline />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <MoodTracker />
            <InsightsPanel />
            
            {/* Generate New Insights */}
            <Card className="floating-card card-shadow border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-lavender-deep mb-4">Fresh Insights</h3>
                <p className="text-sm text-warm/80 mb-4">
                  Generate new insights based on your recent journal entries
                </p>
                <Button 
                  className="w-full bg-lavender-deep hover:bg-lavender-deep/90 text-cream"
                  onClick={() => {
                    // This will trigger a mutation to generate new insights
                    fetch('/api/insights/generate', { 
                      method: 'POST',
                      credentials: 'include'
                    });
                  }}
                >
                  Generate Insights
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

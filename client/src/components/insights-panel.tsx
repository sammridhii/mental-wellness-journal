import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Star, Play, Heart, Footprints, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function InsightsPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: insights } = useQuery({
    queryKey: ["/api/insights"],
  });

  const { data: entries } = useQuery({
    queryKey: ["/api/journal-entries"],
  });

  const adviceMutation = useMutation({
    mutationFn: async (topic: string) => {
      return await apiRequest("POST", "/api/advice", {
        topic,
        request: `I need advice about ${topic} based on my recent journal entries.`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/advice"] });
      toast({
        title: "Advice generated",
        description: "Your personalized advice is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate advice.",
        variant: "destructive",
      });
    },
  });

  // Get recent stress-related entries for advice generation
  const hasStressEntries = entries?.some((entry: any) => 
    entry.content.toLowerCase().includes('stress') || 
    entry.content.toLowerCase().includes('overwhelm') ||
    entry.mood === 'anxious'
  );

  return (
    <div className="space-y-8">
      {/* Quick Advice */}
      <Card className="floating-card card-shadow border-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-lavender-deep mb-4 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Personalized Advice</span>
          </h3>
          
          <div className="space-y-4">
            {hasStressEntries && (
              <div className="bg-gradient-to-r from-lavender-light to-lavender-medium rounded-xl p-4">
                <h4 className="font-medium text-warm mb-2">Stress Management</h4>
                <p className="text-sm text-warm/80 mb-3">Based on your recent entries about stress</p>
                <Button 
                  onClick={() => adviceMutation.mutate('stress')}
                  disabled={adviceMutation.isPending}
                  className="bg-cream/70 hover:bg-cream text-warm w-full"
                  size="sm"
                >
                  {adviceMutation.isPending ? "Generating..." : "Get Stress Advice"}
                </Button>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm">Breathing Exercise</span>
                <Button variant="ghost" size="sm" className="text-lavender-deep hover:text-lavender-deep/80">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm">Gratitude Practice</span>
                <Button variant="ghost" size="sm" className="text-lavender-deep hover:text-lavender-deep/80">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm">Mindful Walk</span>
                <Button variant="ghost" size="sm" className="text-lavender-deep hover:text-lavender-deep/80">
                  <Footprints className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Insights */}
      <Card className="floating-card card-shadow border-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-lavender-deep mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Key Insights</span>
          </h3>
          
          <div className="space-y-4">
            {insights && insights.length > 0 ? (
              insights.slice(0, 3).map((insight: any) => (
                <div key={insight.id} className="bg-cream/50 rounded-xl p-4">
                  <div className="text-sm font-medium text-warm mb-1 capitalize">
                    {insight.insightType.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-warm/80">
                    {insight.description}
                  </div>
                  {insight.confidence && (
                    <div className="mt-2">
                      <div className="w-full bg-lavender-light rounded-full h-1">
                        <div 
                          className="bg-lavender-deep h-1 rounded-full transition-all duration-300"
                          style={{ width: `${insight.confidence}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-warm/60 mt-1">
                        {insight.confidence}% confidence
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-lavender-medium mx-auto mb-4" />
                <p className="text-sm text-warm/60 mb-4">
                  No insights yet. Keep journaling to discover patterns and growth opportunities.
                </p>
                <Button 
                  onClick={() => {
                    fetch('/api/insights/generate', { 
                      method: 'POST',
                      credentials: 'include'
                    }).then(() => {
                      queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className="border-lavender-medium text-lavender-deep hover:bg-lavender-light/30"
                >
                  Generate Insights
                </Button>
              </div>
            )}
          </div>
          
          {insights && insights.length > 0 && (
            <Button 
              variant="outline" 
              className="w-full mt-4 border-lavender-medium text-lavender-deep hover:bg-lavender-light/30"
            >
              View Full Analysis
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Privacy & Settings */}
      <Card className="floating-card card-shadow border-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-lavender-deep mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Privacy</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm">Private entries</span>
              <div className="w-8 h-4 bg-lavender-medium rounded-full relative">
                <div className="w-4 h-4 bg-cream rounded-full absolute right-0 top-0"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm">Daily reminders</span>
              <div className="w-8 h-4 bg-lavender-deep rounded-full relative">
                <div className="w-4 h-4 bg-cream rounded-full absolute right-0 top-0"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm">AI responses</span>
              <div className="w-8 h-4 bg-lavender-deep rounded-full relative">
                <div className="w-4 h-4 bg-cream rounded-full absolute right-0 top-0"></div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-lavender-deep hover:text-lavender-deep/80"
            size="sm"
          >
            Manage Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const moodEmojis: Record<string, string> = {
  happy: "😊",
  neutral: "😐", 
  sad: "😢",
  anxious: "😰",
  tired: "😴",
  frustrated: "😤",
  excited: "✨",
  confused: "🤔"
};

export default function MoodTracker() {
  const { data: entries } = useQuery({
    queryKey: ["/api/journal-entries"],
  });

  const { data: moodAnalytics } = useQuery({
    queryKey: ["/api/mood-analytics"],
  });

  // Get last 7 days of mood data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const weeklyMoods = last7Days.map(date => {
    const dateStr = date.toDateString();
    const entry = entries?.find((e: any) => 
      new Date(e.createdAt).toDateString() === dateStr && e.mood
    );
    return entry ? moodEmojis[entry.mood] || "😐" : "😐";
  });

  const positiveMoodCount = entries?.filter((e: any) => 
    e.mood && ['happy', 'excited'].includes(e.mood) && 
    new Date(e.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length || 0;

  return (
    <Card className="floating-card card-shadow border-none">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-lavender-deep mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Mood Trends</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-warm">This week</span>
            <div className="flex space-x-1">
              {weeklyMoods.map((mood, index) => (
                <div 
                  key={index}
                  className="w-6 h-6 rounded-full bg-lavender-light flex items-center justify-center text-xs"
                  title={`${last7Days[index].toLocaleDateString()}`}
                >
                  {mood}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-cream/50 rounded-xl p-4">
            <div className="text-xs text-warm/60 mb-1">Overall trend</div>
            <div className="text-sm font-medium text-lavender-deep">
              {moodAnalytics?.trend === 'improving' ? 'Improving ↗️' :
               moodAnalytics?.trend === 'declining' ? 'Needs attention ↘️' :
               'Stable →'}
            </div>
            <div className="text-xs text-warm/80 mt-1">
              {positiveMoodCount} positive days this week
            </div>
          </div>

          {moodAnalytics?.predominantMood && (
            <div className="bg-cream/50 rounded-xl p-4">
              <div className="text-xs text-warm/60 mb-1">Predominant mood</div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{moodEmojis[moodAnalytics.predominantMood]}</span>
                <span className="text-sm font-medium text-lavender-deep capitalize">
                  {moodAnalytics.predominantMood.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

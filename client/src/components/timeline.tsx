import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, MoreHorizontal } from "lucide-react";
import AiResponse from "./ai-response";

interface JournalEntry {
  id: number;
  title?: string;
  content: string;
  mood?: string;
  moodScore?: number;
  isPrivate: boolean;
  createdAt: string;
  aiResponses?: any[];
}

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

export default function Timeline() {
  const { data: entries, isLoading } = useQuery({
    queryKey: ["/api/journal-entries"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-lavender-deep flex items-center space-x-2">
          <History className="w-5 h-5" />
          <span>Recent Reflections</span>
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="floating-card card-shadow border-none">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-lavender-light rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-lavender-light rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-lavender-light rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-lavender-deep flex items-center space-x-2">
          <History className="w-5 h-5" />
          <span>Recent Reflections</span>
        </h3>
        <Card className="floating-card card-shadow border-none">
          <CardContent className="p-12 text-center">
            <History className="w-16 h-16 text-lavender-medium mx-auto mb-4" />
            <h4 className="text-lg font-medium text-warm mb-2">No entries yet</h4>
            <p className="text-warm/60">Start your journaling journey by writing your first reflection.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-lavender-deep flex items-center space-x-2">
        <History className="w-5 h-5" />
        <span>Recent Reflections</span>
      </h3>
      
      <div className="relative space-y-6">
        {/* Timeline connector */}
        <div className="absolute left-8 top-8 bottom-0 w-0.5 timeline-connector"></div>
        
        {entries.map((entry: JournalEntry, index: number) => (
          <div key={entry.id} className="relative flex space-x-6">
            <div className="w-4 h-4 rounded-full bg-lavender-medium flex-shrink-0 mt-2 z-10"></div>
            <div className="flex-1 space-y-4">
              <Card className="floating-card card-shadow border-none">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm text-warm/60 mb-1">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      {entry.mood && (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{moodEmojis[entry.mood] || entry.mood}</span>
                          <span className="text-sm font-medium text-warm capitalize">
                            {entry.mood.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-warm mb-4 leading-relaxed">
                    {entry.content.length > 300 
                      ? `${entry.content.substring(0, 300)}...`
                      : entry.content
                    }
                  </p>
                  
                  {entry.isPrivate && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-lavender-deep/10 text-xs text-lavender-deep">
                      Private Entry
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* AI Responses */}
              {entry.aiResponses && entry.aiResponses.length > 0 && (
                <div className="ml-8 space-y-4">
                  {entry.aiResponses.map((response) => (
                    <AiResponse key={response.id} response={response} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

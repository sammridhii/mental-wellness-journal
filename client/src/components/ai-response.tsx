import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AiResponseProps {
  response: {
    id: number;
    entryId: number;
    response: string;
    followUpQuestions?: string[];
    insights?: {
      emotions: string[];
      patterns: string[];
      suggestions: string[];
    };
    responseType: string;
    createdAt: string;
  };
}

export default function AiResponse({ response }: AiResponseProps) {
  const [selectedFollowUp, setSelectedFollowUp] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const followUpMutation = useMutation({
    mutationFn: async (followUpAnswer: string) => {
      return await apiRequest("POST", `/api/journal-entries/${response.entryId}/follow-up`, {
        followUpAnswer
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      toast({
        title: "Response sent",
        description: "Dr. Mira will provide a follow-up response shortly.",
      });
      setSelectedFollowUp(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send follow-up response.",
        variant: "destructive",
      });
      console.error("Error sending follow-up:", error);
    },
  });

  const handleFollowUpClick = (question: string) => {
    setSelectedFollowUp(question);
    followUpMutation.mutate(question);
  };

  return (
    <Card className="ai-response card-shadow border-none">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-lavender-deep flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-cream" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <h4 className="font-semibold text-warm">Dr. Mira</h4>
              <span className="text-xs text-warm/60 bg-cream/50 px-2 py-1 rounded-full">
                AI Therapist
              </span>
              <span className="text-xs text-warm/60">
                {new Date(response.createdAt).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="space-y-4">
              <p className="text-warm leading-relaxed whitespace-pre-wrap">
                {response.response}
              </p>
              
              {response.insights && (
                <div className="bg-cream/50 rounded-xl p-4">
                  <h5 className="font-medium text-warm mb-2">Insights</h5>
                  {response.insights.emotions.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-warm/80">Emotions detected: </span>
                      <span className="text-sm text-warm/80">
                        {response.insights.emotions.join(', ')}
                      </span>
                    </div>
                  )}
                  {response.insights.suggestions.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-warm/80">Suggestions: </span>
                      <ul className="text-sm text-warm/80 mt-1">
                        {response.insights.suggestions.map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {response.followUpQuestions && response.followUpQuestions.length > 0 && (
                <div className="bg-cream/50 rounded-xl p-4">
                  <h5 className="font-medium text-warm mb-2 flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Follow-up questions:</span>
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {response.followUpQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleFollowUpClick(question)}
                        disabled={followUpMutation.isPending}
                        className={`bg-cream/70 hover:bg-cream text-warm border-lavender-medium/30 text-xs ${
                          selectedFollowUp === question ? 'bg-lavender-deep text-cream' : ''
                        }`}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

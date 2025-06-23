import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X, Save, Image, Mic, Lock } from "lucide-react";

interface JournalEditorProps {
  onClose: () => void;
}

const moodOptions = [
  { emoji: "😊", label: "Happy", value: "happy", score: 5 },
  { emoji: "😐", label: "Neutral", value: "neutral", score: 3 },
  { emoji: "😢", label: "Sad", value: "sad", score: 2 },
  { emoji: "😰", label: "Anxious", value: "anxious", score: 2 },
  { emoji: "😴", label: "Tired", value: "tired", score: 3 },
  { emoji: "😤", label: "Frustrated", value: "frustrated", score: 2 },
  { emoji: "✨", label: "Excited", value: "excited", score: 5 },
  { emoji: "🤔", label: "Confused", value: "confused", score: 3 },
];

export default function JournalEditor({ onClose }: JournalEditorProps) {
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<typeof moodOptions[0] | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (data: { content: string; mood?: string; moodScore?: number; isPrivate: boolean }) => {
      return await apiRequest("POST", "/api/journal-entries", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving entry:", error);
    },
  });

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate({
      content: content.trim(),
      mood: selectedMood?.value,
      moodScore: selectedMood?.score,
      isPrivate,
    });
  };

  return (
    <Card className="floating-card card-shadow border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-lavender-deep flex items-center space-x-2">
            <span>Today's Reflection</span>
          </h3>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-warm/60">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="journal-editor rounded-2xl p-6 min-h-[300px] focus-within:ring-2 focus-within:ring-lavender-medium transition-all duration-200">
          <div className="mb-4">
            <Label className="block text-sm font-medium text-warm mb-2">
              How are you feeling today?
            </Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood)}
                  className={`w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center text-xl hover:scale-110 ${
                    selectedMood?.value === mood.value
                      ? 'bg-lavender-deep ring-2 ring-lavender-deep'
                      : 'bg-lavender-light hover:bg-lavender-medium'
                  }`}
                  title={mood.label}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px] bg-transparent border-none outline-none resize-none text-warm placeholder-warm/50 leading-relaxed text-base"
            placeholder="What's on your mind today? Share your thoughts, feelings, or any struggles you're experiencing. This is your safe space..."
          />
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center space-x-4">
            <button 
              className="text-lavender-medium hover:text-lavender-deep transition-colors duration-200"
              title="Add image"
            >
              <Image className="w-5 h-5" />
            </button>
            <button 
              className="text-lavender-medium hover:text-lavender-deep transition-colors duration-200"
              title="Voice note"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsPrivate(!isPrivate)}
              className={`transition-colors duration-200 ${
                isPrivate ? 'text-lavender-deep' : 'text-lavender-medium hover:text-lavender-deep'
              }`}
              title="Privacy settings"
            >
              <Lock className="w-5 h-5" />
              {isPrivate && <span className="text-xs ml-1">Private</span>}
            </button>
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-lavender-deep hover:bg-lavender-deep/90 text-cream px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

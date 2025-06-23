import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import JournalEditor from "@/components/journal-editor";
import Timeline from "@/components/timeline";
import MoodTracker from "@/components/mood-tracker";
import InsightsPanel from "@/components/insights-panel";
import MobileNav from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Plus, Lightbulb } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [showJournalEditor, setShowJournalEditor] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="gradient-bg rounded-3xl p-8 md:p-12 card-shadow">
            <div className="max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-lavender-deep mb-4">
                Welcome back, {user?.firstName || 'Friend'} ✨
              </h2>
              <p className="text-lg text-warm/80 mb-8 leading-relaxed">
                Your journey of self-reflection continues. Take a moment to check in with yourself today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setShowJournalEditor(true)}
                  className="bg-lavender-deep hover:bg-lavender-deep/90 text-cream px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Journal Entry
                </Button>
                <Button 
                  variant="secondary"
                  className="bg-lavender-light hover:bg-lavender-medium text-warm px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Get Advice
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {showJournalEditor && (
              <JournalEditor onClose={() => setShowJournalEditor(false)} />
            )}
            <Timeline />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <MoodTracker />
            <InsightsPanel />
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

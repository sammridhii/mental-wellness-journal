import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Shield, Heart, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/90 border-b border-lavender-medium/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-lavender-medium to-lavender-deep flex items-center justify-center">
                <Brain className="w-4 h-4 text-cream" />
              </div>
              <h1 className="text-xl font-semibold text-lavender-deep">MindMirror</h1>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-lavender-deep hover:bg-lavender-deep/90 text-cream"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="gradient-bg rounded-3xl p-12 md:p-16 card-shadow mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-lavender-deep mb-6">
              Your Personal Mental Wellness Journey
            </h2>
            <p className="text-xl text-warm/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              MindMirror is a safe space for self-reflection, powered by AI therapy insights. 
              Journal your thoughts, receive compassionate guidance, and discover patterns in your mental wellness journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-lavender-deep hover:bg-lavender-deep/90 text-cream px-8 py-4 text-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                <Brain className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-lavender-medium text-warm hover:bg-lavender-light/30 px-8 py-4 text-lg font-semibold"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="floating-card card-shadow border-none">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-lavender-deep rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-cream" />
              </div>
              <h3 className="text-xl font-semibold text-warm mb-4">AI Therapist Assistant</h3>
              <p className="text-warm/80 leading-relaxed">
                Receive compassionate, psychology-based responses and insights from Dr. Mira, your AI therapist companion.
              </p>
            </CardContent>
          </Card>

          <Card className="floating-card card-shadow border-none">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-lavender-deep rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-cream" />
              </div>
              <h3 className="text-xl font-semibold text-warm mb-4">Personalized Insights</h3>
              <p className="text-warm/80 leading-relaxed">
                Discover patterns in your emotional journey and receive tailored advice for your unique situation.
              </p>
            </CardContent>
          </Card>

          <Card className="floating-card card-shadow border-none">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-lavender-deep rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-cream" />
              </div>
              <h3 className="text-xl font-semibold text-warm mb-4">Private & Secure</h3>
              <p className="text-warm/80 leading-relaxed">
                Your thoughts are safe with end-to-end encryption and complete privacy controls.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="ai-response rounded-3xl p-12 card-shadow text-center">
          <Sparkles className="w-12 h-12 text-warm mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-warm mb-4">
            Ready to start your mental wellness journey?
          </h3>
          <p className="text-warm/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have found clarity, peace, and personal growth through mindful journaling and AI-powered insights.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-lavender-deep hover:bg-lavender-deep/90 text-cream px-8 py-4 text-lg font-semibold"
          >
            Begin Your Journey Today
          </Button>
        </div>
      </main>
    </div>
  );
}

import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_SECRET || "default_key"
});

export interface TherapistResponse {
  response: string;
  followUpQuestions: string[];
  insights: {
    emotions: string[];
    patterns: string[];
    suggestions: string[];
  };
  empathyScore: number;
}

export interface AdviceResponse {
  advice: string;
  techniques: {
    name: string;
    description: string;
    steps: string[];
    duration: string;
  }[];
  personalizedPlan: string;
}

export interface InsightAnalysis {
  patterns: {
    type: string;
    description: string;
    confidence: number;
  }[];
  growthAreas: string[];
  strengths: string[];
  recommendations: string[];
}

export async function generateTherapistResponse(
  journalContent: string,
  userHistory?: string[]
): Promise<TherapistResponse> {
  try {
    const historyContext = userHistory ? 
      `\n\nUser's recent journal history for context:\n${userHistory.slice(-3).join('\n\n')}` : '';

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Dr. Mira, a compassionate and professional AI therapist. Your role is to:
          1. Provide empathetic, therapeutic responses to journal entries
          2. Ask thoughtful follow-up questions to deepen understanding
          3. Offer psychology-based insights and gentle guidance
          4. Always maintain a warm, non-judgmental tone
          5. Focus on self-awareness, coping strategies, and emotional growth
          
          Respond with JSON in this exact format:
          {
            "response": "Your therapeutic response (2-3 paragraphs)",
            "followUpQuestions": ["3-4 specific follow-up questions"],
            "insights": {
              "emotions": ["detected emotions"],
              "patterns": ["behavioral or emotional patterns"],
              "suggestions": ["gentle therapeutic suggestions"]
            },
            "empathyScore": number (1-10 based on emotional intensity of entry)
          }`
        },
        {
          role: "user",
          content: `Journal Entry: "${journalContent}"${historyContext}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      response: result.response || "I appreciate you sharing your thoughts with me.",
      followUpQuestions: result.followUpQuestions || [],
      insights: result.insights || { emotions: [], patterns: [], suggestions: [] },
      empathyScore: Math.max(1, Math.min(10, result.empathyScore || 5))
    };
  } catch (error) {
    console.error("Error generating therapist response:", error);
    throw new Error("Failed to generate therapeutic response");
  }
}

export async function generateAdvice(
  topic: string,
  userRequest: string,
  userHistory?: string[]
): Promise<AdviceResponse> {
  try {
    const historyContext = userHistory ? 
      `\n\nUser's recent journal context:\n${userHistory.slice(-5).join('\n\n')}` : '';

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert mental health advisor providing personalized advice and coping strategies. Create practical, evidence-based recommendations.
          
          Respond with JSON in this exact format:
          {
            "advice": "Detailed, personalized advice (3-4 paragraphs)",
            "techniques": [
              {
                "name": "Technique name",
                "description": "Brief description",
                "steps": ["step 1", "step 2", "step 3"],
                "duration": "time estimate"
              }
            ],
            "personalizedPlan": "Specific action plan based on user's situation"
          }`
        },
        {
          role: "user",
          content: `Topic: ${topic}\nRequest: ${userRequest}${historyContext}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      advice: result.advice || "I understand you're seeking guidance on this matter.",
      techniques: result.techniques || [],
      personalizedPlan: result.personalizedPlan || "Consider taking small, manageable steps toward your goal."
    };
  } catch (error) {
    console.error("Error generating advice:", error);
    throw new Error("Failed to generate advice");
  }
}

export async function analyzeUserInsights(
  journalEntries: string[],
  timeframe: string = "recent"
): Promise<InsightAnalysis> {
  try {
    const entriesText = journalEntries.slice(0, 10).join('\n\n---\n\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a psychological analyst specializing in identifying patterns, growth areas, and strengths from journal entries. Provide deep, actionable insights.
          
          Respond with JSON in this exact format:
          {
            "patterns": [
              {
                "type": "emotional/behavioral/cognitive pattern type",
                "description": "detailed description",
                "confidence": number (1-100)
              }
            ],
            "growthAreas": ["specific areas for development"],
            "strengths": ["identified personal strengths"],
            "recommendations": ["specific therapeutic recommendations"]
          }`
        },
        {
          role: "user",
          content: `Analyze these ${timeframe} journal entries for patterns, growth areas, and strengths:\n\n${entriesText}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      patterns: result.patterns || [],
      growthAreas: result.growthAreas || [],
      strengths: result.strengths || [],
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error("Error analyzing user insights:", error);
    throw new Error("Failed to analyze user insights");
  }
}

export async function generateMoodInsights(
  moodData: { mood: string; date: string; content?: string }[]
): Promise<{
  trend: "improving" | "declining" | "stable";
  predominantMood: string;
  insights: string[];
  recommendations: string[];
}> {
  try {
    const moodSummary = moodData.map(d => `${d.date}: ${d.mood} ${d.content ? `- ${d.content.substring(0, 100)}...` : ''}`).join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze mood patterns and provide insights. Respond with JSON in this format:
          {
            "trend": "improving/declining/stable",
            "predominantMood": "most common mood",
            "insights": ["specific insights about mood patterns"],
            "recommendations": ["actionable recommendations"]
          }`
        },
        {
          role: "user",
          content: `Analyze these mood entries:\n${moodSummary}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      trend: result.trend || "stable",
      predominantMood: result.predominantMood || "neutral",
      insights: result.insights || [],
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error("Error generating mood insights:", error);
    throw new Error("Failed to generate mood insights");
  }
}

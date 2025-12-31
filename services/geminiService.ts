
import { GoogleGenAI } from "@google/genai";
import { Task } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  getSmartSummary: async (tasks: Task[]): Promise<string> => {
    if (!process.env.API_KEY) return "Login to enable AI productivity summaries.";
    
    const taskList = tasks.map(t => `- ${t.title} (${t.priority}, ${t.isCompleted ? 'Done' : 'Pending'})`).join('\n');
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these tasks and provide a 2-sentence productivity tip and motivation:\n${taskList}`,
        config: {
          systemInstruction: "You are a world-class productivity coach. Be concise and encouraging."
        }
      });
      return response.text || "Keep pushing forward!";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Focus on your high priority tasks today!";
    }
  }
};

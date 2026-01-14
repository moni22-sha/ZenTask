import { GoogleGenAI } from "@google/genai";
import { Task, Priority } from "../types";

/* -------------------------------
   Priority suggestion (local)
-------------------------------- */
export async function getAIPrioritySuggestion(
  title: string,
  description?: string
): Promise<Priority> {
  const text = `${title} ${description ?? ""}`.toLowerCase();

  if (text.includes("urgent") || text.includes("asap")) {
    return Priority.HIGH;
  }

  if (text.includes("today") || text.includes("soon")) {
    return Priority.MEDIUM;
  }

  return Priority.LOW;
}

/* -------------------------------
   Gemini setup (Vite-safe)
-------------------------------- */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

/* -------------------------------
   Gemini service
-------------------------------- */
export const geminiService = {
  getSmartSummary: async (tasks: Task[]): Promise<string> => {
    if (!ai) {
      return "Login to enable AI productivity summaries.";
    }

    const taskList = tasks
      .map(
        (t) =>
          `- ${t.title} (${t.priority}, ${
            t.isCompleted ? "Done" : "Pending"
          })`
      )
      .join("\n");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Analyze these tasks and provide a 2-sentence productivity tip and motivation:\n${taskList}`,
        config: {
          systemInstruction:
            "You are a world-class productivity coach. Be concise and encouraging.",
        },
      });

      return response.text || "Keep pushing forward!";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Focus on your high priority tasks today!";
    }
  },
};

/* -------------------------------
   Email helper
-------------------------------- */
export const generateReminderEmail = (
  taskTitle: string,
  dueDate: string,
  tone?: string
) => {
  return `
⏰ Reminder!
Your task "${taskTitle}" is due on ${dueDate}.
`;
};

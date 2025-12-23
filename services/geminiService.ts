
import { GoogleGenAI, Type } from "@google/genai";
import { SuggestedTask } from '../types';

export const generateStudyPlan = async (goal: string, apiKey: string): Promise<SuggestedTask[] | null> => {
  if (!apiKey) {
    console.error("API key is missing.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  try {
    const prompt = `あなたは優秀な学習プランナーです。生徒の目標「${goal}」を達成するための、構造化された学習タスクのJSON配列を作成してください。各タスクには、タイトル(title)、内容(description)、推定学習時間(estimatedHours)（時間単位の数値）を含めてください。現実的で実行可能な計画を提案してください。`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'タスクのタイトル',
              },
              description: {
                type: Type.STRING,
                description: 'タスクの具体的な内容',
              },
              estimatedHours: {
                type: Type.NUMBER,
                description: '推定学習時間（時間単位）',
              },
            },
            required: ["title", "description", "estimatedHours"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
        console.error("Gemini response is empty");
        return null;
    }

    const jsonString = text.trim();
    const tasks = JSON.parse(jsonString) as SuggestedTask[];
    return tasks;

  } catch (error) {
    console.error("Error generating study plan with Gemini:", error);
    return null;
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { SuggestedTask, QuizQuestion } from '../types';

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

export const generateReviewQuestions = async (subjectName: string, apiKey: string): Promise<QuizQuestion[] | null> => {
  if (!apiKey) {
    console.error("API key is missing.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  try {
    const prompt = `あなたは優秀な教師です。「${subjectName}」に関する、中学校の学習カリキュラムに沿った4択のクイズを5問作成してください。学年別の難易度に合致させて、適切かつ質の高い問題を生成してください。
    各問題には、問題文(question)、4つの選択肢(options)、正解のインデックス(correctAnswerIndex, 0-3)、および解説(explanation)を含めてください。
    JSON形式の配列で出力してください。`;
    
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
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text.trim()) as QuizQuestion[];

  } catch (error) {
    console.error("Error generating review questions with Gemini:", error);
    return null;
  }
};

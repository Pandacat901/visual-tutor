import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";
import { z } from "zod";
import { toLesson, visualLessonSchema } from "@/lib/lesson-schema";

const requestSchema = z.object({
  inquiry: z.string().trim().min(1).max(6000),
  context: z.string().trim().min(1).max(4000).nullable(),
});

const instructions = `You are Visually, a student-facing tutor who teaches on a whiteboard. Return only a structured visual lesson. Never write a conventional chat response.

The whiteboard canvas is 1200 by 780. Make a first teaching phase of 4–12 elements and a continuation phase revealed after a comprehension check. Use short handwritten-style labels, not paragraphs. Put elements in the visible canvas with generous spacing and no overlapping text. Use boxes for ideas, arrows for relationships, equations for math, sketches only as simple SVG paths, and dividers to group stages. Choose the representation that teaches the inquiry: worked steps for problems; diagrams, timelines, concept maps, or comparisons for other topics.

Teach from the student's likely sticking point. Do not invent evidence, sources, or citations. For uncertain, contested, or research-level claims, label uncertainty and distinguish interpretation from established result. Include exactly three plausible checkpoint options and one best answer. The continuation should make the next reasoning move visible. Keep every text field concise.`;

export async function GET() {
  return NextResponse.json({ configured: Boolean(process.env.OPENAI_API_KEY) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide an inquiry to put on the board." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ code: "AI_NOT_CONFIGURED", error: "The AI planner has not been configured yet." }, { status: 503 });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.parse({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      instructions,
      input: `Student inquiry:\n${parsed.data.inquiry}${parsed.data.context ? `\n\nRelevant context:\n${parsed.data.context}` : ""}`,
      text: { format: zodTextFormat(visualLessonSchema, "visual_lesson") },
    });

    if (!response.output_parsed) throw new Error("The planner returned no lesson.");
    return NextResponse.json({ lesson: toLesson(response.output_parsed) });
  } catch (error) {
    console.error("Tutor planner failed", error);
    return NextResponse.json({ error: "The tutor could not create a board right now. Please try again." }, { status: 502 });
  }
}

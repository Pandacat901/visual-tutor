import { z } from "zod";
import type { BoardElement, Lesson } from "@/types/board";

const color = z.enum(["navy", "blue", "teal", "coral", "gold", "muted"]);
const size = z.enum(["sm", "md", "lg", "xl"]);

export const visualLessonSchema = z.object({
  subject: z.string().min(1).max(60),
  title: z.string().min(1).max(90),
  subtitle: z.string().min(1).max(150),
  elements: z.array(z.object({
    id: z.string().min(1).max(60),
    type: z.enum(["text", "equation", "box", "arrow", "divider", "prompt", "sketch"]),
    x: z.number().min(0).max(1200),
    y: z.number().min(0).max(780),
    width: z.number().min(1).max(1200).nullable(),
    height: z.number().min(1).max(780).nullable(),
    text: z.string().max(260).nullable(),
    color: color,
    size: size,
    path: z.string().max(500).nullable(),
    label: z.string().max(100).nullable(),
    delay: z.number().min(0).max(4000).nullable(),
  })).min(4).max(18),
  checkpoint: z.object({
    question: z.string().min(1).max(180),
    options: z.array(z.string().min(1).max(100)).length(3),
    answer: z.number().int().min(0).max(2),
    explanation: z.string().min(1).max(220),
  }),
  continuation: z.array(z.object({
    id: z.string().min(1).max(60),
    type: z.enum(["text", "equation", "box", "arrow", "divider", "prompt", "sketch"]),
    x: z.number().min(0).max(1200),
    y: z.number().min(0).max(780),
    width: z.number().min(1).max(1200).nullable(),
    height: z.number().min(1).max(780).nullable(),
    text: z.string().max(260).nullable(),
    color: color,
    size: size,
    path: z.string().max(500).nullable(),
    label: z.string().max(100).nullable(),
    delay: z.number().min(0).max(4000).nullable(),
  })).min(1).max(10),
});

export type VisualLesson = z.infer<typeof visualLessonSchema>;

function boardElement(element: VisualLesson["elements"][number]): BoardElement {
  return Object.fromEntries(
    Object.entries(element).filter(([, value]) => value !== null),
  ) as BoardElement;
}

export function toLesson(lesson: VisualLesson): Lesson {
  return {
    id: crypto.randomUUID(),
    subject: lesson.subject,
    title: lesson.title,
    subtitle: lesson.subtitle,
    elements: lesson.elements.map(boardElement),
    checkpointIndex: lesson.elements.length - 1,
    checkpoint: lesson.checkpoint,
    continuation: lesson.continuation.map(boardElement),
  };
}

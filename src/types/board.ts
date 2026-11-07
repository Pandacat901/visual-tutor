export type InkColor = "navy" | "blue" | "teal" | "coral" | "gold" | "muted";

export type BoardElement = {
  id: string;
  type: "text" | "equation" | "box" | "arrow" | "divider" | "prompt" | "sketch";
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color?: InkColor;
  size?: "sm" | "md" | "lg" | "xl";
  path?: string;
  label?: string;
  delay?: number;
};

export type Lesson = {
  id: string;
  subject: string;
  title: string;
  subtitle: string;
  elements: BoardElement[];
  checkpointIndex: number;
  checkpoint: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  continuation: BoardElement[];
};

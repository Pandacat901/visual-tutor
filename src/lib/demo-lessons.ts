import type { BoardElement, Lesson } from "@/types/board";

const mathLesson: Lesson = {
  id: "quadratic",
  subject: "Algebra · Guided problem",
  title: "Solve 2x² − 7x + 3 = 0",
  subtitle: "Let’s look for structure before reaching for a formula.",
  checkpointIndex: 8,
  elements: [
    { id: "m1", type: "text", x: 70, y: 54, text: "Solve:  2x² − 7x + 3 = 0", size: "xl", color: "navy" },
    { id: "m2", type: "divider", x: 68, y: 112, width: 520, color: "blue" },
    { id: "m3", type: "text", x: 72, y: 155, text: "First: can it factor?", size: "lg", color: "teal" },
    { id: "m4", type: "text", x: 76, y: 208, text: "We need two numbers that…", size: "md", color: "navy" },
    { id: "m5", type: "box", x: 74, y: 250, width: 270, height: 90, color: "gold", label: "multiply to  2 × 3 = 6" },
    { id: "m6", type: "box", x: 382, y: 250, width: 270, height: 90, color: "coral", label: "add to  −7" },
    { id: "m7", type: "arrow", x: 346, y: 295, width: 36, color: "muted" },
    { id: "m8", type: "text", x: 692, y: 278, text: "−6 and −1", size: "lg", color: "coral" },
    { id: "m9", type: "prompt", x: 72, y: 390, width: 790, height: 118, text: "Your turn — how would you split the middle term, −7x?", color: "blue" },
  ],
  checkpoint: {
    question: "Choose the split that preserves −7x",
    options: ["−6x − x", "−3x − 4x", "+6x − x"],
    answer: 0,
    explanation: "Exactly: −6x − x = −7x, and the coefficients −6 and −1 multiply to +6.",
  },
  continuation: [
    { id: "mc1", type: "equation", x: 72, y: 545, text: "2x² − 6x − x + 3 = 0", size: "lg", color: "navy" },
    { id: "mc2", type: "equation", x: 72, y: 598, text: "2x(x − 3) − 1(x − 3) = 0", size: "lg", color: "blue" },
    { id: "mc3", type: "equation", x: 72, y: 651, text: "(2x − 1)(x − 3) = 0", size: "lg", color: "teal" },
    { id: "mc4", type: "arrow", x: 540, y: 665, width: 80, color: "muted" },
    { id: "mc5", type: "text", x: 650, y: 641, text: "x = ½  or  x = 3", size: "xl", color: "coral" },
  ],
};

const scienceLesson: Lesson = {
  id: "photosynthesis",
  subject: "Biology · Mechanism",
  title: "Where does a plant’s mass come from?",
  subtitle: "We’ll trace matter and energy separately.",
  checkpointIndex: 9,
  elements: [
    { id: "s1", type: "text", x: 60, y: 48, text: "Photosynthesis ≠ “plants eat sunlight”", size: "xl", color: "navy" },
    { id: "s2", type: "divider", x: 60, y: 108, width: 610, color: "teal" },
    { id: "s3", type: "sketch", x: 500, y: 145, width: 250, height: 255, label: "plant", color: "teal" },
    { id: "s4", type: "text", x: 75, y: 180, text: "CO₂ from air", size: "lg", color: "blue" },
    { id: "s5", type: "arrow", x: 245, y: 200, width: 245, color: "blue" },
    { id: "s6", type: "text", x: 75, y: 290, text: "H₂O from soil", size: "lg", color: "teal" },
    { id: "s7", type: "arrow", x: 250, y: 310, width: 240, color: "teal" },
    { id: "s8", type: "text", x: 822, y: 180, text: "O₂ released", size: "lg", color: "coral" },
    { id: "s9", type: "arrow", x: 755, y: 205, width: 62, color: "coral" },
    { id: "s10", type: "prompt", x: 70, y: 450, width: 780, height: 120, text: "Which input supplies most of the carbon that becomes wood?", color: "gold" },
  ],
  checkpoint: {
    question: "Trace the carbon atoms",
    options: ["Soil minerals", "Carbon dioxide", "Sunlight"],
    answer: 1,
    explanation: "Right. Sunlight supplies energy, but the carbon atoms in sugars—and later wood—come from atmospheric CO₂.",
  },
  continuation: [
    { id: "sc1", type: "equation", x: 72, y: 615, text: "6CO₂ + 6H₂O  →  C₆H₁₂O₆ + 6O₂", size: "lg", color: "navy" },
    { id: "sc2", type: "text", x: 735, y: 620, text: "light energy", size: "md", color: "gold" },
    { id: "sc3", type: "text", x: 72, y: 680, text: "Matter is rearranged; energy drives the rearrangement.", size: "lg", color: "teal" },
  ],
};

const theoryLesson: Lesson = {
  id: "theory",
  subject: "Theory · Concept map",
  title: "How does a theory reshape a research question?",
  subtitle: "A theory is a lens: it changes what becomes visible and measurable.",
  checkpointIndex: 10,
  elements: [
    { id: "t1", type: "text", x: 60, y: 45, text: "Theory → a way of seeing", size: "xl", color: "navy" },
    { id: "t2", type: "divider", x: 60, y: 104, width: 460, color: "coral" },
    { id: "t3", type: "box", x: 65, y: 165, width: 230, height: 105, label: "Assumptions\nwhat is taken as given?", color: "blue" },
    { id: "t4", type: "box", x: 400, y: 165, width: 230, height: 105, label: "Mechanism\nwhat produces change?", color: "teal" },
    { id: "t5", type: "box", x: 735, y: 165, width: 230, height: 105, label: "Boundary\nwhere should it apply?", color: "coral" },
    { id: "t6", type: "arrow", x: 295, y: 217, width: 100, color: "muted" },
    { id: "t7", type: "arrow", x: 630, y: 217, width: 100, color: "muted" },
    { id: "t8", type: "text", x: 64, y: 330, text: "Then map the lens onto your inquiry:", size: "lg", color: "navy" },
    { id: "t9", type: "box", x: 64, y: 382, width: 285, height: 95, label: "Your phenomenon", color: "gold" },
    { id: "t10", type: "arrow", x: 355, y: 430, width: 95, color: "muted" },
    { id: "t11", type: "box", x: 460, y: 382, width: 430, height: 95, label: "What does this theory make you notice?", color: "blue" },
    { id: "t12", type: "prompt", x: 64, y: 535, width: 820, height: 112, text: "Comprehension check: is the theory explaining a mechanism, organizing concepts, or making a normative claim?", color: "teal" },
  ],
  checkpoint: {
    question: "A useful first diagnostic",
    options: ["What does it claim to explain?", "How famous is its author?", "How long is the paper?"],
    answer: 0,
    explanation: "Yes. Identifying the explanatory target prevents us from applying a theory merely because its vocabulary sounds relevant.",
  },
  continuation: [
    { id: "tc1", type: "text", x: 64, y: 692, text: "Next: test fit → assumptions • evidence • boundaries • alternatives", size: "lg", color: "coral" },
  ],
};

export const examples = [
  { label: "Factor a quadratic", prompt: "Help me solve 2x² - 7x + 3 = 0 without spoiling it." },
  { label: "Explain photosynthesis", prompt: "Where does the mass of a growing tree actually come from?" },
  { label: "Map a difficult theory", prompt: "Help me understand whether a difficult theory fits my research question." },
];

export function createLesson(prompt: string): Lesson {
  const normalized = prompt.toLowerCase();
  if (/photo|plant|tree|carbon|biology|cell/.test(normalized)) return scienceLesson;
  if (/x²|x\^2|quadratic|factor|equation|solve|math|algebra/.test(normalized)) return mathLesson;
  return {
    ...theoryLesson,
    title: prompt.length > 62 ? `${prompt.slice(0, 59)}…` : prompt || theoryLesson.title,
  };
}

export function followUpElement(text: string, index: number): BoardElement {
  return {
    id: `follow-up-${Date.now()}`,
    type: "prompt",
    x: 905,
    y: 330 + (index % 2) * 150,
    width: 250,
    height: 120,
    text: `↳ ${text}\n\nLet’s zoom in here.`,
    color: index % 2 ? "coral" : "blue",
  };
}

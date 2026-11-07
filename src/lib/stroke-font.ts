import encodedFont from "hershey/lib/rowmans.js";
import characterNumbers from "hershey/lib/characterNumbers.js";

type Point = [number, number];

type CharacterDescriptor = {
  left: number;
  right: number;
  strokes: Point[][];
};

export type StrokePath = {
  d: string;
  length: number;
  offset: number;
  points: Point[];
};

export type StrokeLayout = {
  height: number;
  paths: StrokePath[];
  totalLength: number;
  width: number;
};

const replacements: Record<string, string> = {
  "−": "-",
  "–": "-",
  "—": "-",
  "×": "x",
  "→": "->",
  "↳": "->",
  "≠": "!=",
  "½": "1/2",
  "²": "^2",
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  "…": "...",
  "“": '"',
  "”": '"',
  "’": "'",
};

function parseDescriptor(line: string): [number, CharacterDescriptor] {
  const origin = "R".charCodeAt(0);
  const number = Number.parseInt(line.slice(0, 5), 10);
  const left = line[8].charCodeAt(0) - origin;
  const right = line[9].charCodeAt(0) - origin;
  const vertexCount = Number.parseInt(line.slice(5, 8), 10) - 1;
  const strokes: Point[][] = [[]];

  for (let index = 0; index < vertexCount; index += 1) {
    const x = line[10 + index * 2].charCodeAt(0) - origin;
    const y = line[11 + index * 2].charCodeAt(0) - origin;
    if (x === -50 && y === 0) strokes.push([]);
    else strokes.at(-1)?.push([x, -y]);
  }

  return [number, { left, right, strokes: strokes.filter((stroke) => stroke.length > 1) }];
}

const descriptors = new Map<number, CharacterDescriptor>(
  atob(encodedFont)
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map(parseDescriptor),
);

function normalizeText(text: string) {
  return Array.from(text).map((character) => replacements[character] ?? character).join("");
}

function descriptorFor(character: string) {
  const number = characterNumbers[character] ?? characterNumbers["?"];
  return descriptors.get(number) ?? descriptors.get(characterNumbers[" "])!;
}

function nativeWidth(text: string) {
  return Array.from(text).reduce((width, character) => {
    const descriptor = descriptorFor(character);
    return width + descriptor.right - descriptor.left;
  }, 0);
}

function wrapLines(text: string, maxNativeWidth?: number) {
  const paragraphs = normalizeText(text).split("\n");
  if (!maxNativeWidth) return paragraphs;
  const lines: string[] = [];

  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      return;
    }
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (line && nativeWidth(candidate) > maxNativeWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    lines.push(line);
  });

  return lines;
}

function pathLength(points: Point[]) {
  let length = 0;
  for (let index = 1; index < points.length; index += 1) {
    length += Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]);
  }
  return length;
}

const layoutCache = new Map<string, StrokeLayout>();

export function createStrokeLayout(text: string, fontSize: number, maxWidth?: number): StrokeLayout {
  const cacheKey = `${fontSize}|${maxWidth ?? 0}|${text}`;
  const cached = layoutCache.get(cacheKey);
  if (cached) return cached;

  const nativeHeight = 24;
  const scale = fontSize / nativeHeight;
  const lineHeight = fontSize * 1.34;
  const lines = wrapLines(text, maxWidth ? maxWidth / scale : undefined);
  const paths: StrokePath[] = [];
  let totalLength = 0;
  let widestLine = 0;

  lines.forEach((line, lineIndex) => {
    const lineWidth = nativeWidth(line) * scale;
    widestLine = Math.max(widestLine, lineWidth);
    let cursorX = 0;

    Array.from(line).forEach((character) => {
      const descriptor = descriptorFor(character);
      descriptor.strokes.forEach((stroke) => {
        const points = stroke.map<Point>(([x, y]) => [
          cursorX + (x - descriptor.left) * scale,
          lineIndex * lineHeight + (12 - y) * scale,
        ]);
        const length = pathLength(points);
        if (length <= 0) return;
        const d = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
        paths.push({ d, length, offset: totalLength, points });
        totalLength += length;
      });
      cursorX += (descriptor.right - descriptor.left) * scale;
    });
  });

  const layout = {
    height: Math.max(fontSize, lines.length * lineHeight),
    paths,
    totalLength,
    width: Math.max(1, widestLine),
  };
  layoutCache.set(cacheKey, layout);
  return layout;
}

export function pointOnStrokeLayout(layout: StrokeLayout, progress: number): Point {
  if (!layout.paths.length) return [0, layout.height / 2];
  const target = Math.max(0, Math.min(layout.totalLength, layout.totalLength * progress));
  const path = layout.paths.find((item) => target <= item.offset + item.length) ?? layout.paths.at(-1)!;
  let remaining = Math.max(0, target - path.offset);

  for (let index = 1; index < path.points.length; index += 1) {
    const start = path.points[index - 1];
    const end = path.points[index];
    const segmentLength = Math.hypot(end[0] - start[0], end[1] - start[1]);
    if (remaining <= segmentLength) {
      const ratio = segmentLength ? remaining / segmentLength : 0;
      return [start[0] + (end[0] - start[0]) * ratio, start[1] + (end[1] - start[1]) * ratio];
    }
    remaining -= segmentLength;
  }

  return path.points.at(-1)!;
}

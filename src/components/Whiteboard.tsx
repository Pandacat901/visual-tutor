"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { createStrokeLayout, pointOnStrokeLayout } from "@/lib/stroke-font";
import type { StrokeLayout } from "@/lib/stroke-font";
import type { BoardElement, Lesson } from "@/types/board";

type WhiteboardProps = {
  lesson: Lesson;
  revealAll: boolean;
  checkpointComplete: boolean;
  followUps: BoardElement[];
  onDrawingChange?: (drawing: boolean) => void;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const fontSizes = { sm: 14, md: 19, lg: 25, xl: 33 } as const;

function textGeometry(element: BoardElement) {
  const fontSize = fontSizes[element.size ?? "md"];
  const isFramed = element.type === "box" || element.type === "prompt";
  const frameWidth = element.width;
  const layout = createStrokeLayout(
    element.text ?? element.label ?? "",
    isFramed ? Math.min(fontSize, 18) : fontSize,
    frameWidth ? frameWidth - 34 : undefined,
  );
  const resolvedHeight = element.height ?? (element.type === "divider" ? 8 : element.type === "arrow" ? 30 : layout.height);
  const resolvedWidth = element.width ?? layout.width;
  return {
    frameHeight: resolvedHeight,
    frameWidth: resolvedWidth,
    layout,
    offsetX: isFramed ? Math.max(0, (resolvedWidth - layout.width) / 2) : 0,
    offsetY: isFramed ? Math.max(0, (resolvedHeight - layout.height) / 2) : 0,
  };
}

function drawingDuration(element: BoardElement) {
  const text = element.text ?? element.label ?? "";
  if (element.type === "sketch") return 2_100;
  if (element.type === "box") return 1_250;
  if (element.type === "prompt") return Math.max(1_400, Math.min(2_200, text.length * 24));
  if (element.type === "arrow" || element.type === "divider") return 720;
  return Math.max(850, Math.min(2_000, text.length * 38));
}

function PlantSketch({ progress }: { progress: number }) {
  const paths = [
    "M120 205 C115 155 125 105 118 54",
    "M119 114 C83 115 64 96 55 71 C86 68 112 81 119 114Z",
    "M120 142 C153 138 176 116 183 90 C151 91 129 109 120 142Z",
    "M118 70 C97 57 94 34 103 18 C126 27 134 49 118 70Z",
    "M55 207 Q120 175 190 207",
    "M92 207 L78 228 M120 202 L120 231 M148 203 L165 227",
    "M195 1 V12 M195 64 V77 M158 38 H171 M220 38 H233 M169 12 L178 21 M213 55 L222 64",
  ];
  const total = paths.length + 1;

  return (
    <svg viewBox="0 0 240 240" className="plant-sketch" aria-label="Hand drawn plant">
      {paths.slice(0, 6).map((path, index) => {
        const localProgress = clamp(progress * total - index);
        return <path key={path} d={path} pathLength="1" style={{ strokeDasharray: "1 1", strokeDashoffset: 1 - localProgress }} />;
      })}
      <circle cx="195" cy="38" r="25" pathLength="1" style={{ strokeDasharray: "1 1", strokeDashoffset: 1 - clamp(progress * total - 6) }} />
      <path d={paths[6]} pathLength="1" style={{ strokeDasharray: "1 1", strokeDashoffset: 1 - clamp(progress * total - 7) }} />
    </svg>
  );
}

function HandDrawnFrame({ progress, dashed = false }: { progress: number; dashed?: boolean }) {
  return (
    <svg className="drawn-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <rect
        x="3"
        y="4"
        width="94"
        height="92"
        rx="3"
        pathLength="1"
        className={dashed ? "dashed" : undefined}
        style={{ strokeDasharray: dashed ? "0.04 0.025" : "1 1", strokeDashoffset: 1 - progress }}
      />
    </svg>
  );
}

function StrokeText({
  layout,
  progress,
  width,
  height,
  offsetX = 0,
  offsetY = 0,
}: {
  layout: StrokeLayout;
  progress: number;
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
}) {
  const targetLength = layout.totalLength * progress;
  return (
    <svg className="stroke-text" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet" aria-hidden="true">
      <g transform={`translate(${offsetX} ${offsetY})`}>
        {layout.paths.map((path, index) => {
          const localProgress = clamp((targetLength - path.offset) / path.length);
          return (
            <path
              key={`${index}-${path.d}`}
              d={path.d}
              pathLength="1"
              style={{ strokeDasharray: "1 1", strokeDashoffset: 1 - localProgress }}
            />
          );
        })}
      </g>
    </svg>
  );
}

function BoardItem({ element, progress }: { element: BoardElement; progress: number }) {
  const geometry = textGeometry(element);
  const style: CSSProperties = {
    left: `${(element.x / 1200) * 100}%`,
    top: `${(element.y / 780) * 100}%`,
    width: `${(geometry.frameWidth / 1200) * 100}%`,
    height: `${(geometry.frameHeight / 780) * 100}%`,
  };

  if (element.type === "divider") {
    return (
      <svg className={`board-divider ink-${element.color}`} style={style} viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
        <path d="M1 5 C28 2 73 7 99 3" pathLength="1" style={{ strokeDasharray: "1 1", strokeDashoffset: 1 - progress }} />
      </svg>
    );
  }

  if (element.type === "arrow") {
    const headProgress = clamp((progress - 0.72) / 0.28);
    return (
      <svg className={`board-arrow ink-${element.color}`} style={style} viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 16 C28 13 70 17 91 14" pathLength="1" style={{ strokeDasharray: "1 1", strokeDashoffset: 1 - clamp(progress / 0.82) }} />
        <path d="M82 5 L94 14 L83 25" pathLength="1" style={{ strokeDasharray: "1 1", strokeDashoffset: 1 - headProgress }} />
      </svg>
    );
  }

  if (element.type === "sketch") {
    return <div className={`board-item board-sketch ink-${element.color}`} style={style}><PlantSketch progress={progress} /></div>;
  }

  if (element.type === "box") {
    const textProgress = clamp((progress - 0.4) / 0.6);
    return (
      <div className={`board-item board-box ink-${element.color}`} style={style}>
        <HandDrawnFrame progress={clamp(progress / 0.42)} />
        <StrokeText layout={geometry.layout} progress={textProgress} width={geometry.frameWidth} height={geometry.frameHeight} offsetX={geometry.offsetX} offsetY={geometry.offsetY} />
      </div>
    );
  }

  if (element.type === "prompt") {
    const textProgress = clamp((progress - 0.4) / 0.6);
    return (
      <div className={`board-item board-prompt ink-${element.color}`} style={style}>
        <HandDrawnFrame progress={clamp(progress / 0.42)} dashed />
        <StrokeText layout={geometry.layout} progress={textProgress} width={geometry.frameWidth} height={geometry.frameHeight} offsetX={geometry.offsetX} offsetY={geometry.offsetY} />
      </div>
    );
  }

  return (
    <div className={`board-item board-${element.type} ink-${element.color ?? "navy"}`} style={style}>
      <StrokeText layout={geometry.layout} progress={progress} width={geometry.frameWidth} height={geometry.frameHeight} />
    </div>
  );
}

function cursorPosition(element: BoardElement, progress: number) {
  const geometry = textGeometry(element);
  const width = geometry.frameWidth;
  const height = geometry.frameHeight;
  let x = element.x;
  let y = element.y + height * 0.55;

  if (element.type === "box" || element.type === "prompt") {
    const outlineProgress = clamp(progress / 0.42);
    if (progress > 0.42) {
      const [textX, textY] = pointOnStrokeLayout(geometry.layout, clamp((progress - 0.4) / 0.6));
      x = element.x + geometry.offsetX + textX;
      y = element.y + geometry.offsetY + textY;
    } else if (outlineProgress < 0.28) {
      x = element.x + width * (outlineProgress / 0.28);
      y = element.y + 5;
    } else if (outlineProgress < 0.48) {
      x = element.x + width - 3;
      y = element.y + height * ((outlineProgress - 0.28) / 0.2);
    } else if (outlineProgress < 0.78) {
      x = element.x + width * (1 - (outlineProgress - 0.48) / 0.3);
      y = element.y + height - 4;
    } else {
      x = element.x + 4;
      y = element.y + height * (1 - (outlineProgress - 0.78) / 0.22);
    }
  } else if (element.type === "sketch") {
    x = element.x + width * (0.5 + Math.sin(progress * Math.PI * 5) * 0.25);
    y = element.y + height * (0.86 - progress * 0.7);
  } else if (element.type === "arrow" || element.type === "divider") {
    x = element.x + width * progress;
  } else {
    const [textX, textY] = pointOnStrokeLayout(geometry.layout, progress);
    x = element.x + textX;
    y = element.y + textY;
  }

  return { left: `${(x / 1200) * 100}%`, top: `${(y / 780) * 100}%` };
}

export function Whiteboard({ lesson, revealAll, checkpointComplete, followUps, onDrawingChange }: WhiteboardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const baseLimit = revealAll ? lesson.elements.length : Math.min(lesson.elements.length, lesson.checkpointIndex + 1);
  const shownContinuation = checkpointComplete || revealAll;
  const allElements = useMemo(
    () => [...lesson.elements.slice(0, baseLimit), ...(shownContinuation ? lesson.continuation : []), ...followUps],
    [baseLimit, followUps, lesson, shownContinuation],
  );

  useEffect(() => {
    setActiveIndex(0);
    setProgress(0);
  }, [lesson.id]);

  useEffect(() => {
    if (activeIndex >= allElements.length) {
      onDrawingChange?.(false);
      return;
    }

    onDrawingChange?.(true);
    const duration = drawingDuration(allElements[activeIndex]);
    let frame = 0;
    let startTime = 0;
    let advanceTimer = 0;

    const tick = (time: number) => {
      if (!startTime) startTime = time;
      const nextProgress = clamp((time - startTime) / duration);
      setProgress(nextProgress);
      if (nextProgress < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        advanceTimer = window.setTimeout(() => {
          setActiveIndex((index) => index + 1);
          setProgress(0);
        }, 90);
      }
    };

    const delay = window.setTimeout(() => { frame = window.requestAnimationFrame(tick); }, activeIndex === 0 ? 280 : 70);
    return () => {
      window.clearTimeout(delay);
      window.clearTimeout(advanceTimer);
      window.cancelAnimationFrame(frame);
    };
  }, [activeIndex, allElements, onDrawingChange]);

  const activeElement = activeIndex < allElements.length ? allElements[activeIndex] : null;
  const renderedElements = allElements.slice(0, Math.min(activeIndex + 1, allElements.length));

  return (
    <div className="whiteboard-shell">
      <div className="whiteboard" role="img" aria-label={`Visual lesson: ${lesson.title}`}>
        <div className="board-grid" />
        {renderedElements.map((element, index) => (
          <BoardItem key={element.id} element={element} progress={index === activeIndex ? progress : 1} />
        ))}
        {activeElement && <div className="drawing-cursor is-drawing" style={cursorPosition(activeElement, progress)} aria-hidden="true"><span /></div>}
        <div className="board-signature">visually</div>
      </div>
    </div>
  );
}

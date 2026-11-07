"use client";

import { useEffect, useMemo, useState } from "react";
import type { BoardElement, Lesson } from "@/types/board";

type WhiteboardProps = {
  lesson: Lesson;
  revealAll: boolean;
  checkpointComplete: boolean;
  followUps: BoardElement[];
  onDrawingChange?: (drawing: boolean) => void;
};

function PlantSketch() {
  return (
    <svg viewBox="0 0 240 240" className="plant-sketch" aria-label="Hand drawn plant">
      <path d="M120 205 C115 155 125 105 118 54" />
      <path d="M119 114 C83 115 64 96 55 71 C86 68 112 81 119 114Z" />
      <path d="M120 142 C153 138 176 116 183 90 C151 91 129 109 120 142Z" />
      <path d="M118 70 C97 57 94 34 103 18 C126 27 134 49 118 70Z" />
      <path d="M55 207 Q120 175 190 207" />
      <path d="M92 207 L78 228 M120 202 L120 231 M148 203 L165 227" />
      <circle cx="195" cy="38" r="25" />
      <path d="M195 1 V12 M195 64 V77 M158 38 H171 M220 38 H233 M169 12 L178 21 M213 55 L222 64" />
    </svg>
  );
}

function BoardItem({ element, order }: { element: BoardElement; order: number }) {
  const style = {
    left: `${(element.x / 1200) * 100}%`,
    top: `${(element.y / 780) * 100}%`,
    width: element.width ? `${(element.width / 1200) * 100}%` : undefined,
    height: element.height ? `${(element.height / 780) * 100}%` : undefined,
    animationDelay: `${Math.min(order * 0.035, 0.25)}s`,
  };

  if (element.type === "divider") {
    return <div className={`board-divider ink-${element.color}`} style={style} />;
  }

  if (element.type === "arrow") {
    return (
      <div className={`board-arrow ink-${element.color}`} style={style}>
        <span />
      </div>
    );
  }

  if (element.type === "sketch") {
    return (
      <div className={`board-item board-sketch ink-${element.color}`} style={style}>
        <PlantSketch />
      </div>
    );
  }

  if (element.type === "box") {
    return (
      <div className={`board-item board-box ink-${element.color}`} style={style}>
        {(element.label ?? "").split("\n").map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`board-item board-${element.type} ink-${element.color ?? "navy"} size-${element.size ?? "md"}`}
      style={style}
    >
      {(element.text ?? "").split("\n").map((line, index) => (
        <span key={`${line}-${index}`}>{line}</span>
      ))}
    </div>
  );
}

export function Whiteboard({ lesson, revealAll, checkpointComplete, followUps, onDrawingChange }: WhiteboardProps) {
  const [visible, setVisible] = useState(0);
  const baseLimit = revealAll ? lesson.elements.length : Math.min(lesson.elements.length, lesson.checkpointIndex + 1);
  const shownContinuation = checkpointComplete || revealAll;
  const allElements = useMemo(
    () => [
      ...lesson.elements.slice(0, baseLimit),
      ...(shownContinuation ? lesson.continuation : []),
      ...followUps,
    ],
    [baseLimit, followUps, lesson, shownContinuation],
  );

  useEffect(() => {
    setVisible(0);
  }, [lesson.id]);

  useEffect(() => {
    if (visible >= allElements.length) {
      onDrawingChange?.(false);
      return;
    }
    onDrawingChange?.(true);
    const timer = window.setTimeout(() => setVisible((value) => value + 1), visible === 0 ? 180 : 340);
    return () => window.clearTimeout(timer);
  }, [allElements.length, onDrawingChange, visible]);

  return (
    <div className="whiteboard-shell">
      <div className="whiteboard" role="img" aria-label={`Visual lesson: ${lesson.title}`}>
        <div className="board-grid" />
        {allElements.slice(0, visible).map((element, index) => (
          <BoardItem key={element.id} element={element} order={index} />
        ))}
        {visible < allElements.length && (
          <div className="drawing-cursor" style={{ left: `${24 + ((visible * 13) % 60)}%`, top: `${18 + ((visible * 11) % 58)}%` }}>
            <span />
          </div>
        )}
        <div className="board-signature">visually</div>
      </div>
    </div>
  );
}

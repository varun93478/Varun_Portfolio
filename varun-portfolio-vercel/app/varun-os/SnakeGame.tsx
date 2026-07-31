"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./varun-os.module.css";

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";
const width = 18;
const height = 12;
const initialSnake: Point[] = [{ x: 5, y: 6 }, { x: 4, y: 6 }, { x: 3, y: 6 }];

function nextFood(snake: Point[]): Point {
  const available: Point[] = [];
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    if (!snake.some((part) => part.x === x && part.y === y)) available.push({ x, y });
  }
  return available[Math.floor(Math.random() * available.length)] ?? { x: 12, y: 6 };
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [food, setFood] = useState<Point>({ x: 12, y: 6 });
  const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
  const [score, setScore] = useState(0);
  const direction = useRef<Direction>("right");
  const queuedDirection = useRef<Direction>("right");

  const reset = useCallback(() => {
    setSnake(initialSnake);
    setFood({ x: 12, y: 6 });
    setScore(0);
    direction.current = "right";
    queuedDirection.current = "right";
    setStatus("running");
  }, []);

  const steer = useCallback((next: Direction) => {
    const opposite = { up: "down", down: "up", left: "right", right: "left" } as const;
    if (opposite[direction.current] !== next) queuedDirection.current = next;
    setStatus((value) => value === "idle" ? "running" : value);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const directions: Record<string, Direction | undefined> = {
        ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down",
        ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right",
      };
      const next = directions[event.key];
      if (next) {
        event.preventDefault();
        steer(next);
      }
      if (event.key === " " && status !== "running") {
        event.preventDefault();
        reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reset, status, steer]);

  useEffect(() => {
    if (status !== "running") return;
    const timer = window.setInterval(() => {
      setSnake((current) => {
        direction.current = queuedDirection.current;
        const head = current[0];
        const delta = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[direction.current];
        const next = { x: head.x + delta[0], y: head.y + delta[1] };
        const hitWall = next.x < 0 || next.x >= width || next.y < 0 || next.y >= height;
        const hitSelf = current.some((part) => part.x === next.x && part.y === next.y);
        if (hitWall || hitSelf) {
          setStatus("over");
          return current;
        }
        const ate = next.x === food.x && next.y === food.y;
        const updated = [next, ...current];
        if (!ate) updated.pop();
        else {
          setScore((value) => value + 1);
          setFood(nextFood(updated));
        }
        return updated;
      });
    }, 145);
    return () => window.clearInterval(timer);
  }, [food, status]);

  return (
    <div className={styles.snakeApp}>
      <header><div><p>DEPENDENCY SNAKE / SYSTEM SIMULATION</p><h2>Collect clarity.<br />Avoid hidden dependencies.</h2></div><dl><div><dt>Score</dt><dd>{String(score).padStart(2, "0")}</dd></div><div><dt>State</dt><dd>{status}</dd></div></dl></header>
      <div className={styles.gameLayout}>
        <div className={styles.gameBoard} style={{ "--columns": width, "--rows": height } as React.CSSProperties} role="img" aria-label={`Dependency Snake game. Score ${score}.`}>
          {Array.from({ length: width * height }, (_, index) => {
            const x = index % width;
            const y = Math.floor(index / width);
            const snakeIndex = snake.findIndex((part) => part.x === x && part.y === y);
            const isFood = food.x === x && food.y === y;
            return <i key={index} className={snakeIndex === 0 ? styles.snakeHead : snakeIndex > 0 ? styles.snakeBody : isFood ? styles.snakeFood : ""}>{isFood ? "C" : ""}</i>;
          })}
          {status !== "running" && <button type="button" className={styles.gameOverlay} onClick={reset}><b>{status === "over" ? "Dependency collision" : "System paused"}</b><span>{status === "over" ? "Run simulation again" : "Start simulation"} →</span></button>}
        </div>
        <aside><p>CONTROL SURFACE</p><div className={styles.dpad}><button type="button" onClick={() => steer("up")}>↑</button><button type="button" onClick={() => steer("left")}>←</button><button type="button" onClick={() => steer("down")}>↓</button><button type="button" onClick={() => steer("right")}>→</button></div><small>Arrow keys or WASD</small><dl><div><dt><i className={styles.clarityKey}>C</i></dt><dd>Clarity node<br /><span>+1 system insight</span></dd></div><div><dt><i className={styles.dependencyKey} /></dt><dd>Dependency chain<br /><span>Do not collide</span></dd></div></dl></aside>
      </div>
    </div>
  );
}

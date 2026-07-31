"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./varun-os.module.css";

const colors = ["#16191e", "#3155e7", "#df705c", "#57a486", "#c5a51a", "#f4f1e9"];

export function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState(colors[1]);
  const [size, setSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const resize = () => {
      const snapshot = document.createElement("canvas");
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      snapshot.getContext("2d")?.drawImage(canvas, 0, 0);
      const ratio = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.max(1, canvas.clientWidth * ratio);
      canvas.height = Math.max(1, canvas.clientHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.fillStyle = "#ece9e1";
      context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      if (snapshot.width) context.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, canvas.clientWidth, canvas.clientHeight);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, []);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    drawingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const position = point(event);
    context.beginPath();
    context.moveTo(position.x, position.y);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const position = point(event);
    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(position.x, position.y);
    context.stroke();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.fillStyle = "#ece9e1";
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  };

  const download = () => {
    const link = document.createElement("a");
    link.download = "varun-os-paint.png";
    link.href = canvasRef.current?.toDataURL("image/png") ?? "";
    link.click();
  };

  return (
    <div className={styles.paintApp}>
      <header>
        <div><span>BRUSH</span>{colors.map((item) => <button type="button" key={item} aria-label={`Use ${item} paint`} aria-pressed={color === item} style={{ background: item }} onClick={() => setColor(item)} />)}</div>
        <label><span>SIZE</span><input type="range" min="1" max="24" value={size} onChange={(event) => setSize(Number(event.target.value))} /><b>{size}px</b></label>
        <div><button type="button" onClick={clear}>Clear</button><button type="button" onClick={download}>Save PNG</button></div>
      </header>
      <div className={styles.paintCanvasWrap}>
        <canvas ref={canvasRef} aria-label="Drawing canvas" onPointerDown={start} onPointerMove={draw} onPointerUp={() => { drawingRef.current = false; }} onPointerCancel={() => { drawingRef.current = false; }} />
        <p>DRAW SOMETHING THE SYSTEM DIDN’T EXPECT.</p>
      </div>
    </div>
  );
}

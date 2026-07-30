"use client";

import type { MeshBasicMaterial } from "three";
import { useEffect, useRef, useState } from "react";
import styles from "./concepts.module.css";

const lenses = [
  {
    id: "roles",
    label: "Roles",
    detail: "Make ownership, permissions and hand-offs explicit.",
  },
  {
    id: "rules",
    label: "Rules",
    detail: "Expose the policies and constraints shaping each workflow.",
  },
  {
    id: "data",
    label: "Data",
    detail: "Structure dense information around the next decision.",
  },
  {
    id: "decisions",
    label: "Decisions",
    detail: "Show available actions, consequences and system feedback.",
  },
] as const;

export function SystemOrbit3D({ accent }: { accent: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const nodeMaterialsRef = useRef<MeshBasicMaterial[]>([]);
  const activeRef = useRef(1);
  const keyboardRotationRef = useRef({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(1);
  const activeLens = lenses[activeIndex];

  useEffect(() => {
    activeRef.current = activeIndex;
    nodeMaterialsRef.current.forEach((material, index) => {
      material.color.set(index === activeIndex ? accent : "#f5f5f0");
      material.opacity = index === activeIndex ? 0.95 : 0.72;
    });
  }, [accent, activeIndex]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let frame = 0;
    let resizeObserver: ResizeObserver | undefined;
    let removePointer = () => {};

    async function initialise() {
      const THREE = await import("three");
      if (disposed || !mount) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compactViewport = window.matchMedia("(max-width: 700px)").matches;
      if (compactViewport) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 2.9, 8.4);
      camera.lookAt(0, 0, 0);

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      mount.appendChild(renderer.domElement);

      const system = new THREE.Group();
      system.rotation.x = -0.24;
      system.scale.setScalar(0.78);
      scene.add(system);

      const accentColor = new THREE.Color(accent);
      const lineColor = new THREE.Color("#576170");
      const paleColor = new THREE.Color("#f5f5f0");

      const coreGeometry = new THREE.BoxGeometry(1.45, 1.05, 1.45);
      const coreMaterial = new THREE.MeshBasicMaterial({ color: accentColor });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.position.y = 0.22;
      core.rotation.y = Math.PI / 4;
      system.add(core);

      const coreEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(coreGeometry),
        new THREE.LineBasicMaterial({ color: "#dbe3ff", transparent: true, opacity: 0.85 }),
      );
      coreEdges.position.copy(core.position);
      coreEdges.rotation.copy(core.rotation);
      system.add(coreEdges);

      const platformGeometry = new THREE.BoxGeometry(1.9, 0.16, 1.9);
      const platform = new THREE.Mesh(
        platformGeometry,
        new THREE.MeshBasicMaterial({ color: "#d9d9d3", transparent: true, opacity: 0.85 }),
      );
      platform.position.y = -0.42;
      platform.rotation.y = Math.PI / 4;
      system.add(platform);

      const nodeGeometry = new THREE.BoxGeometry(1.08, 0.72, 1.08);
      const positions = [
        new THREE.Vector3(-2.35, 0.12, -1.35),
        new THREE.Vector3(2.35, 0.12, -1.35),
        new THREE.Vector3(-2.35, 0.12, 1.35),
        new THREE.Vector3(2.35, 0.12, 1.35),
      ];

      nodeMaterialsRef.current = positions.map((position, index) => {
        const material = new THREE.MeshBasicMaterial({
          color: index === activeRef.current ? accentColor : paleColor,
          transparent: true,
          opacity: index === activeRef.current ? 0.95 : 0.72,
        });
        const node = new THREE.Mesh(nodeGeometry, material);
        node.position.copy(position);
        node.rotation.y = Math.PI / 4;
        system.add(node);

        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(nodeGeometry),
          new THREE.LineBasicMaterial({
            color: index === activeRef.current ? accentColor : lineColor,
            transparent: true,
            opacity: 0.9,
          }),
        );
        edges.position.copy(position);
        edges.rotation.copy(node.rotation);
        system.add(edges);

        const connectorGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(position.x * 0.72, -0.08, position.z * 0.72),
          new THREE.Vector3(position.x * 0.34, -0.08, position.z * 0.34),
        ]);
        system.add(
          new THREE.Line(
            connectorGeometry,
            new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0.72 }),
          ),
        );
        return material;
      });

      const rings: InstanceType<typeof THREE.LineSegments>[] = [];
      [2.15, 3.15, 4.15].forEach((radius, index) => {
        const ringGeometry = new THREE.RingGeometry(radius, radius + 0.015, 80);
        const ring = new THREE.LineSegments(
          new THREE.EdgesGeometry(ringGeometry),
          new THREE.LineBasicMaterial({
            color: index === 0 ? accentColor : lineColor,
            transparent: true,
            opacity: index === 0 ? 0.34 : 0.2,
          }),
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = -0.48;
        rings.push(ring);
        system.add(ring);
      });

      const pointerTarget = { x: 0, y: 0 };
      const onPointerMove = (event: PointerEvent) => {
        const bounds = mount.getBoundingClientRect();
        pointerTarget.y = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.32;
        pointerTarget.x = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.16;
      };
      const onPointerLeave = () => {
        pointerTarget.x = 0;
        pointerTarget.y = 0;
      };
      mount.addEventListener("pointermove", onPointerMove);
      mount.addEventListener("pointerleave", onPointerLeave);
      removePointer = () => {
        mount.removeEventListener("pointermove", onPointerMove);
        mount.removeEventListener("pointerleave", onPointerLeave);
      };

      const resize = () => {
        const width = Math.max(1, mount.clientWidth);
        const height = Math.max(1, mount.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const render = (time = 0) => {
        const keyboardRotation = keyboardRotationRef.current;
        const targetX = -0.24 + pointerTarget.x + keyboardRotation.x;
        const targetY = pointerTarget.y + keyboardRotation.y;
        system.rotation.x += (targetX - system.rotation.x) * 0.055;
        system.rotation.y += (targetY - system.rotation.y) * 0.055;
        if (!reduceMotion) {
          core.position.y = 0.22 + Math.sin(time * 0.0012) * 0.045;
          coreEdges.position.y = core.position.y;
          rings[0].rotation.z = time * 0.00009;
        }
        renderer.render(scene, camera);
        if (!reduceMotion) frame = window.requestAnimationFrame(render);
      };
      render();

      if (reduceMotion) renderer.render(scene, camera);

      return () => {
        window.cancelAnimationFrame(frame);
        resizeObserver?.disconnect();
        removePointer();
        scene.traverse((object) => {
          if ("geometry" in object && object.geometry instanceof THREE.BufferGeometry) object.geometry.dispose();
          if ("material" in object) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
        nodeMaterialsRef.current = [];
      };
    }

    let cleanup: (() => void) | undefined;
    void initialise().then((dispose) => {
      if (disposed) dispose?.();
      else cleanup = dispose;
    });

    return () => {
      disposed = true;
      cleanup?.();
      resizeObserver?.disconnect();
      removePointer();
    };
  }, [accent]);

  function nudgeModel(event: React.KeyboardEvent<HTMLDivElement>) {
    const rotation = keyboardRotationRef.current;
    if (event.key === "ArrowLeft") rotation.y -= 0.12;
    else if (event.key === "ArrowRight") rotation.y += 0.12;
    else if (event.key === "ArrowUp") rotation.x -= 0.08;
    else if (event.key === "ArrowDown") rotation.x += 0.08;
    else return;
    event.preventDefault();
  }

  return (
    <section className={styles.systemOrbit} aria-label="Interactive systems design model">
      <div className={styles.systemOrbitHeader}>
        <span>Live system model</span>
        <small>Move or use arrow keys to explore</small>
      </div>

      <div
        className={styles.systemOrbitStage}
        ref={mountRef}
        tabIndex={0}
        onKeyDown={nudgeModel}
        aria-label="A model showing roles, rules, data and decisions connected to clarity. Use arrow keys to change its perspective."
      >
        <div className={styles.systemOrbitFallback} aria-hidden="true">
          <i className={styles.systemOrbitFallbackCore}>Clarity</i>
          {lenses.map((lens) => <i key={lens.id}>{lens.label}</i>)}
        </div>
        <span className={styles.systemOrbitCoreLabel} aria-hidden="true">Clarity</span>
      </div>

      <div className={styles.systemOrbitControls} aria-label="Explore the systems design lens">
        {lenses.map((lens, index) => (
          <button
            key={lens.id}
            type="button"
            className={index === activeIndex ? styles.systemOrbitControlActive : ""}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {lens.label}
          </button>
        ))}
      </div>

      <p className={styles.systemOrbitDetail} aria-live="polite">
        <strong>{activeLens.label}</strong>
        {activeLens.detail}
      </p>
    </section>
  );
}

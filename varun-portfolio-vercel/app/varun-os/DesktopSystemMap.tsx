"use client";

import { useEffect, useRef } from "react";
import styles from "./varun-os.module.css";

export function DesktopSystemMap() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let frame = 0;
    let renderer: import("three").WebGLRenderer | undefined;
    let scene: import("three").Scene | undefined;
    let cleanupResize: (() => void) | undefined;

    void import("three").then((THREE) => {
      if (disposed || !mount) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compact = window.matchMedia("(max-width: 760px)").matches;
      if (compact) return;

      scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 1.6, 8.5);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      mount.appendChild(renderer.domElement);

      const system = new THREE.Group();
      system.rotation.set(-0.28, -0.18, 0);
      scene.add(system);
      const blue = new THREE.Color("#3155e7");
      const graphite = new THREE.Color("#606a79");

      const points = [
        [-2.7, 1.2, -0.5], [-0.9, 2.05, 0.2], [1.15, 1.25, -0.6], [2.9, 2.05, 0.35],
        [-2.3, -0.8, 0.45], [-0.25, -0.35, -0.4], [1.9, -0.75, 0.55], [3.2, 0.25, -0.2],
      ] as const;

      const geometry = new THREE.BufferGeometry().setFromPoints(points.flatMap((point, index) =>
        points.slice(index + 1, index + 3).flatMap((next) => [new THREE.Vector3(...point), new THREE.Vector3(...next)]),
      ));
      system.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: graphite, transparent: true, opacity: 0.32 })));

      points.forEach((point, index) => {
        const nodeGeometry = index === 5 ? new THREE.BoxGeometry(0.9, 0.9, 0.9) : new THREE.OctahedronGeometry(index % 3 === 0 ? 0.23 : 0.14);
        const material = new THREE.MeshBasicMaterial({ color: index === 5 ? blue : graphite, wireframe: index !== 5, transparent: true, opacity: index === 5 ? 0.72 : 0.48 });
        const node = new THREE.Mesh(nodeGeometry, material);
        node.position.set(point[0], point[1], point[2]);
        system.add(node);
      });

      [2.1, 3.4, 4.8].forEach((radius, index) => {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(radius, radius + 0.012, 84),
          new THREE.MeshBasicMaterial({ color: index === 0 ? blue : graphite, transparent: true, opacity: index === 0 ? 0.18 : 0.1, side: THREE.DoubleSide }),
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -1.1;
        system.add(ring);
      });

      const pointer = { x: 0, y: 0 };
      const onPointer = (event: PointerEvent) => {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.28;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.13;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const resize = () => {
        if (!renderer || !mount) return;
        renderer.setSize(mount.clientWidth, mount.clientHeight, false);
        camera.aspect = mount.clientWidth / Math.max(1, mount.clientHeight);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(mount);
      cleanupResize = () => {
        observer.disconnect();
        window.removeEventListener("pointermove", onPointer);
      };
      resize();

      const render = (time = 0) => {
        system.rotation.y += (pointer.x - system.rotation.y) * 0.025;
        system.rotation.x += (-0.28 + pointer.y - system.rotation.x) * 0.025;
        if (!reduced) system.position.y = Math.sin(time * 0.0005) * 0.08;
        renderer?.render(scene!, camera);
        if (!reduced) frame = window.requestAnimationFrame(render);
      };
      render();
    }).catch(() => undefined);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      cleanupResize?.();
      scene?.traverse((object) => {
        const disposable = object as unknown as {
          geometry?: import("three").BufferGeometry;
          material?: import("three").Material | import("three").Material[];
        };
        disposable.geometry?.dispose();
        if (disposable.material) {
          const material = disposable.material;
          (Array.isArray(material) ? material : [material]).forEach((item) => item.dispose());
        }
      });
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return <div className={styles.threeMap} ref={mountRef} aria-hidden="true" />;
}

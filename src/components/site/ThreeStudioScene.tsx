"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ThreeStudioScene — Cena Cinética de Nós de Software (Ateliê Sanle)
 *
 * Renderiza uma constelação WebGL tridimensional com partículas nodais e
 * filamentos de conexão que reagem de forma orgânica à física do cursor do mouse
 * e à rolagem da página (scrub sincronizado via GSAP ScrollTrigger).
 *
 * Paleta: Obsidian Studio (#07080A), Cobalto Ateliê (#2440FF / #78A9FF),
 * Titânio (#F5F6F8) e Acento Ouro Artesanal (#C8A24A). Zero estética genérica de IA.
 */
export function ThreeStudioScene({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detecta suporte a WebGL antes de inicializar
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) return;
    } catch {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let animationFrameId: number;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Cena e Câmera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 32;

    // 2. Renderer de Alta Eficiência
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // 3. Grupo Mestre da Constelação
    const constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    // 4. Criação dos Nós (Vértices de Software)
    const nodeCount = 110;
    const nodePositions: [number, number, number][] = [];
    const nodeVelocities: { x: number; y: number; z: number }[] = [];

    const positionsArray = new Float32Array(nodeCount * 3);
    const colorsArray = new Float32Array(nodeCount * 3);

    const palette = [
      new THREE.Color("#2440FF"), // Cobalto Primário
      new THREE.Color("#78A9FF"), // Azul Cinético
      new THREE.Color("#F5F6F8"), // Titânio Claro
      new THREE.Color("#C8A24A")  // Ouro Ateliê
    ];

    for (let i = 0; i < nodeCount; i++) {
      const radius = 10 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = (radius * Math.sin(phi) * Math.sin(theta)) * 0.7; // Elipse achatada
      const z = (radius * Math.cos(phi)) * 0.8;

      nodePositions.push([x, y, z]);
      nodeVelocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.005
      });

      positionsArray[i * 3] = x;
      positionsArray[i * 3 + 1] = y;
      positionsArray[i * 3 + 2] = z;

      const color = palette[Math.floor(Math.random() * palette.length)]!;
      colorsArray[i * 3] = color.r;
      colorsArray[i * 3 + 1] = color.g;
      colorsArray[i * 3 + 2] = color.b;
    }

    // Geometria e Material dos Nós
    const nodesGeometry = new THREE.BufferGeometry();
    nodesGeometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));
    nodesGeometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));

    // Textura circular procedural para nós suaves
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.7)");
      gradient.addColorStop(0.7, "rgba(255,255,255,0.15)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const nodesMaterial = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pointCloud = new THREE.Points(nodesGeometry, nodesMaterial);
    constellationGroup.add(pointCloud);

    // 5. Linhas de Conexão Espacial (Filamentos entre nós próximos)
    const maxConnections = 180;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const connectionLines = new THREE.LineSegments(linesGeometry, linesMaterial);
    constellationGroup.add(connectionLines);

    // 6. Iluminação e Profundidade Atmosférica
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x2440ff, 2.5, 50);
    pointLight.position.set(0, 5, 15);
    scene.add(pointLight);

    // 7. Física do Mouse e Interatividade Orgânica
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouse.x = normX;
      targetMouse.y = normY;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // 8. Integração GSAP ScrollTrigger Scrub
    let scrollTriggerInstance: ScrollTrigger | null = null;
    try {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        }
      });
    } catch {
      // ScrollTrigger seguro em ambientes SSR/Headless
    }

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // 10. Loop de Renderização e Animação Cinética
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Suavização da física do cursor (interpolação lerp com inércia)
      mouse.x += (targetMouse.x - mouse.x) * 0.045;
      mouse.y += (targetMouse.y - mouse.y) * 0.045;

      const progress = scrollProgressRef.current;

      // Movimentação orbital da constelação (mouse + rotação natural + rolagem da página)
      constellationGroup.rotation.y = elapsedTime * 0.04 + mouse.x * 0.4 + progress * Math.PI * 0.6;
      constellationGroup.rotation.x = Math.sin(elapsedTime * 0.03) * 0.08 - mouse.y * 0.3;
      constellationGroup.rotation.z = mouse.x * 0.15;

      camera.position.z = 32 - progress * 8; // Zoom progressivo de imersão ao rolar

      // Atualiza conexões entre nós próximos
      let connectionIdx = 0;
      const posAttr = nodesGeometry.getAttribute("position") as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      // Movimentação lenta e flutuante dos nós
      for (let i = 0; i < nodeCount; i++) {
        const vel = nodeVelocities[i]!;
        const idxX = i * 3;
        const idxY = i * 3 + 1;
        const idxZ = i * 3 + 2;
        posArr[idxX] = (posArr[idxX] ?? 0) + Math.sin(elapsedTime + i) * 0.003 + vel.x;
        posArr[idxY] = (posArr[idxY] ?? 0) + Math.cos(elapsedTime + i) * 0.003 + vel.y;
        posArr[idxZ] = (posArr[idxZ] ?? 0) + Math.sin(elapsedTime * 0.5 + i) * 0.002 + vel.z;
      }
      posAttr.needsUpdate = true;

      const maxDist = 5.2;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < nodeCount && connectionIdx < maxConnections; i++) {
        const xi = posArr[i * 3]!;
        const yi = posArr[i * 3 + 1]!;
        const zi = posArr[i * 3 + 2]!;

        for (let j = i + 1; j < nodeCount && connectionIdx < maxConnections; j++) {
          const xj = posArr[j * 3]!;
          const yj = posArr[j * 3 + 1]!;
          const zj = posArr[j * 3 + 2]!;

          const dx = xi - xj;
          const dy = yi - yj;
          const dz = zi - zj;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxDistSq) {
            const alpha = 1 - Math.sqrt(distSq) / maxDist;
            const linePIdx = connectionIdx * 6;

            linePositions[linePIdx] = xi;
            linePositions[linePIdx + 1] = yi;
            linePositions[linePIdx + 2] = zi;

            linePositions[linePIdx + 3] = xj;
            linePositions[linePIdx + 4] = yj;
            linePositions[linePIdx + 5] = zj;

            // Gradiente cobalto suave nos filamentos
            lineColors[linePIdx] = 0.14 * alpha;
            lineColors[linePIdx + 1] = 0.25 * alpha;
            lineColors[linePIdx + 2] = 1.0 * alpha;

            lineColors[linePIdx + 3] = 0.47 * alpha;
            lineColors[linePIdx + 4] = 0.66 * alpha;
            lineColors[linePIdx + 5] = 1.0 * alpha;

            connectionIdx++;
          }
        }
      }

      // Preenche linhas restantes com zero
      for (let k = connectionIdx * 6; k < maxConnections * 6; k++) {
        linePositions[k] = 0;
        lineColors[k] = 0;
      }

      (linesGeometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      (linesGeometry.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup rigoroso de memória GPU e eventos
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }

      // Descarte de geometrias e materiais
      nodesGeometry.dispose();
      nodesMaterial.dispose();
      particleTexture.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CameraRigController } from "./CameraRig";
import { buildConnectionNetwork, type SpatialNodeDatum } from "./ConnectionNetwork";
import { computeStoryTimelineState, lerp } from "@/lib/motion/scroll-timelines";
import { detectWebGLSupport, useIsMobileViewport, useReducedMotion } from "@/lib/motion/reduced-motion";
import { disposeThreeScene } from "@/lib/motion/cleanup";

interface OpportunityFieldProps {
  /** Progresso normalizado [0..1] da narrativa de 8 cenas */
  scrollProgress: number;
  className?: string;
}

/**
 * SALES HUNTER — OpportunityField 3D WebGL Engine
 * Composição tridimensional própria com geometria procedural instanciada,
 * linhas de conexão espacial, ponto focal de oportunidade (#B7F36B) e
 * fallback imediato para dispositivos sem WebGL.
 */
export function OpportunityField({ scrollProgress, className = "" }: OpportunityFieldProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(scrollProgress);
  progressRef.current = scrollProgress;

  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobileViewport(768);

  useEffect(() => {
    const supported = detectWebGLSupport();
    setWebglSupported(supported);
    if (!supported) return;

    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance"
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    // Limite estrito de DPR (Performance Seção 16)
    const maxDpr = isMobile ? 1.25 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x08090c, 0);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090c, 0.068);

    const camera = new THREE.PerspectiveCamera(
      45,
      Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight),
      0.1,
      60
    );

    const cameraRig = new CameraRigController();

    // Grupo principal da composição
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Plano de grade arquitetural sutil no horizonte
    const gridHelper = new THREE.GridHelper(28, 28, 0x78a9ff, 0x191c22);
    gridHelper.position.y = -2.4;
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.14;
    worldGroup.add(gridHelper);

    // Geração determinística de nós de empresas (reduzida em mobile para 60fps constantes)
    const nodeCount = isMobile ? 48 : 110;
    const nodes: SpatialNodeDatum[] = [];

    // Nó 0 é o Ponto Central / Oportunidade Principal (#B7F36B)
    nodes.push({
      id: 0,
      position: new THREE.Vector3(0.9, 0.15, 0),
      cluster: 0,
      isOpportunity: true,
      baseScale: 1.9
    });

    for (let i = 1; i < nodeCount; i++) {
      // Distribuição espacial em clusters arquiteturais (não globo terrestre)
      const seed1 = Math.sin(i * 12.9898) * 43758.5453;
      const seed2 = Math.sin(i * 78.233) * 43758.5453;
      const seed3 = Math.sin(i * 39.425) * 43758.5453;
      const fx = seed1 - Math.floor(seed1);
      const fy = seed2 - Math.floor(seed2);
      const fz = seed3 - Math.floor(seed3);

      const clusterIdx = i % 4;
      const clusterOffsets: [number, number, number][] = [
        [-2.8, 0.2, -1.5],
        [1.1, 0.1, -0.4],
        [-0.5, -0.4, 1.6],
        [2.6, 0.4, -2.2]
      ];
      const offset = clusterOffsets[clusterIdx]!;

      const x = offset[0] + (fx - 0.5) * 5.2;
      const y = offset[1] + (fy - 0.5) * 2.4;
      const z = offset[2] + (fz - 0.5) * 4.8;

      const isOpportunity = i === 14 || i === 29 || i === 53;

      nodes.push({
        id: i,
        position: new THREE.Vector3(x, y, z),
        cluster: clusterIdx,
        isOpportunity,
        baseScale: isOpportunity ? 1.45 : 0.65 + fx * 0.55
      });
    }

    // Geometria instanciada para todos os nós de empresas (1 draw call)
    const nodeGeo = new THREE.OctahedronGeometry(0.065, 1);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);

    const dummy = new THREE.Object3D();
    const colorWhite = new THREE.Color("#F5F6F8");
    const colorBlue = new THREE.Color("#78A9FF");
    const colorGreen = new THREE.Color("#B7F36B");

    nodes.forEach((node, idx) => {
      dummy.position.copy(node.position);
      dummy.scale.setScalar(node.baseScale);
      dummy.updateMatrix();
      instancedNodes.setMatrixAt(idx, dummy.matrix);

      if (node.isOpportunity) {
        instancedNodes.setColorAt(idx, colorGreen);
      } else if (idx % 3 === 0) {
        instancedNodes.setColorAt(idx, colorBlue);
      } else {
        instancedNodes.setColorAt(idx, colorWhite);
      }
    });
    instancedNodes.instanceMatrix.needsUpdate = true;
    if (instancedNodes.instanceColor) instancedNodes.instanceColor.needsUpdate = true;
    worldGroup.add(instancedNodes);

    // Halo óptico em torno da Oportunidade Principal (Cena 01 e Cena 04)
    const haloGeo = new THREE.RingGeometry(0.16, 0.2, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xb7f36b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.copy(nodes[0]!.position);
    worldGroup.add(haloMesh);

    // Rede de conexões
    const { networkLines, networkMaterial, opportunityLines, opportunityMaterial } =
      buildConnectionNetwork(nodes);
    worldGroup.add(networkLines);
    worldGroup.add(opportunityLines);

    // Interação de ponteiro leve
    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerY = -(e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Pausa renderização quando fora da tela
    let isInViewport = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isInViewport = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    // Resize com debounce leve
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!container || !renderer) return;
        const w = Math.max(1, container.clientWidth);
        const h = Math.max(1, container.clientHeight);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 100);
    };
    window.addEventListener("resize", onResize, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (isInViewport && renderer) {
        const p = progressRef.current;
        const timelineState = computeStoryTimelineState(p);

        // Na Cena 01 (Before the Signal), o nó principal fica no centro (0,0,0) e migra para sua coordenada na rede
        const originBlend = Math.min(1, p * 6.5);
        const mainNodePos = new THREE.Vector3(
          lerp(0, 0.9, originBlend),
          lerp(0, 0.15, originBlend),
          0
        );
        dummy.position.copy(mainNodePos);
        const pulse = reducedMotion ? 1.8 : 1.7 + Math.sin(now * 0.0035) * 0.25;
        dummy.scale.setScalar(pulse * (0.8 + timelineState.opportunityFocus * 0.6));
        dummy.updateMatrix();
        instancedNodes.setMatrixAt(0, dummy.matrix);
        instancedNodes.instanceMatrix.needsUpdate = true;

        haloMesh.position.copy(mainNodePos);
        haloMesh.lookAt(camera.position);
        const haloScale = 1 + timelineState.opportunityFocus * 1.4 + (reducedMotion ? 0 : Math.sin(now * 0.0025) * 0.18);
        haloMesh.scale.setScalar(haloScale);
        haloMat.opacity = 0.25 + timelineState.opportunityFocus * 0.55;

        // Controla opacidade da rede espacial conforme a cena ativa
        networkMaterial.opacity = 0.04 + timelineState.networkIntensity * 0.22;
        opportunityMaterial.opacity = 0.08 + timelineState.opportunityFocus * 0.52;

        // Rotação espacial sutil guiada pelo scroll
        worldGroup.rotation.y = (p - 0.2) * 0.55;
        worldGroup.rotation.x = Math.sin(p * Math.PI) * 0.08;

        cameraRig.update(
          camera,
          {
            targetPosition: timelineState.cameraPosition,
            targetLookAt: timelineState.cameraTarget,
            pointerX,
            pointerY,
            reducedMotion
          },
          dt
        );

        renderer.render(scene, camera);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      disposeThreeScene(scene);
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [isMobile, reducedMotion]);

  if (!webglSupported) {
    // Fallback elegante quando WebGL não está disponível
    return (
      <div
        className={`relative h-full w-full overflow-hidden bg-[#08090C] ${className}`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, rgba(183, 243, 107, 0.12), rgba(120, 169, 255, 0.08) 38%, #08090C 75%)"
        }}
      >
        <div
          className="absolute inset-0 opacity-35"
          style={{ backgroundImage: "url('/media/textures/spatial-grid.svg')" }}
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}

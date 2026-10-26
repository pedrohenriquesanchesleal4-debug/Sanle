"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { detectWebGLSupport, useReducedMotion, useIsMobileViewport } from "@/lib/motion/reduced-motion";
import { disposeThreeScene } from "@/lib/motion/cleanup";

export type CinematicEnvironment = "engenharia" | "transicao_1_2" | "investigacao" | "transicao_2_3" | "fluxo";

export interface SanleArchitecture3DProps {
  environment: CinematicEnvironment;
  step: number; // 0..3 para engenharia, 0..6 para investigacao (7 gargalos)
  progress?: number; // 0..1 contínuo
  className?: string;
}

export function SanleArchitecture3D({
  environment,
  step,
  progress = 0,
  className = ""
}: SanleArchitecture3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobileViewport(1024);

  // Armazena estado atual para interpolação contínua no loop rAF
  const stateRef = useRef({ environment, step, progress });
  stateRef.current = { environment, step, progress };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const supported = detectWebGLSupport();
    setWebglSupported(supported);
    if (!supported) return;

    const container = mountRef.current;
    if (!container) return;

    // 1. Inicialização do Renderer Three.js
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

    const maxDpr = isMobile ? 1.25 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x08090c, 0);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Cena & Câmera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      100
    );
    camera.position.set(0, 0, 8.5);

    // 3. Iluminação Volumétrica e Materiais de Engenharia
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    // Luz pontual cobalto da Sanle
    const cobaltLight = new THREE.PointLight(0x2440ff, 3.5, 15);
    cobaltLight.position.set(-2, 1, 3);
    scene.add(cobaltLight);

    // Luz pontual de latão / ouro escultural
    const brassLight = new THREE.PointLight(0xc8a24a, 2.5, 12);
    brassLight.position.set(2, -1, 3);
    scene.add(brassLight);

    // 4. Material dos Anéis Esculturais (Latão nobre de alta reflexão)
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8a24a,
      roughness: 0.28,
      metalness: 0.88
    });

    // Materiais dos Núcleos Luminosos dos 3 Nós
    const sapphireMaterial = new THREE.MeshStandardMaterial({
      color: 0x2440ff,
      emissive: 0x2440ff,
      emissiveIntensity: 0.75,
      roughness: 0.15,
      metalness: 0.2
    });

    const amberMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.2
    });

    const emeraldMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.2
    });

    // 5. Criação dos 3 Nós Arquiteturais da Sanle
    const nodeRingGeo = new THREE.TorusGeometry(0.75, 0.09, 16, 48);
    const nodeCoreGeo = new THREE.IcosahedronGeometry(0.38, 2);

    const node1Group = new THREE.Group();
    node1Group.add(new THREE.Mesh(nodeRingGeo, brassMaterial));
    node1Group.add(new THREE.Mesh(nodeCoreGeo, sapphireMaterial));
    scene.add(node1Group);

    const node2Group = new THREE.Group();
    node2Group.add(new THREE.Mesh(nodeRingGeo, brassMaterial));
    node2Group.add(new THREE.Mesh(nodeCoreGeo, amberMaterial));
    scene.add(node2Group);

    const node3Group = new THREE.Group();
    node3Group.add(new THREE.Mesh(nodeRingGeo, brassMaterial));
    node3Group.add(new THREE.Mesh(nodeCoreGeo, emeraldMaterial));
    scene.add(node3Group);

    // 6. Tubulações & Conexões Vetoriais
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x78a9ff,
      transparent: true,
      opacity: 0.45,
      linewidth: 1.5
    });

    const pipelineGeo = new THREE.BufferGeometry();
    const pipelinePositions = new Float32Array(18); // 3 linhas (6 vértices x 3 componentes)
    pipelineGeo.setAttribute("position", new THREE.BufferAttribute(pipelinePositions, 3));
    const pipelineLines = new THREE.LineSegments(pipelineGeo, lineMaterial);
    scene.add(pipelineLines);

    // 7. Grupo de Elementos Investigativos (Ambiente 02: Os 7 Gargalos)
    const forensicGroup = new THREE.Group();
    scene.add(forensicGroup);

    // A) 7 Planos Flutuantes de Documentos (Gargalo 01)
    const docPlaneGeo = new THREE.PlaneGeometry(0.65, 0.85);
    const docPlaneMat = new THREE.MeshStandardMaterial({
      color: 0xfaf8f5,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const docMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const doc = new THREE.Mesh(docPlaneGeo, docPlaneMat);
      doc.position.set((i - 3) * 0.7, Math.sin(i) * 0.8, -1 - (i % 3) * 0.5);
      doc.rotation.set(0.2, (i - 3) * 0.25, 0.1);
      doc.visible = false;
      forensicGroup.add(doc);
      docMeshes.push(doc);
    }

    // B) Loop Redundante de Moebius (Gargalo 07 / Repetição)
    const loopGeo = new THREE.TorusGeometry(1.4, 0.05, 12, 64);
    const loopMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.4,
      roughness: 0.3
    });
    const loopMesh = new THREE.Mesh(loopGeo, loopMat);
    loopMesh.visible = false;
    forensicGroup.add(loopMesh);

    // 8. Loop de Animação com rAF e Interpolação Suave
    let rafId = 0;
    let isVisible = true;
    let clock = new THREE.Clock();

    const targetPos1 = new THREE.Vector3();
    const targetPos2 = new THREE.Vector3();
    const targetPos3 = new THREE.Vector3();
    const targetCamPos = new THREE.Vector3(0, 0, 8.5);
    const targetCamLook = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const dt = clock.getDelta();
      const time = clock.getElapsedTime();
      const current = stateRef.current;

      // =======================================================================
      // CÁLCULO DE METAS POR AMBIENTE & ETAPA
      // =======================================================================
      if (current.environment === "engenharia") {
        forensicGroup.visible = false;
        node1Group.visible = true;
        node2Group.visible = true;
        node3Group.visible = true;
        pipelineLines.visible = true;

        if (current.step === 0) {
          // CAPÍTULO 01: Caos Manual (Nós dispersos e desarticulados)
          targetPos1.set(-2.8, 1.4, -0.8);
          targetPos2.set(2.4, 1.8, -1.2);
          targetPos3.set(0.4, -2.4, -0.5);
          targetCamPos.set(0, 0, 8.8);
          lineMaterial.color.setHex(0xf59e0b);
          lineMaterial.opacity = 0.15;
        } else if (current.step === 1) {
          // CAPÍTULO 02: Ingestão Estruturada (Aproximação e alinhamento)
          targetPos1.set(-1.8, 0.6, 0.2);
          targetPos2.set(2.0, 1.0, -0.4);
          targetPos3.set(0.2, -1.8, -0.2);
          targetCamPos.set(-0.6, 0, 8.0);
          lineMaterial.color.setHex(0x78a9ff);
          lineMaterial.opacity = 0.45;
        } else if (current.step === 2) {
          // CAPÍTULO 03: Convergência dos Três Nós (Triângulo de Precisão Sanle)
          targetPos1.set(-1.6, 1.0, 0);
          targetPos2.set(1.6, 1.0, 0);
          targetPos3.set(0, -1.4, 0);
          targetCamPos.set(0, 0.2, 7.5);
          lineMaterial.color.setHex(0xc8a24a);
          lineMaterial.opacity = 0.65;
        } else {
          // CAPÍTULO 04: Fluxo Permanente (Sincronismo silencioso em regime de escala)
          targetPos1.set(-1.6, 1.0, 0);
          targetPos2.set(1.6, 1.0, 0);
          targetPos3.set(0, -1.4, 0);
          targetCamPos.set(0, 0, 7.0);
          lineMaterial.color.setHex(0x10b981);
          lineMaterial.opacity = 0.85;
        }
      } else if (current.environment === "transicao_1_2") {
        // TRANSIÇÃO 1 ➔ 2: A Câmera Mergulha na Tubulação e Revela os Atritos Ocultos
        targetPos1.set(-0.8, 0.4, 1.2);
        targetPos2.set(2.2, 0.6, -1.5);
        targetPos3.set(-0.4, -1.8, -1.0);
        targetCamPos.set(-0.5, 0.2, 4.8);
        lineMaterial.color.setHex(0xef4444);
        lineMaterial.opacity = 0.75;
        forensicGroup.visible = true;
      } else if (current.environment === "investigacao") {
        // AMBIENTE 02: O Custo Invisível da Operação (7 Gargalos Investigados)
        forensicGroup.visible = true;
        node1Group.visible = false;
        node2Group.visible = false;
        node3Group.visible = false;
        pipelineLines.visible = false;

        const g = current.step; // 0..6
        docMeshes.forEach((doc, idx) => {
          doc.visible = g === 0 || g === 1 || g === 2;
          if (doc.visible) {
            doc.position.y += Math.sin(time * 2 + idx) * 0.002;
            doc.rotation.z += 0.003;
          }
        });

        loopMesh.visible = g === 6;
        if (loopMesh.visible) {
          loopMesh.rotation.x = time * 0.8;
          loopMesh.rotation.y = time * 1.1;
        }

        targetCamPos.set(0, 0, 6.2);
      } else {
        // AMBIENTE 03: Do Atrito ao Fluxo (Reorganização Definitiva)
        forensicGroup.visible = false;
        node1Group.visible = true;
        node2Group.visible = true;
        node3Group.visible = true;
        pipelineLines.visible = true;

        targetPos1.set(-1.8, 0, 0);
        targetPos2.set(0, 0, 0);
        targetPos3.set(1.8, 0, 0);
        targetCamPos.set(0, 0, 6.8);
        lineMaterial.color.setHex(0x10b981);
        lineMaterial.opacity = 0.95;
      }

      // Interpolação suave de posições (lerp com amortecimento de frame)
      const lerpFactor = Math.min(1, dt * 4.5);
      node1Group.position.lerp(targetPos1, lerpFactor);
      node2Group.position.lerp(targetPos2, lerpFactor);
      node3Group.position.lerp(targetPos3, lerpFactor);
      camera.position.lerp(targetCamPos, lerpFactor);
      camera.lookAt(targetCamLook);

      // Rotação orbital sutil dos anéis em latão
      const rotSpeed = 0.5 * dt;
      node1Group.children[0]!.rotation.x += rotSpeed * 0.8;
      node1Group.children[0]!.rotation.y += rotSpeed * 1.2;
      node2Group.children[0]!.rotation.x -= rotSpeed * 0.9;
      node2Group.children[0]!.rotation.z += rotSpeed * 1.1;
      node3Group.children[0]!.rotation.y += rotSpeed * 1.0;

      // Atualiza vértices das linhas de tubulação conectando os 3 nós
      const p = pipelinePositions;
      // Linha 1 ➔ 2
      p[0] = node1Group.position.x;
      p[1] = node1Group.position.y;
      p[2] = node1Group.position.z;
      p[3] = node2Group.position.x;
      p[4] = node2Group.position.y;
      p[5] = node2Group.position.z;

      // Linha 2 ➔ 3
      p[6] = node2Group.position.x;
      p[7] = node2Group.position.y;
      p[8] = node2Group.position.z;
      p[9] = node3Group.position.x;
      p[10] = node3Group.position.y;
      p[11] = node3Group.position.z;

      // Linha 3 ➔ 1
      p[12] = node3Group.position.x;
      p[13] = node3Group.position.y;
      p[14] = node3Group.position.z;
      p[15] = node1Group.position.x;
      p[16] = node1Group.position.y;
      p[17] = node1Group.position.z;

      pipelineGeo.attributes.position!.needsUpdate = true;

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    // 9. Resize Listener
    const onResize = () => {
      if (!container || !renderer) return;
      camera.aspect = container.clientWidth / Math.max(1, container.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", onResize, { passive: true });

    // 10. IntersectionObserver: Pausa renderização quando fora da viewport para economizar CPU/GPU
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 11. Cleanup Determinístico
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      disposeThreeScene(scene);
      renderer.dispose();
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [isMobile]);

  if (!webglSupported) {
    // Fallback gracioso em SVG de alta precisão caso o dispositivo não suporte WebGL
    return (
      <div className={`relative flex items-center justify-center p-8 bg-[#08090C] rounded-2xl ${className}`}>
        <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto opacity-70">
          <circle cx="120" cy="110" r="45" fill="none" stroke="#C8A24A" strokeWidth="2.5" />
          <circle cx="120" cy="110" r="14" fill="#2440FF" />
          <circle cx="280" cy="110" r="45" fill="none" stroke="#C8A24A" strokeWidth="2.5" />
          <circle cx="280" cy="110" r="14" fill="#F59E0B" />
          <circle cx="200" cy="220" r="45" fill="none" stroke="#C8A24A" strokeWidth="2.5" />
          <circle cx="200" cy="220" r="14" fill="#10B981" />
          <path d="M120 110 L280 110 L200 220 Z" fill="none" stroke="#78A9FF" strokeWidth="1.5" strokeDasharray="6 4" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[300px] md:min-h-[460px] overflow-hidden ${className}`}
      aria-label="Visualização Tridimensional de Engenharia Operacional Sanle"
    />
  );
}

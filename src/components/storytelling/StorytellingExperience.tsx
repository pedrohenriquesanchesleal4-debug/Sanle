"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STORY_SCENES } from "@/lib/motion/motion-config";
import { computeStoryTimelineState } from "@/lib/motion/scroll-timelines";
import { useIsMobileViewport, useReducedMotion } from "@/lib/motion/reduced-motion";
import { OpportunityField } from "@/components/three/OpportunityField";
import { SpatialMarkers } from "@/components/three/SpatialMarkers";
import { ScrollProgress } from "./ScrollProgress";
import { StoryNavigation } from "./StoryNavigation";
import { StoryScene } from "./StoryScene";
import { SceneTransition } from "./SceneTransition";
import { OpeningScene } from "./scenes/OpeningScene";
import { TerritoryScene } from "./scenes/TerritoryScene";
import { SearchScene } from "./scenes/SearchScene";
import { OpportunityScene } from "./scenes/OpportunityScene";
import { IntelligenceScene } from "./scenes/IntelligenceScene";
import { OutreachScene } from "./scenes/OutreachScene";
import { PipelineScene } from "./scenes/PipelineScene";
import { FinaleScene } from "./scenes/FinaleScene";

/**
 * SALES HUNTER — StorytellingExperience (8 Cenas Conectadas pelo Scroll)
 * Em desktop: fixa o palco espacial tridimensional durante a narrativa de 8 cenas
 * controlada pelo ScrollTrigger scrub, com cleanup rigoroso em unmount.
 * Em mobile ou prefers-reduced-motion: recompõe a narrativa em capítulos verticais fluidos
 * sem pinning pesado, mantendo todos os textos, interações e CTAs 100% acessíveis.
 */
export function StorytellingExperience() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [globalProgress, setGlobalProgress] = useState(0);

  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobileViewport(768);
  const stackedMode = reducedMotion || isMobile;

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    if (!track) return;

    if (stackedMode) {
      // No modo mobile / reduced motion, acompanha apenas o progresso de leitura sem pin pesado
      const trigger = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setGlobalProgress(self.progress);
        }
      });
      return () => {
        trigger.kill();
      };
    }

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.65,
      onUpdate: (self) => {
        setGlobalProgress(self.progress);
        if (self.progress > 0.04) {
          window.dispatchEvent(new CustomEvent("sanle:portal-entered"));
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, [stackedMode]);

  const timelineState = computeStoryTimelineState(globalProgress);
  const activeIdx = timelineState.activeSceneIndex;
  const localP = stackedMode ? 1 : timelineState.sceneLocalProgress;

  const handleSelectScene = (sceneIndex: number) => {
    const track = trackRef.current;
    if (!track || typeof window === "undefined") return;
    const scene = STORY_SCENES[sceneIndex];
    if (!scene) return;

    if (stackedMode) {
      const el = document.getElementById(scene.id);
      if (el) el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }

    const rect = track.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const scrollableDistance = Math.max(1, track.offsetHeight - window.innerHeight);
    const targetProgress = (scene.range[0] + scene.range[1]) * 0.5;
    window.scrollTo({
      top: trackTop + scrollableDistance * targetProgress,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  };

  return (
    <section
      id="historia-sanle"
      aria-label="Narrativa Interativa Sales Hunter — The Opportunity Engine"
      ref={trackRef}
      className={
        stackedMode
          ? "relative w-full bg-[#08090C]"
          : "relative h-[780vh] w-full bg-[#08090C]"
      }
    >
      <ScrollProgress progress={globalProgress} activeScene={timelineState.activeScene} />
      <StoryNavigation activeScene={timelineState.activeScene} onSelectScene={handleSelectScene} />

      <div
        ref={stageRef}
        className={
          stackedMode
            ? "relative w-full overflow-hidden"
            : "sticky top-0 h-dvh w-full overflow-hidden"
        }
      >
        {/* Palco 3D WebGL contínuo ao fundo */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <OpportunityField scrollProgress={globalProgress} />
        </div>

        {/* Continuidade óptica e marcadores espaciais */}
        <SceneTransition
          activeScene={timelineState.activeScene}
          sceneLocalProgress={timelineState.sceneLocalProgress}
        />
        <SpatialMarkers
          activeScene={timelineState.activeScene}
          globalProgress={globalProgress}
        />

        {/* As 8 Cenas Conectadas */}
        <div className={stackedMode ? "relative z-20" : "relative z-20 h-full w-full"}>
          <StoryScene
            id={STORY_SCENES[0]!.id}
            active={stackedMode || activeIdx === 0}
            stackedMode={stackedMode}
          >
            <OpeningScene progress={activeIdx === 0 ? localP : 1} active={stackedMode || activeIdx === 0} />
          </StoryScene>

          <StoryScene
            id={STORY_SCENES[1]!.id}
            active={stackedMode || activeIdx === 1}
            stackedMode={stackedMode}
          >
            <TerritoryScene progress={activeIdx === 1 ? localP : 1} active={stackedMode || activeIdx === 1} />
          </StoryScene>

          <StoryScene
            id={STORY_SCENES[2]!.id}
            active={stackedMode || activeIdx === 2}
            stackedMode={stackedMode}
          >
            <SearchScene progress={activeIdx === 2 ? localP : 1} active={stackedMode || activeIdx === 2} />
          </StoryScene>

          <StoryScene
            id={STORY_SCENES[3]!.id}
            active={stackedMode || activeIdx === 3}
            stackedMode={stackedMode}
          >
            <OpportunityScene progress={activeIdx === 3 ? localP : 1} active={stackedMode || activeIdx === 3} />
          </StoryScene>

          <StoryScene
            id={STORY_SCENES[4]!.id}
            active={stackedMode || activeIdx === 4}
            stackedMode={stackedMode}
          >
            <IntelligenceScene progress={activeIdx === 4 ? localP : 1} active={stackedMode || activeIdx === 4} />
          </StoryScene>

          <StoryScene
            id={STORY_SCENES[5]!.id}
            active={stackedMode || activeIdx === 5}
            stackedMode={stackedMode}
          >
            <OutreachScene progress={activeIdx === 5 ? localP : 1} active={stackedMode || activeIdx === 5} />
          </StoryScene>

          <StoryScene
            id={STORY_SCENES[6]!.id}
            active={stackedMode || activeIdx === 6}
            stackedMode={stackedMode}
          >
            <PipelineScene progress={activeIdx === 6 ? localP : 1} active={stackedMode || activeIdx === 6} />
          </StoryScene>

          <StoryScene
            id={STORY_SCENES[7]!.id}
            active={stackedMode || activeIdx === 7}
            stackedMode={stackedMode}
          >
            <FinaleScene progress={activeIdx === 7 ? localP : 1} active={stackedMode || activeIdx === 7} />
          </StoryScene>
        </div>
      </div>
    </section>
  );
}

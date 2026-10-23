import * as THREE from "three";
import { lerp } from "@/lib/motion/scroll-timelines";

export interface CameraRigState {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
}

/**
 * Controla a posição e o alvo da câmera 3D suavizando transições entre as 8 cenas
 * da timeline de scroll e adicionando paralaxe orbital discreta ao cursor.
 */
export class CameraRigController {
  private currentPos = new THREE.Vector3(0, 0.2, 11.5);
  private currentLook = new THREE.Vector3(0, 0, 0);

  update(camera: THREE.PerspectiveCamera, state: CameraRigState, dt: number): void {
    const damping = state.reducedMotion ? 1 : Math.min(1, dt * 5.5);

    const parallaxX = state.reducedMotion ? 0 : state.pointerX * 0.35;
    const parallaxY = state.reducedMotion ? 0 : state.pointerY * 0.22;

    const desiredX = state.targetPosition[0] + parallaxX;
    const desiredY = state.targetPosition[1] + parallaxY;
    const desiredZ = state.targetPosition[2];

    this.currentPos.x = lerp(this.currentPos.x, desiredX, damping);
    this.currentPos.y = lerp(this.currentPos.y, desiredY, damping);
    this.currentPos.z = lerp(this.currentPos.z, desiredZ, damping);

    this.currentLook.x = lerp(this.currentLook.x, state.targetLookAt[0], damping);
    this.currentLook.y = lerp(this.currentLook.y, state.targetLookAt[1], damping);
    this.currentLook.z = lerp(this.currentLook.z, state.targetLookAt[2], damping);

    camera.position.copy(this.currentPos);
    camera.lookAt(this.currentLook);
  }
}

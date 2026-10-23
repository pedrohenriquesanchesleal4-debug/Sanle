import type * as THREE from "three";

/**
 * Realiza limpeza determinística de recursos Three.js (geometrias, materiais e texturas)
 * para evitar vazamento de memória gráfica durante navegação SPA ou React Strict Mode.
 */
export function disposeThreeScene(scene: THREE.Object3D | null | undefined): void {
  if (!scene) return;

  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    if (mesh.material) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of materials) {
        if (!mat) continue;
        for (const key of Object.keys(mat)) {
          const value = (mat as unknown as Record<string, unknown>)[key];
          if (value && typeof value === "object" && "isTexture" in value) {
            (value as THREE.Texture).dispose();
          }
        }
        mat.dispose();
      }
    }
  });
}

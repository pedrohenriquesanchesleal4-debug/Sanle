import * as THREE from "three";

export interface SpatialNodeDatum {
  id: number;
  position: THREE.Vector3;
  cluster: number;
  isOpportunity: boolean;
  baseScale: number;
}

/**
 * Constrói a rede de conexões espaciais (LineSegments) entre os pontos de empresas
 * e destaca a trilha da oportunidade prioritária em #B7F36B.
 */
export function buildConnectionNetwork(nodes: SpatialNodeDatum[]): {
  networkLines: THREE.LineSegments;
  networkMaterial: THREE.LineBasicMaterial;
  opportunityLines: THREE.LineSegments;
  opportunityMaterial: THREE.LineBasicMaterial;
} {
  const regularPositions: number[] = [];
  const opportunityPositions: number[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]!;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]!;
      const dist = a.position.distanceTo(b.position);

      if (a.isOpportunity || b.isOpportunity) {
        if (dist < 2.65) {
          opportunityPositions.push(
            a.position.x,
            a.position.y,
            a.position.z,
            b.position.x,
            b.position.y,
            b.position.z
          );
        }
      } else if (dist < 1.85 && (i + j) % 2 === 0) {
        regularPositions.push(
          a.position.x,
          a.position.y,
          a.position.z,
          b.position.x,
          b.position.y,
          b.position.z
        );
      }
    }
  }

  const netGeo = new THREE.BufferGeometry();
  netGeo.setAttribute("position", new THREE.Float32BufferAttribute(regularPositions, 3));
  const networkMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color("#78A9FF"),
    transparent: true,
    opacity: 0.14,
    depthWrite: false
  });
  const networkLines = new THREE.LineSegments(netGeo, networkMaterial);

  const oppGeo = new THREE.BufferGeometry();
  oppGeo.setAttribute("position", new THREE.Float32BufferAttribute(opportunityPositions, 3));
  const opportunityMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color("#B7F36B"),
    transparent: true,
    opacity: 0.25,
    depthWrite: false
  });
  const opportunityLines = new THREE.LineSegments(oppGeo, opportunityMaterial);

  return {
    networkLines,
    networkMaterial,
    opportunityLines,
    opportunityMaterial
  };
}

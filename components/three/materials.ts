import * as THREE from 'three';
import { TOKENS } from '@/lib/design/tokens';

export function getCategoryColor(category: string): string {
  const cat = TOKENS.categories[category as keyof typeof TOKENS.categories];
  return cat ? cat.color : TOKENS.categories.other.color;
}

export function createGlassMaterial(color: string = '#14171E'): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    transmission: 0.85,
    roughness: 0.2,
    thickness: 0.6,
    ior: 1.45,
    transparent: true,
    opacity: 0.8,
  });
}

export function createCoinMetalMaterial(color: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 0.85,
    roughness: 0.25,
  });
}

export function createGlowMaterial(color: string): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    toneMapped: false,
    transparent: true,
    opacity: 0.8,
  });
}

export function createGoldSealMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#D4A373'),
    emissive: new THREE.Color('#4a3512'),
    metalness: 1.0,
    roughness: 0.2,
  });
}

export function createMattePlatformMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#14171E'),
    roughness: 0.85,
    metalness: 0.1,
  });
}

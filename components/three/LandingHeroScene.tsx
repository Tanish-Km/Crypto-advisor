'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function LandingHeroScene() {
  const centralOrbRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (centralOrbRef.current) {
      centralOrbRef.current.rotation.y += delta * 0.25;
      centralOrbRef.current.rotation.x = Math.sin(t * 0.4) * 0.15;
      // Pointer subtle parallax
      centralOrbRef.current.position.x = THREE.MathUtils.lerp(
        centralOrbRef.current.position.x,
        1.8 + state.pointer.x * 0.5,
        0.05
      );
      centralOrbRef.current.position.y = THREE.MathUtils.lerp(
        centralOrbRef.current.position.y,
        state.pointer.y * 0.5,
        0.05
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }

    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * 0.4;
    }
  });

  const categoryPlanets = [
    { color: '#D4A373', radius: 2.2, speed: 1.0, size: 0.22, y: 0.3 }, // Store of value (champagne gold)
    { color: '#8FB8D6', radius: 2.8, speed: 0.8, size: 0.26, y: -0.4 }, // Smart contract (silver-cyan)
    { color: '#CC79A7', radius: 3.4, speed: 0.6, size: 0.2, y: 0.5 }, // DeFi
    { color: '#68CFA4', radius: 4.0, speed: 0.5, size: 0.24, y: -0.2 }, // Stablecoin (seafoam)
    { color: '#8B7CFF', radius: 4.6, speed: 0.4, size: 0.18, y: 0.2 }, // Layer 2 / other
  ];

  return (
    <group ref={centralOrbRef} position={[1.8, 0, 0]}>
      {/* Central Glass Orb (The Crypto Compass Core) */}
      <mesh>
        <sphereGeometry args={[1.3, 48, 48]} />
        <meshPhysicalMaterial
          color="#14171E"
          transmission={0.88}
          roughness={0.15}
          thickness={0.8}
          ior={1.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Internal Glowing Core */}
      <mesh>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#8FB8D6"
          emissive="#8FB8D6"
          emissiveIntensity={0.8}
          metalness={0.9}
        />
      </mesh>

      {/* Equatorial Glass Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.7, 1.95, 64]} />
        <meshStandardMaterial
          color="#8FB8D6"
          metalness={0.9}
          roughness={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Orbiting Category Planets */}
      <group ref={orbitGroupRef}>
        {categoryPlanets.map((p, idx) => {
          const angle = (idx / categoryPlanets.length) * Math.PI * 2;
          const x = Math.cos(angle) * p.radius;
          const z = Math.sin(angle) * p.radius;

          return (
            <group key={idx} position={[x, p.y, z]}>
              <mesh>
                <sphereGeometry args={[p.size, 24, 24]} />
                <meshStandardMaterial color={p.color} metalness={0.85} roughness={0.25} />
              </mesh>
              {/* Subtle Planet Glow */}
              <mesh>
                <sphereGeometry args={[p.size * 1.3, 16, 16]} />
                <meshBasicMaterial color={p.color} transparent opacity={0.25} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
